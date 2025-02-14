import prisma from "../../config/prisma.js";

export const AddNewHoliday = async(req , res)=> {
    try {
		const {countryId, description, date} = req.body;
	//	console.log("/holidays", req.body);
		if (!countryId || !description || !date) {
			return res.status(400).json({error: "Missing required fields"});
		}

		const newHoliday = await prisma.holiday.create({
			data: {
				countryId: parseInt(countryId),
				description,
				date: new Date(date),
			},
		});
		res.status(201).json(newHoliday);
	} catch (error) {
		res.status(500).json({error: "Failed to add holiday"});
	}
}