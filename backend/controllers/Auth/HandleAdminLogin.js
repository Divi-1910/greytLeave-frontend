import prisma from "../../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const HandleAdminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await prisma.admin.findUnique({
      where: { emailAddress: email },
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.hashedPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const Admintoken = jwt.sign(
      { adminId: admin.id, email: admin.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      Admintoken,
      message: "Login successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
