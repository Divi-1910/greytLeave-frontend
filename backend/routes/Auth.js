import { Router } from "express";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";
import { EmployeeLogin } from "../controllers/Auth/HandleEmployeeLogin.js";
import { SendOTP, VerifyOTP } from "../controllers/Auth/HandleOTP.js";
import { HandleAdminLogin } from "../controllers/Auth/HandleAdminLogin.js";
import { RegisterPassword } from "../controllers/Auth/HandleRegisterPassword.js";
import { VerifyEmployeeCode } from "../controllers/Auth/VerifyEmployeeCode.js";

const router = Router();

const generateToken = (employee) => {
  return jwt.sign(
    {
      employee: {
        employeeId: employee.id,
        email: employee.emailAddress,
        role: employee.role
      }
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "24h" }
  );
};

router.post("/employee/login", EmployeeLogin);

router.post("/send-otp", SendOTP);

router.post("/verify-otp", VerifyOTP);

router.get("/verify-EmployeeCode", VerifyEmployeeCode);

router.post("/admin/login", HandleAdminLogin);

router.patch("/register-password", RegisterPassword);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get("/google/callback", (req, res, next) => {
  passport.authenticate(
    "google",
    { session: true },
    async (err, employee, info) => {
      if (err) {
        console.error("Google auth error:", err);
        return res.redirect(
          `${process.env.CLIENT_URL}/login?error=${encodeURIComponent(
            err.message
          )}`
        );
      }
      console.log("the employee is ", employee);

      if (!employee) {
        return res.redirect(
          `${process.env.CLIENT_URL}/login?error=unauthorized`
        );
      }

      try {
        const token = generateToken(employee);
        // console.log("generated google jwt token" , token);
        return res.redirect(
          `${process.env.CLIENT_URL}/auth/success?token=${token}`
        );
      } catch (error) {
        console.error("Token generation error:", error);
        return res.redirect(
          `${process.env.CLIENT_URL}/login?error=authentication-failed`
        );
      }
    }
  )(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        message: "Error Logging Out"
      });
    }
    res.json({ message: "Logged out successfully" });
  });
});

router.get("/status", (req, res) => {
  res.json({
    isAuthenticated: req.isAuthenticated(),
    user: req.user
  });
});

export default router;
