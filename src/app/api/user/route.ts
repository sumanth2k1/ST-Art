import { NextApiRequest, NextApiResponse } from "next";
import { dbConnection } from "../../../../lib/mongoose";

const nodemailer = require('nodemailer');

type userType = {
  fullname: String;
  phone: String;
  email: String;
  password: String;
};
  
  const genrateOTP = () => {
    let otp = "";
    for (let i = 0; i <= 3; i++) {
      let rand = Math.floor(Math.random() * 9);
      otp += rand;
    }
    return otp;
  };
  
  async function sendMail(email:String, OTP:String) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "behom987@gmail.com",
        pass: process.env.NM_KEY ?? '',
      },
    });
    const mailOptions = {
      from: "behom987@gmail.com",
      to: email,
      subject: "Verify your OTP",
      html: `<div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="text-align: center; color: #333;">OTP Verification</h2>
      
      <p>Hello user,</p>
      
      <p>Your OTP for verification is: <strong>${OTP}</strong></p>
      
      <p>This OTP is valid for the next 1 minutes. If you did not request this, please ignore this email.</p>
      
      <p>Thank you!</p>
      </div>`,
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.log(error);
    }
  }
  
  let sendOTP = async (email:String) => {
    let response;
    if (!email)
      return (response = { success:false, message: "Enter a Valid Email address !!!" });
    const user = await VerifyLogin.findOne({ email });
    if (user)
      return (response = { success:false, message: "Resend OTP after 1 minute", email: email });
    const OTP = genrateOTP();
    const VerificationToken = new VerifyLogin({
      owner: email,
      email: email,
      token: OTP,
    });
    await VerificationToken.save()
      .then(() => {
        sendMail(email, OTP);
        console.log(OTP);
        return (response = {
          success:true,
          message: "Enter OTP along with this email",
          email: email,
        });
      })
      .catch((err) => {
        return (response = err);
      });
    return response;
  };
  
  let verifyOTP = async (email, otp) => {
    let response;
    if (!email || !otp) return (response = { success:false, message: "Enter all fields" });
    const userVerify = await VerifyLogin.findOne({ email });
    if (!userVerify)
      return (response = { success:false, message: "Please Enter your Email first" });
    const isMatched = await userVerify.compareToken(otp);
    if (!isMatched) return (response = { success:false, message: "invalid OTP try again" });
  
    if (isMatched) {
      response = true;
      await VerifyLogin.findByIdAndDelete(userVerify._id);
    }
    return response;
  };
  

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnection();
    const { fullname, phone, email, password }: userType = req.body;

  } catch (error) {}
}
