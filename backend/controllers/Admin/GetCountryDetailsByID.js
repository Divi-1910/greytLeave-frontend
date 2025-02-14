import prisma from "../../config/prisma.js";

export const GetCountryDetailsByID = async(req , res) => {
    const {id} = req.params;
	try {
		const country = await prisma.country.findUnique({
			where: {countryId: parseInt(id)},
			include: {
				holidays: true,
				employees: true,
			},
		});
		if (!country) {
			return res.status(404).json({error: "Country not found"});
		}
		res.json(country);
	} catch (error) {
		console.error(error);
		res.status(500).json({error: "Failed to fetch country details"});
	}
}