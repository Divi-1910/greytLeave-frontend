import prisma from "../../config/prisma.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";


const generateToken = (employee) => {
    return jwt.sign(
      { 
        employee
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '24h' }
    );
  };

export const EmployeeLogin = async(req , res) => {
    const { employeeCode, password } = req.body; 
    try {
      const employee = await prisma.employee.findUnique({
        where: {
          employeeCode: employeeCode,
        },
      });
  
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }
  
      const isMatch = await bcrypt.compare(password, employee.passwordHash);
  
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }
  
      const token = generateToken(employee);
 //     console.log("generated token - " , token);
      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        id : employee.id,
      });
      
    } catch (error) {
      console.error("Error in employee login:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
}