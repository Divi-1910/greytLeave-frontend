import prisma from "../../config/prisma.js";

const getEmployeeId = (req) => {
  return req.employee?.id || req.employee?.employeeId;
};

export const GetSubordinateLeaveRequests = async (req, res) => {
  try {
    const id = getEmployeeId(req);
    //  console.log("inside the getSubordinateLeaveRequests - ", id);
    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: Employee ID not found"
      });
    }

    const subordinates = await prisma.employee.findMany({
      where: { managerId: id },
      select: { id: true }
    });
    //   console.log("subordinates - ", subordinates);

    const subordinateIds = subordinates.map((sub) => sub.id);
    const leaveRequests = await prisma.leaveRequest.findMany({
      where: { employeeId: { in: subordinateIds } }, // Changed from 'id' to 'employeeId'
      include: {
        employee: true,
        leavePolicy: {
          include: {
            leaveType: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: leaveRequests
    });
  } catch (error) {
    console.error("Error fetching subordinate leave requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subordinate leave requests",
      error: error.message
    });
  }
};
