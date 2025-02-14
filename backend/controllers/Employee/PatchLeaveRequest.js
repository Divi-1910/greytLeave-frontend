import prisma from "../../config/prisma.js";
import { sendEmail } from "../../utils/email.js";

const getEmployeeId = (req) => {
  return req.employee?.id || req.employee?.employeeId;
};

const invalidateAndUpdateCache = async (employeeId, year) => {
  const cacheKey = `approved-leaves:${employeeId}:${year}`;
  const approvedLeaves = await prisma.leaveRequest.findMany({
    where: {
      employeeId,
      status: "Approved",
      startDate: {
        gte: new Date(year, 0, 1)
      }
    },
    orderBy: { startDate: "asc" },
    select: {
      id: true,
      startDate: true,
      endDate: true,
      leaveType: { select: { name: true } }
    }
  });

  await redis.set(cacheKey, JSON.stringify(approvedLeaves), "EX", 24 * 60 * 60);
};

const createLeaveStatusEmailTemplate = (leaveRequest, status) => {
  const statusColor = status === "Approved" ? "#28a745" : "#dc3545";
  const statusMessage =
    status === "Approved"
      ? "Your leave request has been approved."
      : `Your leave request has been rejected. Reason: ${
          leaveRequest.rejectionReason || "No reason provided"
        }`;

  return {
    subject: `Leave Request ${status} - ${leaveRequest.leavePolicy.leaveType.name}`,
    body: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">Leave Request Update</h2>
        
        <div style="margin: 20px 0;">
          <p style="color: ${statusColor}; font-weight: bold; font-size: 18px;">${statusMessage}</p>
          
          <h3 style="color: #666;">Leave Details:</h3>
          <p><strong>Leave Type:</strong> ${
            leaveRequest.leavePolicy.leaveType.name
          }</p>
          <p><strong>Duration:</strong> ${
            leaveRequest.requestedNumberOfDays
          } day(s)</p>
          <p><strong>From:</strong> ${new Date(
            leaveRequest.startDate
          ).toLocaleDateString()}</p>
          <p><strong>To:</strong> ${new Date(
            leaveRequest.endDate
          ).toLocaleDateString()}</p>
          <p><strong>Status:</strong> <span style="color: ${statusColor};">${status}</span></p>
          ${
            status === "Approved"
              ? `<p><strong>Approved By:</strong> ${leaveRequest.approvedBy.fullName}</p>`
              : `<p><strong>Rejection Reason:</strong> ${
                  leaveRequest.rejectionReason || "No reason provided"
                }</p>`
          }
        </div>
        
        <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; color: #666;">
          This is an automated notification. Please contact HR if you have any questions.
        </p>
      </div>
    `
  };
};

export const PatchLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;
    const approvedById = getEmployeeId(req);

    if (!approvedById) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: Employee ID not found"
      });
    }

    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        employee: true,
        leavePolicy: {
          include: {
            leaveType: true
          }
        },
        approvedBy: {
          select: {
            id: true,
            fullName: true,
            emailAddress: true
          }
        }
      }
    });

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found"
      });
    }

    if (leaveRequest.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "This leave request has already been processed"
      });
    }

    const result = await prisma.$transaction(async (prisma) => {
      if (status === "Approved") {
        const currentBalance = await prisma.leaveBalance.findFirst({
          where: {
            employeeId: leaveRequest.employeeId,
            leavePolicyId: leaveRequest.leavePolicyId,
            year: new Date().getFullYear()
          }
        });

        if (!currentBalance) {
          throw new Error("Leave balance record not found");
        }

        if (currentBalance.remainingDays < leaveRequest.requestedNumberOfDays) {
          throw new Error(
            `Insufficient leave balance. Available: ${currentBalance.remainingDays} days, Requested: ${leaveRequest.requestedNumberOfDays} days`
          );
        }

        await prisma.leaveBalance.update({
          where: { id: currentBalance.id },
          data: {
            usedDays: { increment: leaveRequest.requestedNumberOfDays },
            remainingDays: { decrement: leaveRequest.requestedNumberOfDays }
          }
        });
      }

      const updatedLeaveRequest = await prisma.leaveRequest.update({
        where: { id: parseInt(id, 10) },
        data: {
          status:
            status === "Approved"
              ? "Approved"
              : status === "Rejected"
              ? "Rejected"
              : "Cancelled",
          approvedById,
          approvalDate: new Date(),
          rejectionReason: status === "Rejected" ? rejectionReason : null
        },
        include: {
          employee: {
            select: {
              id: true,
              fullName: true,
              emailAddress: true
            }
          },
          leavePolicy: {
            include: {
              leaveType: true
            }
          },
          approvedBy: {
            select: {
              id: true,
              fullName: true,
              emailAddress: true
            }
          }
        }
      });

      return updatedLeaveRequest;
    });

    await invalidateAndUpdateCache(
      result.employee.id,
      new Date().getFullYear()
    );

    if (result.employee.emailAddress) {
      const emailTemplate = createLeaveStatusEmailTemplate(result, status);
      try {
        await sendEmail(
          result.employee.emailAddress,
          emailTemplate.subject,
          emailTemplate.body
        );
        console.log(
          `Leave status notification email sent to ${result.employee.emailAddress}`
        );
      } catch (emailError) {
        console.error(
          "Failed to send leave status notification email:",
          emailError
        );
      }
    }

    res.status(200).json({
      success: true,
      message: `Leave request ${status.toLowerCase()} successfully`,
      data: result
    });
  } catch (error) {
    console.error("Error updating leave request:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};
