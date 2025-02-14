import prisma from "../../config/prisma.js";

export const VerifyEmployeeCode = async(req , res)=> {
    const { employeeCode } = req.query; 
//	console.log("inside the verify employee Code");
	if (!employeeCode) {
	  return res.status(400).json({
		message: "Employee Code is required",
	  });
	}
  
	try {
	  const employee = await prisma.employee.findUnique({
		where: {
		  employeeCode: employeeCode,
		}, include : {
			department : true,
			role : true,
		}
	  });

	//  console.log(employee);
  
	  if (!employee) {
		return res.status(404).json({
		  message: "Employee not found",
		});
	  }
  
	  return res.status(200).json({
		valid: true,
		employee,
	  });

	} catch (error) {
	  console.error(error);
	  return res.status(500).json({
		message: "Error verifying employee COde",
	  });
	}
}