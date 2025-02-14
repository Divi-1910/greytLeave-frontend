import prisma from "../../config/prisma.js";

const getEmployeeId = (req) => {
  return req.employee?.id || req.employee?.employeeId;
};
export const GetAllLeaveBalances = async (req, res) => {
  try {
    const id = getEmployeeId(req);

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Employee ID not found"
      });
    }

    // Get current year
    const currentYear = new Date().getFullYear();

    // Fetch employee with their country and department
    const employee = await prisma.employee.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        employeeCode: true,
        dateOfJoining: true,
        countryId: true,
        country: {
          select: {
            name: true,
            code: true
          }
        },
        department: {
          select: {
            name: true
          }
        }
      }
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    // Fetch leave balances with policy details
    const leaveBalances = await prisma.leaveBalance.findMany({
      where: {
        employeeId: id,
        year: currentYear
      },
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
                description: true,
                requiresProof: true
              }
            }
          }
        }
      }
    });

    // Fetch leave requests for the current year
    const leaveRequests = await prisma.leaveRequest.findMany({
      where: {
        employeeId: id,
        startDate: {
          gte: new Date(currentYear, 0, 1),
          lte: new Date(currentYear, 11, 31)
        }
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        status: true,
        requestedNumberOfDays: true,
        leavePolicy: {
          select: {
            leaveType: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        startDate: "desc"
      }
    });

    // Process and structure the data
    const processedBalances = leaveBalances.map((balance) => ({
      id: balance.id,
      leaveType: balance.leavePolicy.leaveType.name,
      description: balance.leavePolicy.leaveType.description,
      requiresProof: balance.leavePolicy.leaveType.requiresProof,
      entitled: {
        total: balance.entitledDays,
        carryForward: balance.carryForwardDays,
        maxCarryForward: balance.leavePolicy.maxCarryForward
      },
      usage: {
        used: balance.usedDays,
        remaining: balance.remainingDays,
        pending: leaveRequests
          .filter(
            (req) =>
              req.status === "Pending" &&
              req.leavePolicy.leaveType.name ===
                balance.leavePolicy.leaveType.name
          )
          .reduce((sum, req) => sum + req.requestedNumberOfDays, 0)
      }
    }));

    // Group leave requests by status
    const groupedRequests = leaveRequests.reduce((acc, request) => {
      const status = request.status.toLowerCase();
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push({
        id: request.id,
        leaveType: request.leavePolicy.leaveType.name,
        startDate: request.startDate,
        endDate: request.endDate,
        days: request.requestedNumberOfDays
      });
      return acc;
    }, {});

    const data = {
      employee: {
        id: employee.id,
        name: employee.fullName,
        code: employee.employeeCode,
        joiningDate: employee.dateOfJoining,
        department: employee.department?.name,
        country: employee.country.name
      },
      year: currentYear,
      balances: processedBalances,
      recentRequests: groupedRequests,
      summary: {
        totalEntitled: processedBalances.reduce(
          (sum, balance) => sum + balance.entitled.total,
          0
        ),
        totalUsed: processedBalances.reduce(
          (sum, balance) => sum + balance.usage.used,
          0
        ),
        totalRemaining: processedBalances.reduce(
          (sum, balance) => sum + balance.usage.remaining,
          0
        ),
        totalPending: processedBalances.reduce(
          (sum, balance) => sum + balance.usage.pending,
          0
        )
      }
    };

    return res.status(200).json({
      success: true,
      message: "Leave balances fetched successfully",
      data: data
    });
  } catch (error) {
    console.error("Error fetching leave balances:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};
