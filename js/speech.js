/* ============================================================
   Speaky — 음성 입출력
   - TTS: speechSynthesis (기본) · OpenAI TTS 오디오 재생
   - STT: Web Speech API (지원 기기) / MediaRecorder 녹음
   - iOS Safari: 오디오 언락, mp4 녹음, 목소리 로딩 대응
   ============================================================ */
(function () {
  'use strict';

  var synth = window.speechSynthesis || null;
  var voices = [];
  var voiceReady = false;
  var unlocked = false;
  var player = null;

  var PREFERRED_VOICES = [
    'Samantha', 'Ava', 'Allison', 'Susan', 'Karen', 'Moira', 'Tessa', 'Serena',
    'Google US English', 'Microsoft Aria', 'Microsoft Jenny', 'Alex', 'Daniel', 'Kate'
  ];

  function loadVoices() {
    if (!synth) return;
    try {
      voices = synth.getVoices() || [];
      if (voices.length) voiceReady = true;
    } catch (err) { voices = []; }
  }

  if (synth) {
    loadVoices();
    if (typeof synth.addEventListener === 'function') {
      synth.addEventListener('voiceschanged', loadVoices);
    } else {
      synth.onvoiceschanged = loadVoices;
    }
    // iOS는 첫 사용자 제스처 뒤에 목소리 목록이 채워지는 경우가 있음
    setTimeout(loadVoices, 400);
    setTimeout(loadVoices, 1500);
  }

  function pickVoice() {
    if (!voices.length) loadVoices();
    if (!voices.length) return null;

    var en = voices.filter(function (v) { return /^en(-|_|$)/i.test(v.lang || ''); });
    if (!en.length) return null;

    // 이름 선호도
    for (var i = 0; i < PREFERRED_VOICES.length; i++) {
      var hit = en.find(function (v) { return (v.name || '').indexOf(PREFERRED_VOICES[i]) === 0; });
      if (hit) return hit;
    }
    // en-US 여성 음성 우선, 그다음 en-US, 그다음 아무 영어
    var us = en.filter(function (v) { return /en-US/i.test(v.lang); });
    return us[0] || en[0];
  }

  function unlockAudio() {
    if (unlocked) return;
    unlocked = true;
    try {
      player = new Audio();
      player.setAttribute('playsinline', '');
      player.preload = 'auto';
      // 0.1초 무음 WAV
      player.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAgD4AAAB9AAACABAAZGF0YQAAAAA=';
      var p = player.play();
      if (p && p.catch) p.catch(function () {});
    } catch (err) { /* 무시 */ }
  }

  /* ── TTS ─────────────────────────────────────────── */
  function speak(text, opts) {
    opts = opts || {};
    var clean = String(text || '').replace(/<[^>]+>/g, '').trim();
    if (!clean) return Promise.resolve();

    if (!synth) {
      if (opts.onError) opts.onError(new Error('unsupported'));
      return Promise.resolve();
    }

    return new Promise(function (resolve) {
      var settled = false;
      function done(err) {
        if (settled) return;
        settled = true;
        if (opts.onEnd) opts.onEnd();
        if (err && opts.onError) opts.onError(err);
        resolve();
      }

      try { synth.cancel(); } catch (e) {}

      var u = new SpeechSynthesisUtterance(clean);
      u.lang = 'en-US';
      var v = pickVoice();
      if (v) u.voice = v;
      u.rate = Math.max(0.5, Math.min(1.6, opts.rate || 1));
      u.pitch = opts.pitch || 1;
      u.volume = 1;
      u.onstart = function () { if (opts.onStart) opts.onStart(); };
      u.onend = function () { done(); };
      u.onerror = function (e) {
        if (e && (e.error === 'interrupted' || e.error === 'canceled')) return done();
        done(e || new Error('tts-error'));
      };

      if (opts.onStart) opts.onStart();

      // iOS Safari: cancel 직후 바로 speak하면 무시되는 경우가 있어 살짝 지연
      setTimeout(function () {
        try {
          synth.speak(u);
          // iOS에서 일시정지 상태로 멈추는 버그 대응
          setTimeout(function () {
            try {
              if (synth.paused) synth.resume();
            } catch (e) {}
          }, 250);
        } catch (err) {
          done(err);
        }
      }, 40);

      // 안전 장치: 글자 수 기준 최대 대기
      var guard = setTimeout(function () { done(); }, Math.max(4000, clean.length * 180));
      var origDone = done;
      done = function (err) {
        clearTimeout(guard);
        origDone(err);
      };
    });
  }

  function stopSpeaking() {
    if (!synth) return;
    try { synth.cancel(); } catch (e) {}
  }

  /* ── 오디오 파일 재생 (OpenAI TTS / 내 녹음) ─────── */
  function playUrl(url, opts) {
    opts = opts || {};
    unlockAudio();
    return new Promise(function (resolve) {
      try {
        if (!player) player = new Audio();
        player.pause();
        player.src = url;
        player.onended = function () { if (opts.onEnd) opts.onEnd(); resolve(); };
        player.onerror = function (e) { if (opts.onError) opts.onError(e); resolve(); };
        if (opts.onStart) opts.onStart();
        var p = player.play();
        if (p && p.catch) {
          p.catch(function (err) {
            if (opts.onError) opts.onError(err);
            resolve();
          });
        }
      } catch (err) {
        if (opts.onError) opts.onError(err);
        resolve();
      }
    });
  }

  function stopAudio() {
    if (!player) return;
    try { player.pause(); player.currentTime = 0; } catch (e) {}
  }

  function playBlob(blob, opts) {
    var url = URL.createObjectURL(blob);
    var opts2 = Object.assign({}, opts, {
      onEnd: function () {
        if (opts && opts.onEnd) opts.onEnd();
        setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
      }
    });
    return playUrl(url, opts2);
  }

  /* ── 음성 인식 (Web Speech API) ──────────────────── */
  function recognitionAvailable() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  var activeRecognition = null;

  function startRecognition(opts) {
    opts = opts || {};
    var Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) {
      if (opts.onError) opts.onError('unsupported');
      return null;
    }
    stopRecognition();

    var rec;
    try { rec = new Ctor(); } catch (e) {
      if (opts.onError) opts.onError('initialization-failed');
      return null;
    }

    rec.lang = opts.lang || 'en-US';
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;

    var finalText = '';
    var finished = false;

    function finish(reason) {
      if (finished) return;
      finished = true;
      activeRecognition = null;
      if (opts.onEnd) opts.onEnd(finalText, reason);
    }

    rec.onresult = function (event) {
      var interim = '';
      for (var i = event.resultIndex; i < event.results.length; i++) {
        var res = event.results[i];
        if (res.isFinal) finalText += res[0].transcript + ' ';
        else interim += res[0].transcript;
      }
      if (opts.onInterim) opts.onInterim(interim, finalText.trim());
    };

    rec.onerror = function (event) {
      var code = (event && event.error) || 'error';
      // no-speech / aborted 는 흐름상 정상 종료로 처리
      if (code === 'no-speech' || code === 'aborted') {
        finish(code);
        return;
      }
      if (opts.onError) opts.onError(code);
      finish(code);
    };

    rec.onend = function () { finish('end'); };

    try {
      rec.start();
    } catch (e) {
      if (opts.onError) opts.onError('start-failed');
      return null;
    }

    activeRecognition = {
      stop: function () { try { rec.stop(); } catch (e) {} },
      abort: function () { try { rec.abort(); } catch (e) {} finished = true; activeRecognition = null; }
    };
    return activeRecognition;
  }

  function stopRecognition() {
    if (activeRecognition) {
      try { activeRecognition.stop(); } catch (e) {}
      activeRecognition = null;
    }
  }

  /* ── 녹음 (MediaRecorder) ────────────────────────── */
  function recordingAvailable() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  }

  var recorder = null;
  var chunks = [];
  var mediaStream = null;
  var recordMime = '';

  function pickMime() {
    if (!window.MediaRecorder || !MediaRecorder.isTypeSupported) return '';
    var types = [
      'audio/mp4',
      'audio/mp4;codecs=mp4a.40.2',
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/ogg'
    ];
    for (var i = 0; i < types.length; i++) {
      try {
        if (MediaRecorder.isTypeSupported(types[i])) return types[i];
      } catch (e) {}
    }
    return '';
  }

  function startRecording() {
    if (!recordingAvailable()) return Promise.reject(new Error('unsupported'));
    return navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
    }).then(function (stream) {
      mediaStream = stream;
      var mime = pickMime();
      try {
        recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      } catch (e) {
        recorder = new MediaRecorder(stream);
      }
      recordMime = recorder.mimeType || mime || 'audio/webm';
      chunks = [];
      recorder.ondataavailable = function (e) {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };
      recorder.start(250);
      return true;
    });
  }

  function stopRecording() {
    return new Promise(function (resolve, reject) {
      if (!recorder) return reject(new Error('no-recorder'));
      var rec = recorder;
      recorder = null;
      rec.onstop = function () {
        var blob = new Blob(chunks, { type: recordMime.split(';')[0] });
        var mime = recordMime.split(';')[0];
        releaseStream();
        resolve({ blob: blob, mimeType: mime, extension: mime.indexOf('mp4') >= 0 ? 'mp4' : (mime.indexOf('ogg') >= 0 ? 'ogg' : 'webm') });
      };
      try { rec.stop(); } catch (e) { releaseStream(); reject(e); }
    });
  }

  function releaseStream() {
    if (mediaStream) {
      try { mediaStream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
      mediaStream = null;
    }
  }

  function cancelRecording() {
    try {
      if (recorder && recorder.state !== 'inactive') recorder.stop();
    } catch (e) {}
    recorder = null;
    releaseStream();
  }

  function isRecording() {
    return !!(recorder && recorder.state === 'recording');
  }

  window.SpeakySpeech = {
    get ttsAvailable() { return !!synth; },
    get voiceCount() { return voices.length; },
    voiceName: function () { var v = pickVoice(); return v ? v.name : ''; },
    speak: speak,
    stopSpeaking: stopSpeaking,
    playUrl: playUrl,
    playBlob: playBlob,
    stopAudio: stopAudio,
    unlockAudio: unlockAudio,
    recognitionAvailable: recognitionAvailable,
    startRecognition: startRecognition,
    stopRecognition: stopRecognition,
    recordingAvailable: recordingAvailable,
    startRecording: startRecording,
    stopRecording: stopRecording,
    cancelRecording: cancelRecording,
    isRecording: isRecording
  };
})();
