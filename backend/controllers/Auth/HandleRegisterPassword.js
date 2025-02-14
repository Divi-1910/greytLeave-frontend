import prisma from "../../config/prisma.js";
import bcrypt from "bcryptjs";

export const RegisterPassword = async(req , res)=> {
  //  console.log("inside the register password");
	const {id , password} = req.body;
	try {
	//	console.log("inside the api endpoint register password");
		const hashedPassword = await bcrypt.hash(password , 10);
		const updatedEmployee = await prisma.employee.update({
			where: { id },
			data: {
			  passwordHash: hashedPassword,
			},
		  });
	//	  console.log(updatedEmployee);

		  res.status(200).json({ message: "Password registered", success : true , updatedEmployee });

	} catch (error) {
		console.error('Error updating password:', error);
    res.status(500).json({ message: "Internal Server Error" });
	}
}