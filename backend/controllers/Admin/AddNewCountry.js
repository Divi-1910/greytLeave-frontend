import prisma from "../../config/prisma.js";

export const AddNewCountry = async(req , res) => {
    const {countryName, state} = req.body;
    //	console.log("/add-country", req.body);
        try {
            const existingCountry = await prisma.country.findUnique({
                where: {countryName},
            });
    
            if (existingCountry) {
                return res.status(400).json({error: "Country already exists"});
            }
    
            const newCountry = await prisma.country.create({
                data: {
                    countryName,
                    state,
                },
            });
    
            res.status(201).json(newCountry);
        } catch (err) {
            console.error(err);
            res.status(500).json({error: "Failed to add country"});
        }
}

