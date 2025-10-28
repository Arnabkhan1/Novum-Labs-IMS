import OTP from "../models/OTP.js";
import { generateOtp } from "../utils/generateOtp.js";
import { sendEmail } from "../utils/sendEmail.js";

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = generateOtp();
  await OTP.create({ email, otp, expiresAt: Date.now() + 5 * 60 * 1000 });
  await sendEmail(email, "Your OTP Code", `Your OTP is ${otp}`);
  res.json({ message: "OTP sent successfully" });
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const record = await OTP.findOne({ email, otp });
  if (!record) return res.status(400).json({ message: "Invalid OTP" });
  if (record.expiresAt < Date.now()) return res.status(400).json({ message: "OTP expired" });
  await OTP.deleteOne({ _id: record._id });
  res.json({ message: "OTP verified successfully" });
};
