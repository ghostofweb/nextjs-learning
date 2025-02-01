import User from '@/models/userModel';
import nodemailer from 'nodemailer';
import crypto from 'crypto'; // Add this import

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    // Generate a random token (32 bytes as hex string)
    const token = crypto.randomBytes(32).toString('hex');

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: token, // Store plain token
          verifyTokenExpiry: Date.now() + 3600000
        }
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: token, // Store plain token
          forgotPasswordTokenExpiry: Date.now() + 3600000
        }
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "080288ddebe231",
        pass: "94b1ac827e9cc3"
      }
    });

    const mailOptions = {
      from: `sahiljeet singh kalsi`,
      to: email,
      subject: emailType === "VERIFY" ? "Verify your Email" : "Reset your password",
      html: `<p>
        Click <a href="${process.env.DOMAIN}/verifyemail?token=${token}">here</a> to ${emailType === "VERIFY" ? "Verify your Email" : "Reset your password"}
        <br>
        ${process.env.DOMAIN}/verifyemail?token=${token}
      </p>`
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};