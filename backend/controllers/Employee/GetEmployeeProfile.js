import prisma from "../../config/prisma.js";

const getEmployeeId = (req) => {
  return req.employee?.id || req.employee?.employeeId;
};

export const GetEmployeeProfile = async (req, res) => {
  try {
    // console.log("getting employee profile - " , req);
    console.log("request user is - ", req.employee);
    const id = getEmployeeId(req);
    // console.log("employee id is - " , id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid request: Missing employeeCode"
      });
    }
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        role: true,
        department: true,
        country: true,
        leaveBalance: {
          include: {
            leavePolicy: {
              include: {
                leaveType: true
              }
            }
          }
        },
        subordinates: {
          include: {
            department: true,
            country: true,
            role: true
          }
        },
        leaveRequests: true,
        approvedRequests: true
      }
    });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    return res.json({
      success: true,
      message: "Employee fetched successfully.",
      data: {
        employee
      }
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
