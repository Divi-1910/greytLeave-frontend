import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import prisma from "./prisma.js";

dotenv.config();

const ALLOWED_EMAIL_DOMAIN = "graas.ai";

passport.serializeUser((employee, done) => {
  if (!employee || !employee.employeeId) {
    return done(new Error("Invalid employee data for serialization"), null);
  }
  done(null, employee.employeeId);
});

passport.deserializeUser(async (employeeId, done) => {
  try {
    if (!employeeId) {
      return done(new Error("Invalid employeeId"), null);
    }
    console.log(employeeId);
    const employee = await prisma.employee.findUnique({
      where: { employeeId },
      include: {
        role: true,
        department: true
      }
    });

    if (!employee) {
      return done(new Error("Employee not found"), null);
    }

    done(null, employee);
  } catch (error) {
    console.error("Error in deserializeUser:", error);
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(
            new Error("Google profile does not contain a valid email"),
            null
          );
        }
        // console.log(email);
        const domain = email.split("@")[1];
        if (domain !== ALLOWED_EMAIL_DOMAIN) {
          return done(new Error("Unauthorized: Invalid email domain"), null);
        }

        const employee = await prisma.employee.findUnique({
          where: { emailAddress: email },
          include: {
            role: true,
            department: true
          }
        });

        if (!employee) {
          return done(
            new Error("Unauthorized: Employee not found in the system"),
            null
          );
        }

        return done(null, employee);
      } catch (error) {
        console.error("Authorization Error:", error);
        return done(error, null);
      }
    }
  )
);

export default passport;
