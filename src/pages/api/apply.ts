import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { role, linkedinUrl } = data;

    if (!role || !linkedinUrl) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Randiantech Careers <onboarding@resend.dev>",
      to: "cancela.juancarlos@gmail.com",
      subject: `New application: ${role}`,
      html: `
        <h2>New Job Application</h2>
        <p><strong>Position:</strong> ${role}</p>
        <p><strong>LinkedIn:</strong> <a href="${linkedinUrl}">${linkedinUrl}</a></p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Application form error:", error);
    return new Response(JSON.stringify({ error: "Failed to send application" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
