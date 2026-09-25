export const config = {
  api: {
    bodyParser: {
      sizeLimit: '6mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64 || !mimeType) {
      return res.status(400).json({ error: 'Missing imageBase64 or mimeType' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server misconfiguration: missing API key' });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `Act as a plant pathologist. Analyze this leaf image and return ONLY a strict JSON object with no markdown fences, no explanation, and exactly these fields:
{
  "plant_type": "string",
  "disease_name": "string",
  "scientific_name": "string",
  "confidence_percent": number,
  "severity": "none" | "mild" | "moderate" | "severe",
  "affected_area_pct": number,
  "symptoms_observed": ["string"],
  "likely_cause": "string",
  "treatment_organic": [{"title": "string", "dosage": "string", "schedule": "string", "mechanism": "string"}],
  "treatment_chemical": [{"title": "string", "dosage": "string", "schedule": "string", "mechanism": "string"}],
  "prevention_tips": ["string"],
  "is_healthy": boolean
}`;

    const requestBody = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: base64Data
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1
      }
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    let geminiRes;
    try {
      geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      if (fetchErr.name === 'AbortError') {
         return res.status(504).json({ error: 'Gemini API timeout' });
      }
      throw fetchErr;
    }
    clearTimeout(timeoutId);

    if (!geminiRes.ok) {
      const errTxt = await geminiRes.text();
      console.error('Gemini error:', errTxt);
      return res.status(502).json({ error: 'Gemini API error' });
    }

    const data = await geminiRes.json();
    let textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResult) {
      return res.status(502).json({ error: 'Invalid response from Gemini' });
    }

    let cleaned = textResult.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '');
      cleaned = cleaned.replace(/```$/, '');
    }
    cleaned = cleaned.trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      return res.status(502).json({ error: 'Failed to parse JSON from Gemini response' });
    }

    return res.status(200).json(parsed);
  } catch (error) {
    console.error('Analyze API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
