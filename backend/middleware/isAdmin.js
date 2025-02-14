import jwt from "jsonwebtoken";

export const isAdmin = (req, res, next) => {
	//console.log(req.headers);
	const token = req.header("Authorization")?.split(" ")[1];
	//console.log("inside isadmin middleware - ", token);

	if (!token) {
		return res.status(401).json({
			message: "Access Denied : No token present",
		});
	}
	
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
		req.admin = decoded;
		next();
	} catch (error) {
		return res.status(400).json({
			message: "Invalid Token",
		});
	}
};
