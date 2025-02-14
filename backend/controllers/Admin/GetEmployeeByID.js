import prisma from "../../config/prisma.js";

export const GetEmployeeByID = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(employeeId) },
      include: {
        leaveBalance: {
          include: {
            leavePolicy: {
              include: {
                leaveType: true
              }
            }
          }
        }
      }
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch employee" });
  }
};
