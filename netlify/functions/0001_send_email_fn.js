/**
 * File : 0001_send_email_fn.js
 *
 * Netlify Function to send emails using MailerSend (no templates).
 * Handles POST requests with `to`, `subject`, `text`, and/or `html` content.
 */
import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

const sentFrom = new Sender(process.env.MAILERSEND_EMAIL_KEY);

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { to, subject, text, html } = JSON.parse(event.body);

    if (!to || !subject || !text) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing required fields: 'to', 'subject', and either 'text'",
        }),
      };
    }

    const recipients = [new Recipient(to)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(subject);

    if (text) emailParams.setText(text);
    if (html) emailParams.setHtml(html);

    await mailerSend.email.send(emailParams);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully!" }),
    };
  } catch (error) {
    console.error("MailerSend error:", JSON.stringify(error));
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send email." }),
    };
  }
};
