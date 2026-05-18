import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Initialize OpenAI inside the function
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Create message to send to OpenAI with system prompt
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful medication and health information assistant. 
          Provide accurate, clear information about medicines, side effects, and health topics.
          Always remind users to consult healthcare professionals for serious concerns.
          Keep responses concise and easy to understand.
          Do not diagnose conditions - only provide general information.`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return NextResponse.json({
      reply,
      success: true,
    });
  } catch (error) {
    console.error('Chatbot API Error:', error);

    // Handle OpenAI specific errors
    if (error instanceof Error) {
      const errorMessage = error.message;
      console.error('Error details:', errorMessage);
      
      return NextResponse.json(
        { error: `API Error: ${errorMessage}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

