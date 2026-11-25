/**
 * GET /api/health
 * 앱이 배포 서버 모드를 자동 감지할 때 사용합니다.
 */
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    ok: true,
    service: 'speaky',
    hasKey: !!process.env.OPENAI_API_KEY,
    models: {
      chat: 'gpt-4o-mini',
      transcribe: 'whisper-1',
      tts: 'tts-1'
    }
  });
}
