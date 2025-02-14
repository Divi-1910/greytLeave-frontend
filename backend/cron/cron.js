import prisma from "../config/prisma.js";

export async function resetAnnualLeaveBalances() {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  try {
    const employees = await prisma.employee.findMany({
      where: { isActive: true },
      include: {
        leaveBalance: {
          include: {
            leavePolicy: true
          }
        }
      }
    });

    for (const employee of employees) {
      const leavePolicies = await prisma.leavePolicy.findMany({
        where: { countryId: employee.countryId }
      });

      for (const policy of leavePolicies) {
        const previousBalance = employee.leaveBalance.find(
          (balance) =>
            balance.year === previousYear && balance.leavePolicyId === policy.id
        );

        let carryForwardDays = 0;
        if (previousBalance) {
          carryForwardDays = Math.min(
            previousBalance.remainingDays,
            policy.maxCarryForward
          );
        }

        await prisma.leaveBalance.upsert({
          where: {
            employeeId_leavePolicyId_year: {
              employeeId: employee.id,
              leavePolicyId: policy.id,
              year: currentYear
            }
          },
          update: {
            entitledDays: policy.allowedDays,
            remainingDays: policy.allowedDays + carryForwardDays,
            carryForwardDays: carryForwardDays,
            usedDays: 0
          },
          create: {
            employeeId: employee.id,
            leavePolicyId: policy.id,
            year: currentYear,
            entitledDays: policy.allowedDays,
            remainingDays: policy.allowedDays + carryForwardDays,
            carryForwardDays: carryForwardDays,
            usedDays: 0
          }
        });
      }
    }

    console.log("Leave balances reset successfully for year:", currentYear);
  } catch (error) {
    console.error("Error resetting leave balances:", error);
    throw error;
  }
}
