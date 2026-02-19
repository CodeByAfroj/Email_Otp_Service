import Otp from "../model/otp_model.js"
import { sendEmail } from "../utils/email.js";



const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// SEND OTP
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = generateOTP();

    // OTP expires in 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // delete old otp if exists
    await Otp.deleteMany({ email });

    // save new otp
    await Otp.create({ email, otp, expiresAt });

    // send email
    await sendEmail(
      email,
      "Your OTP Code",
      `Your OTP is: ${otp}. It will expire in 5 minutes.`
    );

    return res.status(200).json({ message: "OTP sent successfully ✅" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required" });

    const record = await Otp.findOne({ email, otp });

    if (!record)
      return res.status(400).json({ message: "Invalid OTP ❌" });

    if (record.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired ❌" });

    // OTP verified -> delete it
    await Otp.deleteMany({ email });

    return res.status(200).json({ message: "OTP verified successfully ✅" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
