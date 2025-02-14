import prisma from "../../config/prisma.js";

export const GetAllEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        employeeCode: true,
        fullName: true,
        emailAddress: true,
        dateOfJoining: true,
        probationEndDate: true,
        isOnNoticePeriod: true,
        employmentType: true,
        isActive: true,
        Gender: true,
        has_children: true,
        createdAt: true,
        updatedAt: true,
        role: {
          select: {
            id: true,
            name: true
          }
        },
        country: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        department: {
          select: {
            id: true,
            name: true
          }
        },
        manager: {
          select: {
            id: true,
            fullName: true,
            employeeCode: true
          }
        },
        BUnitHead: {
          select: {
            id: true,
            fullName: true,
            employeeCode: true
          }
        },
        leaveBalance: {
          select: {
            id: true,
            year: true,
            entitledDays: true,
            usedDays: true,
            remainingDays: true,
            carryForwardDays: true,
            leavePolicy: {
              select: {
                id: true,
                allowedDays: true,
                maxCarryForward: true,
                leaveType: {
                  select: {
                    id: true,
                    name: true,
                    description: true
                  }
                }
              }
            }
          }
        }
      }
    });

    const transformedEmployees = employees.map((employee) => ({
      id: employee.id,
      employeeCode: employee.employeeCode,
      fullName: employee.fullName,
      emailAddress: employee.emailAddress,
      dateOfJoining: employee.dateOfJoining,
      employmentType: employee.employmentType,
      isActive: employee.isActive,
      gender: employee.Gender,
      hasChildren: employee.has_children,
      role: employee.role,
      country: employee.country,
      department: employee.department,
      manager: employee.manager,
      BUHead: employee.BUnitHead,
      leaveBalances: employee.leaveBalance.map((balance) => ({
        id: balance.id,
        year: balance.year,
        entitled: balance.entitledDays,
        used: balance.usedDays,
        remaining: balance.remainingDays,
        carryForward: balance.carryForwardDays,
        policy: {
          id: balance.leavePolicy.id,
          allowedDays: balance.leavePolicy.allowedDays,
          maxCarryForward: balance.leavePolicy.maxCarryForward,
          leaveType: balance.leavePolicy.leaveType
        }
      })),
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt
    }));

    res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      data: transformedEmployees
    });
  } catch (error) {
    console.error("Error in GetAllEmployees:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
      error: error.message
    });
  }
};

export default GetAllEmployees;
