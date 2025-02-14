import prisma from "../../config/prisma.js";
import { sendEmail } from "../../utils/email.js";

const getEmployeeId = (req) => {
  return req.employee?.id || req.employee?.employeeId;
};

const createEmailTemplate = (leaveRequest, totalDays) => {
  return {
    subject: `Leave Request from ${leaveRequest.employee.fullName}`,
    body: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Leave Request</h2>
        
        <div style="margin: 20px 0;">
          <p><strong>Employee:</strong> ${leaveRequest.employee.fullName} (${
      leaveRequest.employee.employeeCode
    })</p>
          <p><strong>Leave Type:</strong> ${
            leaveRequest.leavePolicy.leaveType.name
          }</p>
          <p><strong>Duration:</strong> ${totalDays} day(s)</p>
          <p><strong>Period:</strong> ${leaveRequest.leavePeriod}</p>
          <p><strong>From:</strong> ${new Date(
            leaveRequest.startDate
          ).toLocaleDateString()}</p>
          <p><strong>To:</strong> ${new Date(
            leaveRequest.endDate
          ).toLocaleDateString()}</p>
          <p><strong>Reason:</strong> ${leaveRequest.reason}</p>
          <p><strong>Status:</strong> <span style="color: #f90;">Pending Approval</span></p>
        </div>
        
        <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
          Please review this request at your earliest convenience.
        </p>
      </div>
    `
  };
};

export const SubmitLeaveRequest = async (req, res) => {
  try {
    const {
      leaveTypeId,
      startDate,
      endDate,
      leavePeriod,
      startSession,
      endSession,
      reason,
      totalDays,
      supportingDoc,
      submissionDate
    } = req.body;
    console.log(supportingDoc);
    console.log("Request body:", req.body);
    const employeeId = getEmployeeId(req);
    console.log("Employee ID:", employeeId);

    if (!employeeId) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: Employee ID not found"
      });
    }

    if (
      !startDate ||
      !endDate ||
      !leaveTypeId ||
      !reason ||
      !leavePeriod ||
      !totalDays
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        required: [
          "startDate",
          "endDate",
          "leaveTypeId",
          "reason",
          "leavePeriod",
          "totalDays"
        ]
      });
    }

    if (leavePeriod === "HalfDay" && !startSession) {
      return res.status(400).json({
        success: false,
        message: "Session selection is required for half-day leave"
      });
    }

    if (leavePeriod === "Mixed" && (!startSession || !endSession)) {
      return res.status(400).json({
        success: false,
        message: "Both start and end sessions are required for mixed leave"
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const submission = new Date(submissionDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format"
      });
    }

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        leaveBalance: {
          include: { leavePolicy: true }
        }
      }
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    console.log(employee.leaveBalance);
    console.log(leaveTypeId);
    const leaveBalance = employee.leaveBalance.find(
      (lb) => lb.leavePolicy.id === parseInt(leaveTypeId)
    );

    if (!leaveBalance) {
      return res.status(400).json({
        success: false,
        message: "No matching leave balance found for the leave type"
      });
    }

    if (leaveBalance.remainingDays < parseFloat(totalDays)) {
      return res.status(400).json({
        success: false,
        message: "Insufficient leave balance",
        data: {
          remainingDays: leaveBalance.remainingDays,
          requestedDays: totalDays
        }
      });
    }

    const existingRequest = await prisma.leaveRequest.findFirst({
      where: {
        employeeId,
        NOT: { status: "Rejected" },
        OR: [
          {
            AND: [{ startDate: { lte: end } }, { endDate: { gte: start } }]
          }
        ]
      }
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already have a leave request for these dates"
      });
    }

    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        startDate: start,
        endDate: end,
        leavePeriod,
        reason,
        requestedNumberOfDays: parseFloat(totalDays),
        status: "Pending",
        employeeId,
        leavePolicyId: parseInt(leaveTypeId),
        supportingDoc: supportingDoc.toString(),
        createdAt: submission
      },
      include: {
        employee: {
          select: {
            fullName: true,
            employeeCode: true,
            manager: {
              select: {
                id: true,
                fullName: true,
                emailAddress: true
              }
            }
          }
        },
        leavePolicy: {
          include: {
            leaveType: true
          }
        }
      }
    });

    if (leaveRequest.employee.manager?.emailAddress) {
      const emailTemplate = createEmailTemplate(leaveRequest, totalDays);
      try {
        await sendEmail(
          leaveRequest.employee.manager.emailAddress,
          emailTemplate.subject,
          emailTemplate.body
        );
        console.log("Manager notification email sent successfully");
      } catch (emailError) {
        console.error("Failed to send manager notification email:", emailError);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Leave request submitted successfully",
      data: {
        leaveRequest,
        currentBalance: leaveBalance.remainingDays
      }
    });
  } catch (error) {
    console.error("Error submitting leave request:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};
