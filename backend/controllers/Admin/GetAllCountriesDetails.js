import prisma from "../../config/prisma.js";

export const GetAllCountriesDetails = async(req , res) => {
    try {
		const countries = await prisma.country.findMany({
			include: {
				_count: {
					select: {
						employees: true,
						holidays: true,
					},
				},
			},
		});
		const formattedCountries = countries.map((country) => ({
			id: country.countryId,
			title: country.countryName,
			src: "",
			employeeCount: country._count.employees,
			holidayCount: country._count.holidays,
		}));
		// console.log("- ", formattedCountries);
		res.json(formattedCountries);
	} catch (error) {
		console.error("Error fetching countries:", error);
		res.status(500).json({message: "Failed to fetch countries"});
	}
}