import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Selvas Coffee <onboarding@resend.dev>', // Use Resend's onboarding domain for testing
      to: ['delivered@resend.dev'], // Resend's test email address
      subject: 'Test Email',
      html: '<p>This is a test email to verify the integration.</p>'
    });

    if (error) {
      console.error('Test email error:', error);
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({ 
        message: 'Test email sent successfully',
        data 
      })
    );
  } catch (error) {
    console.error('Error sending test email:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to send test email' }),
      { status: 500 }
    );
  }
} 