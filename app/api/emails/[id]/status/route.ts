import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Get email status from Resend
    const { data, error } = await resend.emails.get(id);

    if (error) {
      console.error('Error fetching email status:', error);
      return new NextResponse(
        JSON.stringify({ error: error.message }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({ 
        message: 'Email status retrieved successfully',
        data 
      })
    );
  } catch (error) {
    console.error('Error checking email status:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to check email status' }),
      { status: 500 }
    );
  }
} 