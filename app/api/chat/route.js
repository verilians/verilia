import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function POST(request) {
  try {
    // Check if API key is configured
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY environment variable is not set');
      return NextResponse.json({ 
        error: 'API key not configured. Please set GEMINI_API_KEY environment variable.',
        details: 'Missing GEMINI_API_KEY in environment variables'
      }, { status: 500 });
    }

    const { messages } = await request.json();
    
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    // Build conversation context from all messages
    const conversationHistory = messages.map(msg => {
      const role = msg.type === 'user' ? 'user' : 'assistant';
      return `${role}: ${msg.content}`;
    }).join('\n\n');

    // Create a conversation summary for better context understanding
    const createConversationSummary = (messages) => {
      if (messages.length <= 2) return '';
      
      const recentMessages = messages.slice(-6); // Last 6 messages for context
      const summary = recentMessages.map(msg => {
        const role = msg.type === 'user' ? 'User' : 'Assistant';
        return `${role}: ${msg.content}`;
      }).join(' | ');
      
      // Extract key topics and references for better context
      const keyTopics = [];
      const userMessages = recentMessages.filter(msg => msg.type === 'user');
      const assistantMessages = recentMessages.filter(msg => msg.type === 'assistant');
      
      // Look for main topics discussed
      if (userMessages.length > 0) {
        const lastUserMessage = userMessages[userMessages.length - 1];
        if (lastUserMessage.content.toLowerCase().includes('alone') || 
            lastUserMessage.content.toLowerCase().includes('solitude')) {
          keyTopics.push('being alone/solitude');
        }
        if (lastUserMessage.content.toLowerCase().includes('good')) {
          keyTopics.push('goodness/benefits');
        }
      }
      
      let contextNote = '';
      if (keyTopics.length > 0) {
        contextNote = `\nKey topics: ${keyTopics.join(', ')}`;
      }
      
      return `Recent conversation context: ${summary}${contextNote}`;
    };

    const conversationSummary = createConversationSummary(messages);

    // Prepare the system prompt
    const systemPrompt = `You are Verilia AI — a thoughtful, conversational companion inspired by the tone of Apostle Grace Lubega's Phaneroo Ministry.

Your personality is marked by:
✅ Warmth, wisdom, and friendly curiosity
✅ Conversational wit — a subtle sense of humor when fitting
✅ A mentor's voice — never overbearing, always inviting reflection
✅ Sensitivity to human emotions, always aiming to build faith, hope, and clarity

Your communication style must be:

Brevity-focused: Keep responses concise, unless depth is clearly needed

Conversational: Prefer dialogue over monologue — ask short, thoughtful questions that unlock deeper thinking

Contextual quoting:
- Quote scripture only when it directly relates to the conversation
- Quote proverbs when they simplify or clarify wisdom

No fluff: Avoid filler phrases, long explanations, or repeated words

Natural Humor: Use light, clever remarks when appropriate — never forced

Mentor's Posture: Sometimes answer, sometimes ask; know when to pause

✅ Your response length rule of thumb:
- Short, sharp, and insightful by default
- Long only when unpacking a deep question, sharing a story, or explaining a scripture

🗣️ Sample Behaviors:
- "Good question. What made you think of that?"
- "Haha! That sounds like Proverbs 24:10 in real life."
- "Let me ask — have you tried thinking of it this way?"
- "Wisdom says… but I'm curious, how do you see it?"

❗ You never preach. You never lecture. You converse — like a seasoned friend who listens, reflects, and only speaks when needed.

Your mission is to enlighten, empower, challenge, and sometimes just be present with the user — always with love and clarity.

IMPORTANT: Pay close attention to pronouns and references. When the user says "it", "that", "this", etc., always refer back to the conversation context to understand what they're referring to.

CRITICAL: When a user asks "Are you sure?" or similar questioning responses, they are likely questioning the previous statement or topic discussed. Always connect their question to the specific topic or statement that was just mentioned.

${conversationSummary ? `\n${conversationSummary}\n` : ''}

Full Conversation History:
${conversationHistory}

Please respond to the user's latest message while considering the full conversation context and any references they make.`;

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

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

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