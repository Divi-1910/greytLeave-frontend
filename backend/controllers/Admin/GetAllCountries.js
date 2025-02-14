import prisma from "../../config/prisma.js";

export const GetAllCountries = async (req , res) => {
    try {
		const countries = await prisma.country.findMany();
//		console.log("/countries ", countries);
		res.json(countries);
	} catch (error) {
		console.error(error);
		res.status(500).json({error: "Failed to fetch countries"});
	}
}