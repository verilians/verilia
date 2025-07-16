import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBIDoWO4S8KfTvu94hvtoGRIeokUv-BXsQ';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function POST(request) {
  try {
    const { messages } = await request.json();
    
    // Get the last user message
    const lastUserMessage = messages.filter(msg => msg.type === 'user').pop();
    
    if (!lastUserMessage) {
      return NextResponse.json({ error: 'No user message found' }, { status: 400 });
    }

    // Prepare the prompt for Bible counselling
    const systemPrompt = `You are a compassionate Bible counsellor AI assistant. Your role is to provide guidance and support based on biblical wisdom. 

Guidelines:
- Always respond with empathy and understanding
- Reference relevant Bible verses when appropriate
- Provide practical, faith-based advice
- Keep responses conversational and encouraging
- Focus on spiritual growth and biblical principles
- Be supportive but not preachy
- Keep responses concise but meaningful
- Use a warm, caring tone
- Offer hope and encouragement
- When appropriate, suggest prayer or meditation

User's question: ${lastUserMessage.content}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: systemPrompt
            }
          ]
        }
      ]
    };

    console.log('Sending request to Gemini API:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API Error:', errorData);
      
      try {
        const parsedError = JSON.parse(errorData);
        return NextResponse.json({ 
          error: 'Failed to get response from AI',
          details: parsedError 
        }, { status: response.status });
      } catch (e) {
        return NextResponse.json({ 
          error: 'Failed to get response from AI',
          details: errorData 
        }, { status: response.status });
      }
    }

    const data = await response.json();
    console.log('Gemini API Response:', JSON.stringify(data, null, 2));
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      return NextResponse.json({ 
        error: 'Invalid response from AI',
        details: data 
      }, { status: 500 });
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    return NextResponse.json({
      message: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
} 