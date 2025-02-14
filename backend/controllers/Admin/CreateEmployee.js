import prisma from "../../config/prisma.js";

export const createEmployee = async (req, res) => {
  try {
    const {
      employeeCode,
      fullName,
      emailAddress,
      dateOfJoining,
      probationEndDate,
      isOnNoticePeriod,
      employmentType,
      isActive,
      roleId,
      countryId,
      departmentId,
      managerId,
      Gender,
      BUHeadId,
      has_children
    } = req.body;
    console.log("inside creation");
    if (
      !employeeCode ||
      !fullName ||
      !emailAddress ||
      !dateOfJoining ||
      !roleId ||
      !countryId ||
      !Gender
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const existingEmployee = await prisma.employee.findFirst({
      where: {
        OR: [{ emailAddress: emailAddress }, { employeeCode: employeeCode }]
      }
    });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Employee with this email or employee code already exists"
      });
    }
    const hashedPassword = "12345678910";

    const newEmployee = await prisma.employee.create({
      data: {
        employeeCode,
        fullName,
        emailAddress,
        passwordHash: hashedPassword,
        dateOfJoining: new Date(dateOfJoining),
        probationEndDate: probationEndDate ? new Date(probationEndDate) : null,
        isOnNoticePeriod: isOnNoticePeriod || false,
        employmentType,
        isActive: isActive ?? true,
        roleId: parseInt(roleId),
        countryId: parseInt(countryId),
        departmentId: departmentId ? parseInt(departmentId) : null,
        managerId: managerId ? parseInt(managerId) : null,
        Gender,
        BUHeadId: BUHeadId ? parseInt(BUHeadId) : null,
        has_children: has_children || false
      },
      include: {
        role: true,
        country: true,
        department: true,
        manager: {
          select: {
            id: true,
            fullName: true,
            emailAddress: true
          }
        },
        BUnitHead: {
          select: {
            id: true,
            fullName: true,
            emailAddress: true
          }
        }
      }
    });

    const leavePolicies = await prisma.leavePolicy.findMany({
      where: {
        countryId: parseInt(countryId),
        isEnabled: true
      },
      include: {
        leaveType: true
      }
    });

    const leaveBalancePromises = leavePolicies.map((policy) =>
      prisma.leaveBalance.create({
        data: {
          year: new Date().getFullYear(),
          entitledDays: policy.allowedDays,
          usedDays: 0,
          remainingDays: policy.allowedDays,
          carryForwardDays: 0,
          employeeId: newEmployee.id,
          leavePolicyId: policy.id
        }
      })
    );

    await Promise.all(leaveBalancePromises);

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: {
        ...newEmployee
      }
    });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create employee",
      error: error.message
    });
  }
};
