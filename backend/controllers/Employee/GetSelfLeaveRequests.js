import prisma from "../../config/prisma.js";

const getEmployeeId = (req) => {
  return req.employee?.id || req.employee?.employeeId;
};

export const GetSelfLeaveRequests = async (req, res) => {
  try {
    const id = getEmployeeId(req);
    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: Employee ID not found"
      });
    }

    const leaveRequests = await prisma.leaveRequest.findMany({
      where: { employeeId: id },
      include: {
        employee: true,
        leavePolicy: {
          include: {
            leaveType: true
          }
        }
      }
    });
    //  console.log("self - leaveRequests - " , leaveRequests);

    res.json({
      success: true,
      data: leaveRequests
    });
  } catch (error) {
    console.error("Leave request fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Error in fetching leave requests",
      error: error.message
    });
  }
};
