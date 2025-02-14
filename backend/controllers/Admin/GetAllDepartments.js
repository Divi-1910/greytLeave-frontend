import prisma from "../../config/prisma.js";

export const getAllDepartments = async (req, res) => {
  try {
    const department = await prisma.department.findMany();

    res.json(department);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch countries" });
  }
};
