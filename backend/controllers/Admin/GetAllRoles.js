import prisma from "../../config/prisma.js";

export const GetAllRoles = async (req , res) => {
    try {
		const roles = await prisma.role.findMany();
		res.json(roles);
	} catch (error) {
		console.error(error);
		res.status(500).json({error: "Failed to fetch roles"});
	}
}