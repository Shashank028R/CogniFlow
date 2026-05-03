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
        <div style="background:#0f172a; padding:40px 20px; font-family:Arial, sans-serif; text-align:center;">
  
        <div style="
          max-width:420px;
          margin:auto;
          padding:30px;
          border-radius:16px;
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.1);
          box-shadow:0 0 20px rgba(0,255,255,0.15);
        ">

          <h2 style="color:#e2e8f0; margin-bottom:10px;">
            Welcome to <span style="color:#22d3ee;">CogniFlow</span>
          </h2>

          <p style="color:#94a3b8; font-size:14px;">
            Your 6-digit verification code is:
          </p>

          <div style="
            margin:20px 0;
            padding:15px;
            border-radius:10px;
            background:#020617;
            border:1px solid rgba(34,211,238,0.3);
            box-shadow:0 0 15px rgba(34,211,238,0.6);
          ">
            <h1 style="
              color:#22d3ee;
              letter-spacing:8px;
              margin:0;
              font-size:32px;
            ">
              ${otp}
            </h1>
          </div>

          <p style="color:#64748b; font-size:13px;">
            This code will expire in 15 minutes.
          </p>

          <p style="color:#334155; font-size:12px; margin-top:20px;">
            If you didn't request this, you can safely ignore this email.
          </p>

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
