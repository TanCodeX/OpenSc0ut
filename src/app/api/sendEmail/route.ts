import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlTemplate = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000000; color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #222;">
        <div style="background-color: #0a0a0a; padding: 30px; border-bottom: 2px solid #FF0B55; text-align: center;">
          <h2 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">
            <span style="color: #ffffff;">Open</span><span style="color: #FF0B55;">Sc0ut</span>
          </h2>
        </div>
        <div style="padding: 40px 30px;">
          <p style="margin-top: 0; color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">New Contact Message</p>
          
          <div style="background-color: #111111; padding: 24px; border-radius: 12px; margin-bottom: 30px; border: 1px solid #222;">
            <p style="margin: 0 0 16px 0; font-size: 15px;"><strong style="color: #FF0B55;">Name:</strong> <span style="color: #ffffff;">${name}</span></p>
            <p style="margin: 0; font-size: 15px;"><strong style="color: #FF0B55;">Email:</strong> <a href="mailto:${email}" style="color: #ffffff; text-decoration: none;">${email}</a></p>
          </div>
          
          <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #ffffff; font-weight: 600;">Message:</h3>
          <div style="background-color: #111111; padding: 24px; border-radius: 12px; border: 1px solid #222;">
            <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #cccccc; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
        <div style="background-color: #0a0a0a; padding: 24px; text-align: center; border-top: 1px solid #222;">
          <p style="margin: 0; color: #555555; font-size: 12px;">This message was sent from the OpenSc0ut contact form.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `${name} <${email}>`,
      to: process.env.EMAIL_USER,
      subject: subject || "Contact from OpenSc0ut",
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: htmlTemplate,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}
