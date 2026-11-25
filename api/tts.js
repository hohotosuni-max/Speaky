/**
 * POST /api/tts
 * body: { input: "Hello", voice: "nova", speed: 1.0, model: "tts-1" }
 * OpenAI TTS 오디오(mp3)를 그대로 돌려줍니다.
 */
const ALLOWED_VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer', 'coral', 'sage'];
const MAX_CHARS = 600;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST만 지원해요.' });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: '서버에 OPENAI_API_KEY가 설정되지 않았어요.' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = null; }
  }

  const input = body && typeof body.input === 'string' ? body.input.trim().slice(0, MAX_CHARS) : '';
  if (!input) {
    res.status(400).json({ error: 'input(문장)이 필요해요.' });
    return;
  }

  const payload = {
    model: 'tts-1',
    voice: ALLOWED_VOICES.includes(body.voice) ? body.voice : 'nova',
    input,
    speed: Math.min(4, Math.max(0.25, Number(body.speed) || 1)),
    response_format: 'mp3'
  };

  try {
    const upstream = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => '');
      res.status(upstream.status).json({ error: errText || '음성 합성에 실패했어요.' });
      return;
    }

    const arrayBuffer = await upstream.arrayBuffer();
    res.status(200);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', String(arrayBuffer.byteLength));
    res.end(Buffer.from(arrayBuffer));
  } catch (err) {
    res.status(502).json({ error: 'TTS에 연결하지 못했어요.' });
  }
}
