import prisma from "../../config/prisma.js";
import redis from "../../config/redis.js";

const getEmployeeId = (req) => {
  return req.employee?.id || req.employee?.employeeId;
};

export const getAllHolidays = async (req, res) => {
  try {
    const id = getEmployeeId(req);

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Employee ID not found"
      });
    }

    const employee = await prisma.employee.findUnique({
      where: { id },
      select: { countryId: true }
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    const currentYear = new Date().getFullYear();
    const cacheKey = `holidays:${employee.countryId}:${currentYear}`;

    let holidays = await redis.get(cacheKey);
    if (holidays) {
      holidays = JSON.parse(holidays);
    } else {
      holidays = await prisma.holiday.findMany({
        where: {
          countryId: employee.countryId,
          date: {
            gte: new Date(currentYear, 0, 1),
            lte: new Date(currentYear, 11, 31)
          }
        },
        orderBy: { date: "asc" },
        select: {
          id: true,
          name: true,
          date: true,
          isOptional: true
        }
      });
      await redis.set(cacheKey, JSON.stringify(holidays), "EX", 24 * 60 * 60);
    }

    return res.status(200).json({
      success: true,
      message: "Holidays fetched successfully",
      data: holidays
    });
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const getApprovedLeaveRequests = async (req, res) => {
  try {
    const id = getEmployeeId(req);

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Employee ID not found"
      });
    }
    const currentDate = new Date().getDate();
    const cacheKey = `approved-leaves:${id}:${currentDate}`;

    let approvedLeaves = await redis.get(cacheKey);
    if (approvedLeaves) {
      approvedLeaves = JSON.parse(approvedLeaves);
    } else {
      approvedLeaves = await prisma.leaveRequest.findMany({
        where: {
          employeeId: id,
          status: "Approved"
        },
        select: {
          startDate: true,
          endDate: true,
          reason: true,
          requestedNumberOfDays: true,
          leavePeriod: true,
          leavePolicy: {
            include: {
              leaveType: true
            }
          }
        }
      });

      await redis.set(
        cacheKey,
        JSON.stringify(approvedLeaves),
        "EX",
        24 * 60 * 60
      );
    }

    return res.status(200).json({
      success: true,
      message: "Approved leave requests retrieved successfully",
      data: approvedLeaves
    });
  } catch (error) {
    console.error("Error fetching approved leave requests:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
