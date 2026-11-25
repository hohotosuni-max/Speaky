/**
 * POST /api/transcribe
 * body: { audio: base64, mimeType: "audio/mp4" }
 * iOS Safari에서 MediaRecorder로 녹음한 오디오를 Whisper로 인식합니다.
 */
const MAX_BYTES = 12 * 1024 * 1024; // 약 12MB (Whisper 제한 25MB 이내)

function pickExtension(mimeType) {
  if (/mp4|m4a/i.test(mimeType)) return 'mp4';
  if (/ogg/i.test(mimeType)) return 'ogg';
  if (/wav/i.test(mimeType)) return 'wav';
  if (/mpeg|mp3/i.test(mimeType)) return 'mp3';
  return 'webm';
}

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
  if (!body || typeof body.audio !== 'string') {
    res.status(400).json({ error: 'audio(base64)가 필요해요.' });
    return;
  }

  let buffer;
  try {
    buffer = Buffer.from(body.audio, 'base64');
  } catch (e) {
    res.status(400).json({ error: '오디오 데이터를 읽지 못했어요.' });
    return;
  }

  if (!buffer.length) {
    res.status(400).json({ error: '빈 오디오예요.' });
    return;
  }
  if (buffer.length > MAX_BYTES) {
    res.status(413).json({ error: '녹음이 너무 길어요. 30초 안으로 말해 주세요.' });
    return;
  }

  const mimeType = body.mimeType || 'audio/mp4';
  const ext = pickExtension(mimeType);

  try {
    const form = new FormData();
    form.append('file', new Blob([buffer], { type: mimeType }), `speech.${ext}`);
    form.append('model', 'whisper-1');
    form.append('language', 'en');
    form.append('response_format', 'json');
    form.append('temperature', '0');

    const upstream = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      res.status(upstream.status).json({
        error: (data.error && data.error.message) || '음성 인식에 실패했어요.'
      });
      return;
    }

    res.status(200).json({ text: (data.text || '').trim() });
  } catch (err) {
    res.status(502).json({ error: 'Whisper에 연결하지 못했어요.' });
  }
}
