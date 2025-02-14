import prisma from "../../config/prisma.js";

export const GetEmployeesByCountryID = async(req , res)=> {
const {id} = req.params;
try {
    const employees = await prisma.employee.findMany({
        where: {countryId: parseInt(id)},
        include: {
            role: true,
        },
    });
    res.json(employees);
} catch (error) {
    console.error(error);
    res.status(500).json({error: "Failed to fetch employees"});
}
}