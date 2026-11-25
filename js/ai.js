/* ============================================================
   Speaky — AI 연동 (OpenAI)
   - key 모드: 브라우저에서 직접 OpenAI 호출 (Whisper · gpt-4o-mini · TTS)
   - server 모드: /api/* 서버리스 함수 사용 (키를 서버에 숨김)
   ============================================================ */
(function () {
  'use strict';

  var LS_KEY = 'speaky.ai.v1';
  var OPENAI = 'https://api.openai.com/v1';
  var CHAT_MODEL = 'gpt-4o-mini';
  var TTS_MODEL = 'tts-1';

  var config = { mode: 'demo', key: '', serverOk: false, serverHasKey: null, verified: false };
  var ttsCache = new Map();

  function load() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        config.mode = parsed.mode || 'demo';
        config.key = parsed.key || '';
        config.serverOk = !!parsed.serverOk;
      }
    } catch (e) {}
    return config;
  }

  function save() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({
        mode: config.mode,
        key: config.key,
        serverOk: config.serverOk
      }));
    } catch (e) {}
  }

  function setMode(mode) {
    config.mode = mode;
    save();
  }

  function setKey(key) {
    config.key = String(key || '').trim();
    config.verified = false;
    save();
  }

  function isLive() {
    if (config.mode === 'key') return !!config.key;
    // 서버 모드는 /api/health 로 실제 서버가 확인된 경우에만 AI로 동작
    if (config.mode === 'server') return !!config.serverOk;
    return false;
  }

  function usingServer() {
    return config.mode === 'server';
  }

  function headers(extra) {
    var h = Object.assign({}, extra || {});
    if (config.mode === 'key' && config.key) {
      h.Authorization = 'Bearer ' + config.key;
    }
    return h;
  }

  /* 키 모드와 서버 모드의 엔드포인트가 서로 다릅니다. */
  function chatUrl() {
    return usingServer() ? 'api/chat' : OPENAI + '/chat/completions';
  }

  function ttsUrl() {
    return usingServer() ? 'api/tts' : OPENAI + '/audio/speech';
  }

  function probeServer() {
    return fetch('api/health', { headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('no-server');
        return res.json();
      })
      .then(function (data) {
        config.serverOk = !!(data && data.ok);
        config.serverHasKey = !!(data && data.hasKey);
        save();
        return config.serverOk;
      })
      .catch(function () {
        config.serverOk = false;
        save();
        return false;
      });
  }

  function verifyKey() {
    if (!config.key) return Promise.resolve(false);
    return fetch(OPENAI + '/models', { headers: headers() })
      .then(function (res) {
        config.verified = res.ok;
        return res.ok;
      })
      .catch(function () { return false; });
  }

  /* ── 프롬프트 ───────────────────────────────────── */
  function systemPrompt(mode, scenario) {
    var kid = mode === 'kid';
    var tutor = (scenario && scenario.tutor) || {};
    var level = kid
      ? 'a 9-year-old Korean bilingual child in second grade who already speaks English fluently at a near-native level'
      : 'a Korean adult who wants practical, natural conversational English';

    return [
      'You are role-playing "' + (tutor.name || 'the tutor') + '" in an English speaking lesson.',
      'Scene: ' + (scenario ? scenario.title + ' at ' + scenario.place : 'free conversation') + '.',
      'The learner is ' + level + '.',
      'Stay fully in character as the person in the scene (for example a book-club friend, a curious classmate, or a science buddy).',
      kid
        ? [
            'Talk to them like a smart, curious 9-year-old bilingual friend - never like an adult talking to a baby.',
            'Use natural native-level English at a normal pace: rich vocabulary, idioms and connectors ("what surprised me most was", "I get what you mean", "that reminds me of", "on the other hand").',
            'Do not use baby talk, oversimplified A1 sentences, or short 14-word limits. Keep replies to 2-3 natural sentences.',
            'Almost always push the thinking forward with a real follow-up question (why, how come, what would you do, can you give me an example).',
            'Their grammar is already good, so do not praise every sentence; react to the idea first, then nudge them to say it more precisely.'
          ].join(' ')
        : 'Use natural everyday English. Keep your reply to 1-2 short sentences, and usually end with one simple question.',
      '',
      'Return ONLY a JSON object with this shape:',
      '{',
      '  "reply": "your in-character English reply",',
      '  "reply_ko": "natural Korean translation of reply",',
      '  "correction": {"better": "a fully natural version of the learner\'s LAST message", "explanation": "one short friendly Korean explanation", "label": "short Korean label like 공손한 표현" } or null,',
      '  "hints": ["short English sentence the learner could say next", "another option"]',
      '}',
      'Rules for correction: if the learner message is already natural and correct, set correction to null.',
      'If the learner wrote in Korean, correction.better should be the English sentence they should try, and explanation should gently prompt them to speak English.',
      kid
        ? 'For the bilingual child, correction.better must be a more polished, precise and logical version of their last message - not just grammar fixes, but stronger word choice and better linking words. Keep explanation to one short friendly Korean sentence, and only correct what is worth correcting.'
        : '',
      'Hints must fit the learner\'s level and the scene. Never include Korean in "reply" or "hints".'
    ].join('\n');
  }

  function parseJsonContent(content) {
    if (!content) throw new Error('empty-response');
    var text = String(content).trim();
    text = text.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    try {
      return JSON.parse(text);
    } catch (e) {
      var start = text.indexOf('{');
      var end = text.lastIndexOf('}');
      if (start >= 0 && end > start) {
        return JSON.parse(text.slice(start, end + 1));
      }
      throw e;
    }
  }

  /**
   * 롤플레이 한 턴
   * @param {object} p {mode, scenario, history:[{role,content}], text}
   */
  function chat(p) {
    var messages = [{ role: 'system', content: systemPrompt(p.mode, p.scenario) }];
    (p.history || []).forEach(function (m) {
      messages.push({ role: m.role, content: m.content });
    });
    messages.push({ role: 'user', content: p.text });

    var body = {
      model: CHAT_MODEL,
      mode: p.mode === 'kid' ? 'kid' : 'adult',
      messages: messages,
      temperature: p.mode === 'kid' ? 0.65 : 0.7,
      max_tokens: 420,
      response_format: { type: 'json_object' }
    };

    return fetch(chatUrl(), {
      method: 'POST',
      headers: headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.text().then(function (raw) {
        if (!res.ok) {
          var msg = 'AI 오류 (' + res.status + ')';
          try {
            var errJson = JSON.parse(raw);
            if (errJson.error && errJson.error.message) msg = errJson.error.message;
          } catch (e) {}
          throw new Error(msg);
        }
        var data = JSON.parse(raw);
        var content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
        var out = parseJsonContent(content);
        return {
          reply: out.reply || '',
          replyKo: out.reply_ko || '',
          correction: out.correction && out.correction.better ? out.correction : null,
          hints: Array.isArray(out.hints) ? out.hints.filter(Boolean).slice(0, 3) : []
        };
      });
    });
  }

  /* ── 음성 인식 (Whisper) ────────────────────────── */
  function blobToBase64(blob) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        var result = String(reader.result || '');
        resolve(result.split(',')[1] || '');
      };
      reader.onerror = function () { reject(reader.error || new Error('read-failed')); };
      reader.readAsDataURL(blob);
    });
  }

  function transcribe(blob, extension) {
    var mime = blob.type || 'audio/mp4';
    var filename = 'speech.' + (extension || 'mp4');

    if (usingServer) {
      return blobToBase64(blob).then(function (b64) {
        return fetch('api/transcribe', {
          method: 'POST',
          headers: headers({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ audio: b64, mimeType: mime })
        });
      }).then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error(data.error || '음성 인식에 실패했어요.');
          return data.text || '';
        });
      });
    }

    var form = new FormData();
    form.append('file', blob, filename);
    form.append('model', 'whisper-1');
    form.append('language', 'en');
    form.append('response_format', 'json');

    return fetch(OPENAI + '/audio/transcriptions', {
      method: 'POST',
      headers: headers(),
      body: form
    }).then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) {
          throw new Error((data.error && data.error.message) || '음성 인식에 실패했어요.');
        }
        return (data.text || '').trim();
      });
    });
  }

  /* ── 음성 합성 (TTS) ────────────────────────────── */
  function tts(text, opts) {
    opts = opts || {};
    var voice = opts.voice || (opts.mode === 'kid' ? 'shimmer' : 'nova');
    var speed = Math.max(0.25, Math.min(4, opts.speed || 1));
    var input = String(text || '').trim();
    if (!input) return Promise.reject(new Error('empty-text'));

    var cacheKey = voice + '|' + speed + '|' + input;
    if (ttsCache.has(cacheKey)) {
      return Promise.resolve(ttsCache.get(cacheKey));
    }

    var body = {
      model: TTS_MODEL,
      voice: voice,
      input: input,
      speed: speed,
      response_format: 'mp3'
    };

    return fetch(ttsUrl(), {
      method: 'POST',
      headers: headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body)
    }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (raw) {
          var msg = '음성 합성 오류 (' + res.status + ')';
          try {
            var j = JSON.parse(raw);
            if (j.error && j.error.message) msg = j.error.message;
          } catch (e) {}
          throw new Error(msg);
        });
      }
      return res.blob();
    }).then(function (blob) {
      var url = URL.createObjectURL(blob);
      if (ttsCache.size > 30) {
        var firstKey = ttsCache.keys().next().value;
        try { URL.revokeObjectURL(ttsCache.get(firstKey)); } catch (e) {}
        ttsCache.delete(firstKey);
      }
      ttsCache.set(cacheKey, url);
      return url;
    });
  }

  window.SpeakyAI = {
    config: config,
    load: load,
    save: save,
    setMode: setMode,
    setKey: setKey,
    isLive: isLive,
    usingServer: usingServer,
    probeServer: probeServer,
    verifyKey: verifyKey,
    chat: chat,
    transcribe: transcribe,
    tts: tts,
    CHAT_MODEL: CHAT_MODEL
  };
})();
