const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are Synora AI — a smart, friendly study assistant built into the Synora productivity platform. Your job is to:
- Answer academic questions across all subjects (Math, Science, History, CS, etc.)
- Explain complex concepts in simple, student-friendly terms
- Help students plan study schedules and prioritize tasks
- Provide motivation and study tips
- Guide students with problem-solving steps, not just answers

Keep responses concise, clear, and encouraging. Use bullet points or numbered steps when helpful. If a question is outside academics, gently redirect to study-related topics.`;

exports.chat = async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: 'Messages array is required' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'AI service not configured. Please add GROQ_API_KEY.' });
    }

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.slice(-20), // keep last 20 messages for context
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Groq API error:', err);
      return res.status(502).json({ success: false, message: 'AI service error. Please try again.' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    res.json({ success: true, data: { reply } });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
