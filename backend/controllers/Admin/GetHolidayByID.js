import prisma from "../../config/prisma.js";

export const GetHolidayByID = async (req ,res)=> {
    try {
        const {holidayId} = req.params;
        const holiday = await prisma.holiday.findUnique({
            where: {holidayId: parseInt(holidayId)},
        });
        if (!holiday) {
            return res.status(400).json({
                error: "Holiday not found",
            });
        }
        res.json(holiday);
    } catch (error) {
        console.error("/holidays/:holidayId", error);
        res.status(500).json({
            error: "Failed to fetch holiday",
        });
    }
}