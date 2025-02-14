import speakeasy from "speakeasy";
import { sendEmail } from "../../utils/email.js";

const otpStorage = {};
const ALLOWED_DOMAIN = "graas.ai";

export const SendOTP = async (req, res) => {
  const { id, emailAddress } = req.body;
  console.log(id);
  console.log(emailAddress);
  try {
    const secret = speakeasy.generateSecret({ name: id, length: 20 });
    const otp = speakeasy.totp({ secret: secret.base32, encoding: "base32" });
    otpStorage[emailAddress] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      secret: secret.base32
    };
    await sendEmail(
      emailAddress,
      `Leave Management System Registration `,
      `Your OTP for Leave Management System Registration  is: <b>${otp}</b>`
    );
    return res
      .status(200)
      .json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

export const VerifyOTP = async (req, res) => {
  const { emailAddress, otp } = req.body;

  try {
    const storedOtp = otpStorage[emailAddress];

    if (!storedOtp) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    if (Date.now() > storedOtp.expiresAt) {
      delete otpStorage[email]; // OTP expired, delete it
      return res.status(400).json({ message: "OTP expired" });
    }

    if (storedOtp.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    delete otpStorage[emailAddress];
    return res
      .status(200)
      .json({ valid: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error in verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
