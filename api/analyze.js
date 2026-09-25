import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '6mb',
    },
  },
};

export default async function handler(req, res) {
  // CORS Configuration
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || '127.0.0.1';
  console.log(`[API_ANALYZE] POST request initiated from IP: ${ip} at ${new Date().toISOString()}`);

  // Rate Limiting (10 requests per hour)
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      const ratelimit = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(10, '1 h'),
      });
      
      const { success } = await ratelimit.limit(`ratelimit_analyze_${ip}`);
      if (!success) {
        return res.status(429).json({ error: 'Too many requests. You have reached the maximum of 10 requests per hour. Please try again later.' });
      }
    } catch (err) {
      console.error('Rate limiting error:', err);
      // Fail open if Redis fails, or handle accordingly
    }
  }

  const { imageBase64, mimeType } = req.body;
  
  if (!imageBase64 || !mimeType) {
    return res.status(400).json({ error: 'Missing imageBase64 or mimeType' });
  }

  // Input Validation: Restrict MIME types
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedMimeTypes.includes(mimeType)) {
    return res.status(400).json({ error: 'Invalid mime type. Only image/jpeg, image/png, and image/webp are allowed.' });
  }

  const prompt = `Act as a plant pathologist and analyze this image. Return ONLY strict JSON in the exact following structure. 
For any text intended for the user, provide an object with 'en' and 'hi' (Hindi) keys (e.g. { "en": "English text", "hi": "हिंदी पाठ" }).
Strict JSON schema:
{
  "plant_type": { "en": "...", "hi": "..." },
  "disease_name": { "en": "...", "hi": "..." },
  "scientific_name": "...",
  "confidence_percent": 95,
  "severity": "none" | "mild" | "moderate" | "severe",
  "affected_area_pct": 10,
  "prognosis": { "en": "...", "hi": "..." },
  "symptoms_observed": { "en": ["..."], "hi": ["..."] },
  "likely_cause": { "en": "...", "hi": "..." },
  "treatment_organic": [
    {
      "title": { "en": "...", "hi": "..." },
      "dosage": { "en": "...", "hi": "..." },
      "schedule": { "en": "...", "hi": "..." },
      "mechanism": { "en": "...", "hi": "..." }
    }
  ],
  "treatment_chemical": [
    {
      "title": { "en": "...", "hi": "..." },
      "dosage": { "en": "...", "hi": "..." },
      "schedule": { "en": "...", "hi": "..." },
      "mechanism": { "en": "...", "hi": "..." }
    }
  ],
  "prevention_tips": [
    {
      "category": { "en": "...", "hi": "..." },
      "action": { "en": "...", "hi": "..." }
    }
  ],
  "is_healthy": false
}`;

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    // strip the prefix if it exists in imageBase64 (data:image/jpeg;base64,...)
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data
                }
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API Error');
    }

    let textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResponse) {
      throw new Error('No text response from Gemini');
    }

    // Strip markdown code fences before JSON parse
    textResponse = textResponse.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    
    const jsonResult = JSON.parse(textResponse);
    
    return res.status(200).json(jsonResult);
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(502).json({ error: 'Failed to process image with AI' });
  }
}
