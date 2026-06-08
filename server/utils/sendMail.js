import nodemailer from "nodemailer";

const sendMail = async (otp, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Verify Your Email Address With CogniFlow!",
      html: `
        <div style="background-color: #f3f4f6; padding: 40px 20px; font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; margin: 0;">
  
  <div style="max-width: 450px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);">
    
    <div style="height: 6px; background: linear-gradient(to right, #22d3ee, #3b82f6);"></div>
    
    <div style="padding: 40px 30px;">
      
      <h2 style="color: #0f172a; margin: 0 0 15px 0; font-weight: 800; font-size: 26px;">
        Cogni<span style="color: #3b82f6;">Flow</span>
      </h2>
      
      <p style="color: #475569; font-size: 16px; margin: 0 0 30px 0; line-height: 1.5;">
        Hello! Here is your secure verification code to access your account:
      </p>
      
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 24px; margin: 0 auto 30px auto; display: inline-block;">
        <h1 style="color: #0f172a; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 8px; white-space: nowrap;">
          ${otp}
        </h1>
      </div>
      
      <p style="color: #64748b; font-size: 14px; margin: 0 0 15px 0;">
        This code will expire in <strong>15 minutes</strong>.
      </p>
      
      <div style="border-top: 1px solid #e2e8f0; margin: 20px 0; padding-top: 20px;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0; line-height: 1.5;">
          If you didn't request this code, you can safely ignore this email. Someone might have typed their email address incorrectly.
        </p>
      </div>

    </div>
  </div>
</div>
        `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to: ", email);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Could not send email");
  }
};

export default sendMail;
