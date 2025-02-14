import prisma from "../../config/prisma.js";

const getEmployeeId = (req) => {
  return req.employee?.id || req.employee?.employeeId;
};

export const GetLeaveTypes = async (req, res) => {
  try {
    const id = getEmployeeId(req);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid request: Missing employee ID"
      });
    }

    const employee = await prisma.employee.findUnique({
      select: { countryId: true },
      where: { id }
    });

    console.log("console logging the employee country id", employee);

    if (!employee || !employee.countryId) {
      return res.status(404).json({
        success: false,
        message: "Employee not found or missing country information"
      });
    }

    const { countryId } = employee;
    const leaveTypesAndBalances = await prisma.leavePolicy.findMany({
      where: {
        countryId: countryId,
        isEnabled: true,
        leaveType: { isActive: true }
      },
      select: {
        id: true,
        allowedDays: true,
        maxCarryForward: true,
        leaveType: {
          select: {
            name: true,
            description: true,
            requiresProof: true
          }
        },
        leaveBalances: {
          where: {
            employeeId: id
          },
          select: {
            entitledDays: true,
            usedDays: true,
            remainingDays: true
          }
        }
      }
    });

    if (leaveTypesAndBalances.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No leave types found for the employee's country"
      });
    }

    return res.json({
      success: true,
      message: "Leave types fetched successfully",
      data: leaveTypesAndBalances
    });
  } catch (error) {
    console.error("Error getting leave types: ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
