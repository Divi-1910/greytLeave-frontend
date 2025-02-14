console.log("Starting seed process...");
import { PrismaClient } from "@prisma/client";
import {
  countries,
  departments,
  roles,
  leaveTypes,
  leavePolicies,
  holidays
} from "../data.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const __dirname = path.dirname(decodeURI(new URL(import.meta.url).pathname));
const employees = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../scripts/employee.json"), "utf8")
);
const prisma = new PrismaClient();

// Reset the database
const resetDatabase = async () => {
  console.log("Resetting database...");
  try {
    await prisma.$transaction([
      prisma.leaveBalance.deleteMany({}),
      prisma.leaveRequest.deleteMany({}),
      prisma.leavePolicy.deleteMany({}),
      prisma.leaveType.deleteMany({}),
      prisma.employee.deleteMany({}),
      prisma.department.deleteMany({}),
      prisma.role.deleteMany({}),
      prisma.holiday.deleteMany({}),
      prisma.country.deleteMany({}),
      prisma.admin.deleteMany({})
    ]);
    console.log("Database reset complete.");
  } catch (error) {
    console.error("Error resetting database:", error);
    throw error;
  }
};

// Seed basic data (countries, departments, roles, leave types, holidays, and leave policies)
const seedBasicData = async () => {
  console.log("Seeding basic data...");
  try {
    // Create countries, departments, roles, leave types, and holidays
    await prisma.$transaction([
      ...countries.map((country) => prisma.country.create({ data: country })),
      ...departments.map((department) =>
        prisma.department.create({ data: department })
      ),
      ...roles.map((role) => prisma.role.create({ data: role })),
      ...leaveTypes.map((leaveType) =>
        prisma.leaveType.create({ data: leaveType })
      ),
      ...holidays.map((holiday) => prisma.holiday.create({ data: holiday }))
    ]);

    // Create leave policies in a transaction
    await prisma.$transaction(
      leavePolicies.map((policy) => prisma.leavePolicy.create({ data: policy }))
    );

    // Create admin user
    await prisma.admin.create({
      data: {
        emailAddress: process.env.ADMIN_EMAIL,
        hashedPassword: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 12)
      }
    });

    console.log("Basic data seeded successfully!");
  } catch (error) {
    console.error("Error seeding basic data:", error);
    throw error;
  }
};

// Seed employees and their leave balances
const seedEmployees = async () => {
  console.log("Seeding employees...");
  try {
    const employeeIdMap = new Map();
    const currentYear = new Date().getFullYear();

    // Phase 1: Create employees without relationships
    const createPromises = employees.map((emp) => {
      const employeeData = {
        employeeCode: emp.employeeCode,
        fullName: emp.fullName,
        emailAddress: emp.emailAddress.trim(),
        passwordHash: bcrypt.hashSync(
          emp.passwordHash === "None" ? "Default@123" : emp.passwordHash,
          12
        ),
        dateOfJoining: new Date(emp.dateOfJoining),
        probationEndDate: emp.probationEndDate
          ? new Date(emp.probationEndDate)
          : null,
        isOnNoticePeriod: emp.isOnNoticePeriod || false,
        employmentType: emp.employmentType,
        isActive: emp.isActive ?? true,
        roleId: emp.roleId,
        countryId: emp.countryId,
        departmentId: emp.departmentId || null,
        Gender: emp.Gender || "Other",
        has_children: emp.has_children || false,
        isMarried: emp.isMarried || false,
        managerId: null,
        BUHeadId: null
      };

      return prisma.employee.create({ data: employeeData });
    });

    // Execute all employee creation promises in a transaction
    const createdEmployees = await prisma.$transaction(createPromises);

    // Map employee IDs
    createdEmployees.forEach((employee, index) => {
      employeeIdMap.set(employees[index].id, employee.id);
    });

    console.log(`Created ${createdEmployees.length} employees`);

    // Phase 2: Update relationships (manager and BUHead)
    const updatePromises = employees.map((emp) => {
      const updates = {};
      if (emp.managerId && employeeIdMap.has(emp.managerId)) {
        updates.managerId = employeeIdMap.get(emp.managerId);
      }
      if (emp.BUHeadId && employeeIdMap.has(emp.BUHeadId)) {
        updates.BUHeadId = employeeIdMap.get(emp.BUHeadId);
      }
      if (Object.keys(updates).length > 0) {
        return prisma.employee.update({
          where: { id: employeeIdMap.get(emp.id) },
          data: updates
        });
      }
    });

    // Filter out undefined values (employees with no updates)
    const filteredUpdatePromises = updatePromises.filter(Boolean);
    await Promise.all(filteredUpdatePromises);
    console.log("Updated employee relationships");

    // Phase 3: Create leave balances with eligibility checks
    console.log("Creating leave balances...");
    const balancePromises = employees.flatMap((emp) => {
      const employeeId = employeeIdMap.get(emp.id);
      const countryPolicies = leavePolicies.filter(
        (p) => p.countryId === emp.countryId
      );

      return countryPolicies
        .filter((policy) => {
          const leaveType = leaveTypes.find(
            (lt) => lt.id === policy.leaveTypeId
          );
          if (!leaveType) return false;

          // Eligibility rules
          switch (policy.leaveTypeId) {
            case 1: // Child Care Leave
              return emp.has_children;
            case 6: // Miscarriage Leave
            case 8: // Maternity Leave
              return emp.Gender === "Female";
            case 7: // Marriage Leave
              return !emp.isMarried;
            case 9: // Paternity Leave
              return emp.Gender === "Male";
            case 13: // Adoption Leave
              return !emp.has_children;
            case 15: // Birthday Leave
              return true; // Everyone gets birthday leave
            default:
              return true;
          }
        })
        .map((policy) =>
          prisma.leaveBalance.create({
            data: {
              year: currentYear,
              entitledDays: policy.allowedDays,
              usedDays: 0,
              remainingDays: policy.allowedDays,
              carryForwardDays: 0,
              employeeId,
              leavePolicyId: policy.id
            }
          })
        );
    });

    await Promise.all(balancePromises);
    console.log("Created leave balances with eligibility checks");

    console.log("Employee seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding employees:", error);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    await seedBasicData();
    await seedEmployees();
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error in database seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

// Entry point
async function main() {
  try {
    console.log("Starting database seeding...");
    await resetDatabase();
    await seedDatabase();
    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed script failed:", error);
    process.exit(1);
  });
