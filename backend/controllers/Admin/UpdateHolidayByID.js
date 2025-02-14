import prisma from "../../config/prisma.js";

export const UpdateHolidayByID = async(req , res)=> {
    try {
		const {holidayId} = req.params;
		const {description, date} = req.body;
	//	console.log("/holidays/:holidayId", req.body);
		if (!description || !date) {
			return res.status(400).json({error: "Description and date are required"});
		}
		const updatedHoliday = await prisma.holiday.update({
			where: {holidayId: parseInt(holidayId)},
			data: {
				description,
				date: new Date(date),
			},
		});
		res.status(200).json(updatedHoliday);
	} catch (error) {
		console.error("Error updating holiday:", error);
		res.status(500).json({error: "Failed to update holiday"});
	}
}