import prisma from "../../config/prisma.js";

export const UpdateEmployeeByID = async (req, res) => {
  const { employeeId } = req.params;
  const {
    fullName,
    emailAddress,
    roleId,
    departmentId,
    countryId,
    dateOfJoining,
    employeeCode,
    isActive
  } = req.body;

  try {
    // Validation
    if (!fullName || !emailAddress || !roleId || !countryId) {
      return res.status(400).json({
        success: false,
        message:
          "Required fields missing: fullName, emailAddress, roleId, and countryId are required"
      });
    }

    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id: parseInt(employeeId) }
    });

    if (!existingEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    // Update employee
    const updatedEmployee = await prisma.employee.update({
      where: { id: parseInt(employeeId) },
      data: {
        fullName,
        emailAddress,
        roleId: parseInt(roleId),
        departmentId: departmentId ? parseInt(departmentId) : null,
        countryId: parseInt(countryId),
        dateOfJoining: new Date(dateOfJoining),
        employeeCode,
        isActive,
        updatedAt: new Date()
      },
      include: {
        role: true,
        department: true,
        country: true,
        manager: {
          select: {
            id: true,
            fullName: true,
            emailAddress: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: updatedEmployee
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update employee",
      error: error.message
    });
  }
};
