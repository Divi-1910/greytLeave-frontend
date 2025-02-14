import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, body) => {
  try {
    const cleanedTo = to.trim();
    const emailData = {
      from: "onboarding@resend.dev",
      to: cleanedTo,
      subject,
      html: `<p>${body}</p>`
    };
    const response = await resend.emails.send(emailData);
    console.log(response);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
