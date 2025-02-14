import prisma from "../../config/prisma.js";

const getEmployeeId = (req) => {
  return req.employee?.id || req.employee?.employeeId;
};

export const GetAllHolidays = async (req, res) => {
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
      select: {
        countryId: true,
        country: {
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

    const currentYear = new Date().getFullYear();

    const holidays = await prisma.holiday.findMany({
      where: {
        countryId: employee.countryId,
        date: {
          gte: new Date(currentYear, 0, 1),
          lte: new Date(currentYear, 11, 31)
        }
      },
      orderBy: {
        date: "asc"
      },
      select: {
        id: true,
        name: true,
        date: true,
        isOptional: true,
        country: {
          select: {
            name: true,
            code: true
          }
        }
      }
    });

    const groupedHolidays = holidays.reduce((acc, holiday) => {
      const month = new Date(holiday.date).getMonth();
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push({
        ...holiday,
        date: holiday.date.toISOString().split("T")[0]
      });
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      message: "Holidays fetched successfully",
      data: {
        country: employee.country.name,
        year: currentYear,
        totalHolidays: holidays.length,
        holidays: groupedHolidays
      }
    });
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

export const GetHolidaysByYear = async (req, res) => {
  try {
    const id = getEmployeeId(req);
    const year = parseInt(req.params.year) || new Date().getFullYear();

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Employee ID not found"
      });
    }

    const employee = await prisma.employee.findUnique({
      where: { id },
      select: {
        countryId: true,
        country: {
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

    const holidays = await prisma.holiday.findMany({
      where: {
        countryId: employee.countryId,
        date: {
          gte: new Date(year, 0, 1),
          lte: new Date(year, 11, 31)
        }
      },
      orderBy: {
        date: "asc"
      },
      select: {
        id: true,
        name: true,
        date: true,
        isOptional: true,
        country: {
          select: {
            name: true,
            code: true
          }
        }
      }
    });

    const groupedHolidays = holidays.reduce((acc, holiday) => {
      const month = new Date(holiday.date).getMonth();
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push({
        ...holiday,
        date: holiday.date.toISOString().split("T")[0]
      });
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      message: "Holidays fetched successfully",
      data: {
        country: employee.country.name,
        year: year,
        totalHolidays: holidays.length,
        holidays: groupedHolidays
      }
    });
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};
