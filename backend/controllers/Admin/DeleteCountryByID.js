import prisma from "../../config/prisma.js";

export const DeleteCountryByID = async(req , res)=> {
    try {
		const {countryId} = req.params;
		await prisma.country.delete({where: {countryId: parseInt(countryId)}});
		res.status(200).json({message: "Country deleted successfully!"});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: "Failed to delete country"});
	}
}