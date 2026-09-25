export default async function handler(req, res) {
  // CORS Configuration
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { diagnosisContext, message, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: 'Missing message' });

  // Rate Limiting could be applied here as well, but we'll stick to basic implementation
  try {
    const geminiUrl = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=\${process.env.GEMINI_API_KEY}\`;

    const systemInstruction = `You are a helpful, expert plant pathologist assistant. 
The user has just received an AI diagnosis for their plant and is asking follow-up questions.
Here is the context of the diagnosis:
${JSON.stringify(diagnosisContext, null, 2)}

Answer the user's question accurately based on this context. Keep your answers concise, practical, and empathetic. 
If the user asks something completely unrelated to plants, gently steer them back to agronomy.`;

    // Convert history to Gemini format
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));
    
    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }]
        },
        contents: contents
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Gemini API Error');

    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) throw new Error('No text response from Gemini');

    return res.status(200).json({ reply: textResponse });
  } catch (error) {
    console.error('Chat API Error:', error);
    return res.status(502).json({ error: 'Failed to process chat request' });
  }
}
