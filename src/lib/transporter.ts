import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (email: string, url: string) => {
  const mailOptions = {
    from: process.env.SMTP_USER || "shambhavse15@gmail.com",
    to: email,
    subject: "Your Magic Link Sign-In",
    text: `Click this link to sign in: ${url}`,
    html: `
                        <h1>Welcome!</h1>
                        <p>Click the button below to sign in:</p>
                        <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
                            Sign In
                        </a>
                        <p>Or copy and paste this URL into your browser:</p>
                        <p>${url}</p>
                        <p>This link will expire soon for security reasons.</p>
          `,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send email");
  }
};
