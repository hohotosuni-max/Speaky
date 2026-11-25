/**
 * POST /api/chat
 * 롤플레이 대화 + 교정 (gpt-4o-mini)
 * 브라우저는 이 엔드포인트만 호출하고, OpenAI 키는 서버 환경변수에만 존재합니다.
 */
const ALLOWED_MODELS = ['gpt-4o-mini', 'gpt-4o'];

/**
 * 아이 모드(kid) 바이링구어 튜터 지침.
 * 클라이언트(js/ai.js)가 보낸 프롬프트가 오래되었더라도 서버에서 한 번 더 보장합니다.
 */
const BILINGUAL_KID_GUIDE = [
  'Kid mode: the learner is a 9-year-old Korean bilingual child (second grade) who already speaks English fluently at a near-native level.',
  'Talk like a smart, curious 9-year-old bilingual friend, never like an adult talking to a baby.',
  'Use natural native-level English at a normal pace: rich vocabulary, idioms and connectors ("what surprised me most was", "I get what you mean", "on the other hand").',
  'No baby talk and no oversimplified A1 sentences. Keep replies to 2-3 natural sentences and push the thinking forward with a real follow-up question.',
  'For correction, suggest a more polished, precise and logical version of the learner\'s last message - wording and linking words, not only grammar - with one short friendly Korean explanation.'
].join('\n');

/** 아이 모드 지침이 시스템 메시지에 한 번만 들어가도록 보정합니다. */
function withKidGuide(messages, mode) {
  if (mode !== 'kid') return messages;
  const hasGuide = messages.some((m) => m.role === 'system' && m.content.includes('Kid mode:'));
  if (hasGuide) return messages;
  const idx = messages.findIndex((m) => m.role === 'system');
  if (idx === -1) return [{ role: 'system', content: BILINGUAL_KID_GUIDE }, ...messages];
  const copy = messages.slice();
  copy[idx] = { role: 'system', content: messages[idx].content + '\n\n' + BILINGUAL_KID_GUIDE };
  return copy;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
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
  if (!body || !Array.isArray(body.messages)) {
    res.status(400).json({ error: 'messages가 필요해요.' });
    return;
  }

  const messages = withKidGuide(
    body.messages
      .filter((m) => m && (m.role === 'system' || m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-24)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) })),
    body.mode === 'kid' ? 'kid' : 'adult'
  );

  const payload = {
    model: ALLOWED_MODELS.includes(body.model) ? body.model : 'gpt-4o-mini',
    messages,
    temperature: Math.min(1, Math.max(0, Number(body.temperature) || 0.7)),
    max_tokens: Math.min(800, Number(body.max_tokens) || (body.mode === 'kid' ? 520 : 420)),
    response_format: { type: 'json_object' }
  };

  try {
    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(text);
  } catch (err) {
    res.status(502).json({ error: 'OpenAI에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.' });
  }
}
