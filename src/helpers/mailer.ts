import User from '@/models/userModel';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';
export const sendEmail = async ({email,emailType,userId}:any) => {
    try {
      const hashedToken = await bcryptjs.hash(userId.toString(),10)
      if (emailType === "VERIFY") {
        await User.findByIdAndUpdate(userId,
          {verifyToken: hashedToken,verifyTokenExpire: Date.now() + 3600000}
        )
      } else if(emailType === "RESET") {
        await User.findByIdAndUpdate(userId,
          {forgotPassowrdToken: hashedToken,forgotPasswordTokenExpiry: Date.now() + 3600000}
        )

      }
        // Looking to send emails in production? Check out our Email API/SMTP product!
            var transport = nodemailer.createTransport({
              host: "sandbox.smtp.mailtrap.io",
              port: 2525,
              auth: {
                user: "080288ddebe231",
                pass: "94b1ac827e9cc3"
              }
            });

          const mailOptions = {
            from: `sahiljeet singh kalsi`, // sender address
            to: email, // list of receivers
            subject: emailType === "Verify" ? "Verify your Email":"Reset your password",
            html: `<p>
            Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "Verify" ? "Verify your Email":"Reset your password"}
            or copy and paste the following link in your browser. ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            <br>
            </p>`, 
          }

          const mailResponse = await transport.sendMail(mailOptions);
          return mailResponse;
    } catch (error:any) {
        throw new Error(error.message);
    }
}