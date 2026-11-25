/* ============================================================
   Speaky — 앱 컨트롤러
   ============================================================ */
(function () {
  'use strict';

  /* ── 오류 수집 (검증용) ─────────────────────────── */
  window.__speakyErrors = [];
  window.addEventListener('error', function (e) {
    window.__speakyErrors.push(String((e && e.message) || (e && e.error) || 'error'));
  });
  window.addEventListener('unhandledrejection', function (e) {
    var r = e && e.reason;
    window.__speakyErrors.push('unhandledrejection: ' + ((r && r.message) || r));
  });
  var nativeConsoleError = console.error.bind(console);
  console.error = function () {
    try {
      window.__speakyErrors.push(Array.prototype.map.call(arguments, function (a) {
        return (a && a.message) ? a.message : String(a);
      }).join(' '));
    } catch (err) {}
    nativeConsoleError.apply(null, arguments);
  };

  var DATA = window.SPEAKY_DATA;
  var FEEDBACK = window.SPEAKY_FEEDBACK;
  var TEXT = window.SpeakyText;
  var SPEECH = window.SpeakySpeech;
  var AI = window.SpeakyAI;
  var DEMO = window.SpeakyDemoAI;

  var PROGRESS_KEY = 'speaky.progress.v1';

  var state = {
    mode: 'adult',
    tab: 'drill',
    topicIndex: 0,
    phraseIndex: 0,
    speed: 1,
    stars: { adult: 0, kid: 0 },
    done: {},
    drill: { listening: false, playing: false, processing: false, handled: false },
    rp: {
      scenario: null,
      turnIndex: 0,
      hints: [],
      history: [],
      busy: false,
      done: false,
      messages: 0
    }
  };

  var speakStore = [];
  var toastTimer = null;
  var sheetOpen = null;

  function $(id) { return document.getElementById(id); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function data() { return DATA[state.mode]; }
  function topic() { return data().topics[state.topicIndex] || data().topics[0]; }
  function phrase() { return topic().phrases[state.phraseIndex] || topic().phrases[0]; }

  /* ── 저장/복원 ─────────────────────────────────── */
  function loadProgress() {
    try {
      var raw = localStorage.getItem(PROGRESS_KEY);
      if (!raw) return;
      var p = JSON.parse(raw);
      if (p.stars) {
        state.stars.adult = p.stars.adult || 0;
        state.stars.kid = p.stars.kid || 0;
      }
      state.done = p.done || {};
      if (p.mode === 'kid' || p.mode === 'adult') state.mode = p.mode;
    } catch (e) {}
  }

  function saveProgress() {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify({
        mode: state.mode,
        stars: state.stars,
        done: state.done
      }));
    } catch (e) {}
  }

  /* ── 토스트 ────────────────────────────────────── */
  function toast(msg, ms) {
    var el = $('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, ms || 2400);
  }

  /* ── 시트 ──────────────────────────────────────── */
  function openSheet(id) {
    var el = $(id);
    if (!el) return;
    el.hidden = false;
    sheetOpen = id;
    document.body.style.overflow = 'hidden';
    var focusable = el.querySelector('input, button');
    if (focusable) setTimeout(function () { try { focusable.focus(); } catch (e) {} }, 260);
  }

  function closeSheet() {
    if (!sheetOpen) return;
    var el = $(sheetOpen);
    if (el) el.hidden = true;
    sheetOpen = null;
    document.body.style.overflow = '';
  }

  /* ── 모드 / 탭 ─────────────────────────────────── */
  function setMode(mode) {
    if (mode !== 'adult' && mode !== 'kid') return;
    if (state.mode === mode) {
      updateModeUI();
      return;
    }
    state.mode = mode;
    state.topicIndex = 0;
    state.phraseIndex = 0;
    state.speed = data().defaultSpeed;
    saveProgress();

    stopAllAudio();
    resetDrillResult();
    closeRoleplay(true);

    updateModeUI();
    renderTopics();
    renderPhrase();
    renderScenarioGrid();
    updateBadge();
  }

  function updateModeUI() {
    document.body.setAttribute('data-mode', state.mode);
    qsa('[data-mode-btn]').forEach(function (btn) {
      var on = btn.getAttribute('data-mode-btn') === state.mode;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    var d = data();
    $('drillEyebrow').textContent = '오늘의 회화 · ' + d.label;
    $('rpEyebrow').textContent = 'AI 롤플레이 · ' + d.label;
    $('drillTitle').textContent = state.mode === 'kid' ? '오늘은 무슨 이야기 할까?' : '상황을 골라요';
    $('roleplayHeading').textContent = state.mode === 'kid' ? '어떤 이야기를 나눠 볼까?' : '상황을 골라 대화해요';
    $('rpDesc').textContent = state.mode === 'kid'
      ? 'AI 친구와 생각을 주고받고, 내 문장은 더 세련되고 논리적인 표현으로 다듬어 줘요.'
      : 'AI 튜터와 실제 상황처럼 대화하고, 내 문장은 바로 교정받아요.';
    $('chatInput').placeholder = state.mode === 'kid' ? '영어로 네 생각을 말해 봐' : '영어로 답해 보세요';
    $('composeNote').textContent = micHintText();
    $('starCount').innerHTML = '⭐ <b>' + (state.stars[state.mode] || 0) + '</b>';
    updateMeter();
  }

  function micHintText() {
    if (SPEECH.recognitionAvailable()) {
      return state.mode === 'kid'
        ? '마이크를 누르고 또박또박 말해 봐!'
        : '마이크를 누르고 말하면 자동으로 인식돼요.';
    }
    if (AI.isLive() && SPEECH.recordingAvailable()) {
      return '마이크로 녹음하면 AI가 받아 적어요.';
    }
    return '음성 인식이 없는 브라우저예요. 텍스트로 입력해 주세요.';
  }

  function setTab(tab) {
    state.tab = tab === 'roleplay' ? 'roleplay' : 'drill';
    if (SPEECH.isRecording()) SPEECH.cancelRecording();
    state.drill.recordMode = false;
    state.rp.recording = false;
    document.body.setAttribute('data-tab', state.tab);
    qsa('[data-tab-btn]').forEach(function (btn) {
      var on = btn.getAttribute('data-tab-btn') === state.tab;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    $('drillView').classList.toggle('is-active', state.tab === 'drill');
    $('roleplayView').classList.toggle('is-active', state.tab === 'roleplay');
    if (state.tab === 'drill') {
      stopListening();
      SPEECH.stopSpeaking();
    } else {
      SPEECH.stopSpeaking();
      scrollChat();
    }
  }

  /* ── 따라 말하기 ───────────────────────────────── */
  function renderTopics() {
    var wrap = $('topicChips');
    wrap.innerHTML = '';
    data().topics.forEach(function (t, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip' + (i === state.topicIndex ? ' is-active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', i === state.topicIndex ? 'true' : 'false');
      btn.innerHTML = '<span class="c-emoji" aria-hidden="true">' + t.emoji + '</span><span>' + esc(t.title) + '</span>';
      btn.addEventListener('click', function () {
        if (state.topicIndex === i) return;
        state.topicIndex = i;
        state.phraseIndex = 0;
        stopAllAudio();
        resetDrillResult();
        renderTopics();
        renderPhrase();
      });
      wrap.appendChild(btn);
    });
    var active = wrap.querySelector('.is-active');
    if (active && active.scrollIntoView) {
      active.scrollIntoView({ block: 'nearest', inline: 'center' });
    }
  }

  function renderPhrase() {
    drillSession += 1;
    var t = topic();
    var p = phrase();
    $('phraseEn').textContent = p.en;
    $('phraseKo').textContent = p.ko;
    $('phraseTipText').textContent = p.tip;
    $('phraseCounter').textContent = (state.phraseIndex + 1) + ' / ' + t.phrases.length;
    renderSpeed();
    renderNav();
    resetDrillResult();
    $('micLabel').textContent = state.mode === 'kid'
      ? '마이크를 누르고 따라 말해 봐!'
      : '마이크를 누르고 따라 말해보세요';
    $('micLabel').classList.remove('live');
  }

  function renderSpeed() {
    qsa('#speedSwitch button').forEach(function (b) {
      b.classList.toggle('is-active', Number(b.getAttribute('data-speed')) === state.speed);
    });
  }

  function renderNav() {
    var total = topic().phrases.length;
    $('prevBtn').disabled = state.phraseIndex === 0;
    $('nextBtn').disabled = state.phraseIndex >= total - 1;
    var dots = $('navDots');
    dots.innerHTML = '';
    for (var i = 0; i < total; i++) {
      var d = document.createElement('i');
      if (i === state.phraseIndex) d.className = 'on';
      else if (state.done[state.mode + ':' + topic().id + ':' + i]) d.className = 'done';
      dots.appendChild(d);
    }
    updateMeter();
  }

  function updateMeter() {
    // 별 카운터 (헤더 아래)
    var el = $('starCount');
    if (el) el.innerHTML = '⭐ <b>' + (state.stars[state.mode] || 0) + '</b>';
  }

  function clearResult() {
    $('resultArea').innerHTML = '';
  }

  function resetDrillResult() {
    clearResult();
    $('typeForm').classList.add('is-hidden');
    $('typeToggle').classList.remove('is-hidden');
    $('typeInput').value = '';
    $('playBtn').classList.remove('is-playing');
  }

  function showTypeInput(message) {
    $('typeForm').classList.remove('is-hidden');
    $('typeToggle').classList.add('is-hidden');
    if (message) toast(message, 3200);
    setTimeout(function () { try { $('typeInput').focus(); } catch (e) {} }, 80);
  }

  function setPlaying(on) {
    state.drill.playing = on;
    $('playBtn').classList.toggle('is-playing', on);
    $('micBtn').classList.remove('is-playing');
    $('wave').classList.toggle('is-on', on || state.drill.listening);
    if (on) {
      $('micLabel').textContent = '원어민 음성을 듣고 있어요…';
      $('micLabel').classList.add('live');
    }
  }

  function setListening(on) {
    state.drill.listening = on;
    $('micBtn').classList.toggle('is-listening', on);
    $('wave').classList.toggle('is-on', on || state.drill.playing);
    if (on) {
      $('micLabel').textContent = '듣고 있어요… 말이 끝나면 자동으로 멈춰요';
      $('micLabel').classList.add('live');
    } else {
      $('micLabel').classList.remove('live');
    }
  }

  function stopAllAudio() {
    SPEECH.stopSpeaking();
    SPEECH.stopAudio();
    SPEECH.stopRecognition();
    if (SPEECH.isRecording()) SPEECH.cancelRecording();
    state.drill.playing = false;
    state.drill.listening = false;
    $('micBtn').classList.remove('is-playing', 'is-listening');
    $('wave').classList.remove('is-on');
    $('chatMicBtn').classList.remove('is-listening');
  }

  function speakText(text, opts) {
    opts = opts || {};
    // 기본은 자연스러운 원어민 속도(1.0x). 느리게 듣고 싶을 때만 0.8x를 넘깁니다.
    var rate = opts.rate || 1;
    if (AI.isLive()) {
      return AI.tts(text, { speed: rate, mode: state.mode })
        .then(function (url) { return SPEECH.playUrl(url, {}); })
        .catch(function () { return SPEECH.speak(text, { rate: rate }); });
    }
    return SPEECH.speak(text, { rate: rate });
  }

  function playPhrase(rate) {
    if (state.drill.listening) stopListening();
    var text = phrase().en;
    var speed = rate || state.speed;

    SPEECH.stopSpeaking();
    SPEECH.stopAudio();
    setPlaying(true);

    var fallback = function () {
      SPEECH.speak(text, {
        rate: speed,
        onStart: function () { setPlaying(true); },
        onEnd: function () { setPlaying(false); }
      });
    };

    if (AI.isLive()) {
      AI.tts(text, { speed: speed, mode: state.mode })
        .then(function (url) {
          return SPEECH.playUrl(url, { onEnd: function () { setPlaying(false); } });
        })
        .catch(function () { fallback(); });
    } else {
      fallback();
    }
  }

  /* ── 마이크: 따라 말하기 ───────────────────────── */
  var recognitionFailed = false;
  var drillSession = 0;   // 화면이 바뀌면 늦게 도착한 인식 결과를 무시
  var rpSession = 0;

  function onDrillMic() {
    if (state.drill.playing) {
      SPEECH.stopSpeaking();
      SPEECH.stopAudio();
      setPlaying(false);
      return;
    }
    if (state.drill.listening) {
      if (state.drill.recordMode) finishDrillRecording();
      else stopListening();
      return;
    }
    if (state.drill.processing) return;

    SPEECH.unlockAudio();
    SPEECH.stopSpeaking();
    recognitionFailed = false;

    if (!SPEECH.recognitionAvailable() && !SPEECH.recordingAvailable()) {
      showTypeInput('이 기기에서는 마이크를 쓸 수 없어요. 텍스트로 연습해 보세요.');
      return;
    }

    if (SPEECH.recognitionAvailable()) {
      startDrillRecognition();
    } else if (AI.isLive() && SPEECH.recordingAvailable()) {
      startDrillRecording();
    } else {
      showTypeInput('이 브라우저는 음성 인식을 지원하지 않아요. 들린 대로 입력해 보세요.');
    }
  }

  function startDrillRecognition() {
    clearResult();
    setListening(true);
    $('micLabel').textContent = '듣고 있어요… 문장을 말해 보세요';
    state.drill.handled = false;
    var session = drillSession;
    var interimText = '';

    SPEECH.startRecognition({
      lang: 'en-US',
      onInterim: function (interim, finalText) {
        if (session !== drillSession) return;
        interimText = (finalText + ' ' + interim).trim();
        if (interimText) $('micLabel').textContent = '“' + interimText + '”';
      },
      onError: function (code) {
        if (session !== drillSession) return;
        recognitionFailed = true;
        handleRecognitionError(code);
      },
      onEnd: function (finalText) {
        if (session !== drillSession) return;
        setListening(false);
        if (state.drill.handled) return;
        state.drill.handled = true;
        var heard = String(finalText || interimText || '').trim();
        if (heard) {
          handleDrillResult(heard);
        } else if (recognitionFailed) {
          offerFallback();
        } else {
          $('micLabel').textContent = '잘 안 들렸어요. 한 번 더 말해 볼까요?';
          $('micLabel').classList.remove('live');
        }
      }
    });
  }

  function handleRecognitionError(code) {
    if (code === 'not-allowed' || code === 'service-not-allowed') {
      toast('마이크 권한이 필요해요. 브라우저 설정에서 허용해 주세요.', 3400);
    } else if (code === 'network') {
      toast('음성 인식 서버에 연결하지 못했어요.', 3000);
    } else if (code === 'audio-capture') {
      toast('마이크를 찾지 못했어요.', 3000);
    }
  }

  function offerFallback() {
    $('micLabel').textContent = '음성 인식이 어려워요. 텍스트로 연습해 보세요.';
    $('micLabel').classList.remove('live');
    showTypeInput('음성 인식이 되지 않아 텍스트 입력으로 바꿨어요. (아이폰은 설정에서 음성 인식을 켜 주세요)');
  }

  function stopListening() {
    if (!state.drill.listening) return;
    SPEECH.stopRecognition();
    setListening(false);
  }

  function startDrillRecording() {
    SPEECH.startRecording().then(function () {
      setListening(true);
      $('micLabel').textContent = '녹음 중… 다 말하면 마이크를 다시 눌러 주세요';
      state.drill.recordMode = true;
    }).catch(function () {
      showTypeInput('마이크 권한을 허용해 주세요.');
    });
  }

  function finishDrillRecording() {
    var session = drillSession;
    setListening(false);
    state.drill.recordMode = false;
    state.drill.processing = true;
    $('micLabel').textContent = '음성을 확인하고 있어요…';
    $('micLabel').classList.add('live');

    SPEECH.stopRecording().then(function (rec) {
      if (!rec || !rec.blob || !rec.blob.size) throw new Error('빈 녹음이에요. 다시 말해 주세요.');
      return AI.transcribe(rec.blob, rec.extension);
    }).then(function (text) {
      state.drill.processing = false;
      if (session !== drillSession) return;
      if (text && text.trim()) handleDrillResult(text.trim());
      else {
        $('micLabel').textContent = '잘 안 들렸어요. 다시 말해 볼까요?';
        $('micLabel').classList.remove('live');
        showTypeInput('음성을 알아듣지 못했어요. 텍스트로 입력해 보세요.');
      }
    }).catch(function (err) {
      state.drill.processing = false;
      if (session !== drillSession) return;
      $('micLabel').classList.remove('live');
      toast((err && err.message) || '음성 인식에 실패했어요.', 3000);
      showTypeInput('음성 인식에 실패했어요. 텍스트로 이어서 연습해 보세요.');
    });
  }

  function handleDrillResult(text) {
    var result = TEXT.compare(phrase().en, text);
    renderDrillResult(result, text);

    var key = state.mode + ':' + topic().id + ':' + state.phraseIndex;
    if (result.score >= 85 && !state.done[key]) {
      state.done[key] = true;
      state.stars[state.mode] = (state.stars[state.mode] || 0) + 1;
      saveProgress();
      updateMeter();
      renderNav();
      toast(state.mode === 'kid' ? '⭐ 별 하나 획득! 발음 좋아!' : '⭐ 별을 하나 얻었어요!', 2000);
    }
    $('micLabel').textContent = result.score >= 85 ? '아주 좋아요! 한 번 더 말해 볼까요?' : '다시 들어 보고 한 번 더 말해 보세요.';
    $('micLabel').classList.remove('live');
  }

  function renderDrillResult(result, spokenText) {
    var area = $('resultArea');
    var band = result.band;
    var msg = pick(FEEDBACK[state.mode][band]);
    var C = 2 * Math.PI * 26;

    var targetHtml = result.target.map(function (w) {
      return '<span class="w ' + w.status + '">' + esc(w.text) + '</span>';
    }).join(' ');

    var spokenHtml = result.spoken.length
      ? result.spoken.map(function (w) {
          var cls = w.status === 'extra' ? ' extra' : (w.status === 'near' ? ' near' : '');
          return '<span class="w' + cls + '">' + esc(w.text) + '</span>';
        }).join(' ')
      : '<span class="w extra">' + esc(spokenText) + '</span>';

    var ringClass = result.score >= 72 ? '' : (result.score >= 45 ? ' mid' : ' low');
    var hasLegend = result.missed > 0 || result.near > 0 || result.extra > 0;

    area.innerHTML =
      '<div class="result-card">' +
        '<div class="score-row">' +
          '<div class="score-ring' + ringClass + '">' +
            '<svg viewBox="0 0 62 62" aria-hidden="true">' +
              '<circle class="track" cx="31" cy="31" r="26"></circle>' +
              '<circle class="bar" cx="31" cy="31" r="26" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + C.toFixed(1) + '"></circle>' +
            '</svg>' +
            '<div class="score-num">' + result.score + '<small>점</small></div>' +
          '</div>' +
          '<div class="score-text">' +
            '<b>' + esc(msg) + '</b>' +
            '<span>' + (result.missed === 0 && result.extra === 0
              ? '모든 단어를 정확하게 말했어요.'
              : '놓친 단어 ' + result.missed + '개 · 추가로 말한 단어 ' + result.extra + '개') + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="diff-block">' +
          '<p class="diff-label">목표 문장</p>' +
          '<div class="diff-line">' + targetHtml + '</div>' +
        '</div>' +
        '<div class="diff-block">' +
          '<p class="diff-label">내가 말한 문장</p>' +
          '<div class="diff-line">' + spokenHtml + '</div>' +
        '</div>' +
        (hasLegend
          ? '<div class="legend">' +
              '<span><i class="l-ok"></i>맞은 단어</span>' +
              '<span><i class="l-near"></i>비슷하게 들린 단어</span>' +
              '<span><i class="l-miss"></i>놓친 단어</span>' +
            '</div>'
          : '') +
        '<div class="result-actions">' +
          '<button type="button" data-act="listen">🔊 다시 듣기</button>' +
          '<button type="button" data-act="retry" class="primary">🎤 다시 말하기</button>' +
        '</div>' +
      '</div>';

    var bar = area.querySelector('.bar');
    requestAnimationFrame(function () {
      setTimeout(function () {
        bar.style.strokeDashoffset = String(C * (1 - result.score / 100));
      }, 60);
    });

    area.querySelector('[data-act="listen"]').addEventListener('click', function () {
      playPhrase(state.speed);
    });
    area.querySelector('[data-act="retry"]').addEventListener('click', function () {
      onDrillMic();
    });
  }

  /* ── AI 롤플레이 ───────────────────────────────── */
  function renderScenarioGrid() {
    var grid = $('scenarioGrid');
    grid.innerHTML = '';
    data().scenarios.forEach(function (sc) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'scenario-card';
      btn.innerHTML =
        '<span class="sc-emoji" aria-hidden="true">' + sc.emoji + '</span>' +
        '<span class="sc-title">' + esc(sc.title) + '</span>' +
        '<span class="sc-sub">' + esc(sc.sub) + '</span>' +
        '<span class="sc-level">' + esc(sc.level) + '</span>';
      btn.addEventListener('click', function () { openScenario(sc.id); });
      grid.appendChild(btn);
    });
  }

  function findScenario(id) {
    return data().scenarios.filter(function (s) { return s.id === id; })[0] || null;
  }

  function openScenario(id) {
    var sc = findScenario(id);
    if (!sc) return;
    rpSession += 1;
    state.rp = {
      scenario: sc,
      turnIndex: 0,
      hints: (sc.steps[0] && sc.steps[0].hints) || [],
      history: [],
      busy: false,
      done: false,
      messages: 0
    };
    $('rpPicker').classList.add('is-hidden');
    $('rpChat').classList.remove('is-hidden');
    $('chatScenarioTitle').textContent = sc.title;
    $('chatScenarioSub').textContent = 'AI 튜터 ' + sc.tutor.name + ' · ' + sc.place;
    $('chatGoal').innerHTML = '<b>목표</b><span>' + esc(sc.goal) + '</span>';
    $('messages').innerHTML = '';
    $('chatInput').value = '';
    updateBadge();
    updateHintButton();

    var greeting = {
      en: sc.opening.en,
      ko: sc.opening.ko,
      tutor: true
    };
    appendMessage(greeting);
    scrollChat(true);
    $('chatInput').focus({ preventScroll: true });

    // 상황 카드를 누른 제스처 안에서 첫 인사를 들려줌 (iOS 자동재생 정책 대응)
    setTimeout(function () {
      if (!state.rp.scenario || state.rp.scenario.id !== sc.id) return;
      speakText(sc.opening.en, { rate: 1 });
    }, 320);
  }

  function closeRoleplay(force) {
    if (!state.rp.scenario && !force) return;
    rpSession += 1;
    state.rp.recording = false;
    if (SPEECH.isRecording()) SPEECH.cancelRecording();
    SPEECH.stopSpeaking();
    SPEECH.stopAudio();
    SPEECH.stopRecognition();
    $('rpChat').classList.add('is-hidden');
    $('rpPicker').classList.remove('is-hidden');
    state.rp = {
      scenario: null,
      turnIndex: 0,
      hints: [],
      history: [],
      busy: false,
      done: false,
      messages: 0
    };
    $('messages').innerHTML = '';
  }

  function updateBadge() {
    var badge = $('aiBadge');
    if (!badge) return;
    if (AI.isLive()) {
      badge.textContent = AI.usingServer() ? 'AI · SERVER' : 'AI · GPT-4o-mini';
      badge.classList.add('live');
    } else {
      badge.textContent = 'DEMO';
      badge.classList.remove('live');
    }
  }

  function speakButtonHtml(text) {
    var id = speakStore.push(text) - 1;
    return '<button type="button" class="speak-inline" data-speak="' + id + '" aria-label="이 문장 듣기">▶</button>';
  }

  function appendMessage(m) {
    var wrap = document.createElement('div');
    wrap.className = 'msg ' + (m.tutor ? 'tutor' : 'me');
    var avatar = m.tutor
      ? (state.rp.scenario && state.rp.scenario.tutor ? state.rp.scenario.tutor.emoji : '👩‍🏫')
      : '🙋';
    wrap.innerHTML =
      '<div class="avatar" aria-hidden="true">' + avatar + '</div>' +
      '<div class="bubble">' + esc(m.en) +
        (m.tutor ? speakButtonHtml(m.en) : '') +
        (m.ko ? '<span class="ko">' + esc(m.ko) + '</span>' : '') +
      '</div>';
    $('messages').appendChild(wrap);
    state.rp.messages += 1;
    return wrap;
  }

  function appendTyping() {
    var wrap = document.createElement('div');
    wrap.className = 'msg tutor';
    wrap.id = 'typingMsg';
    var emoji = state.rp.scenario ? state.rp.scenario.tutor.emoji : '👩‍🏫';
    wrap.innerHTML =
      '<div class="avatar" aria-hidden="true">' + emoji + '</div>' +
      '<div class="bubble typing" aria-label="답변을 준비하고 있어요"><i></i><i></i><i></i></div>';
    $('messages').appendChild(wrap);
    scrollChat();
  }

  function removeTyping() {
    var el = $('typingMsg');
    if (el) el.remove();
  }

  function appendCorrection(corr, original) {
    if (!corr || !corr.better) return;
    var kind = corr.kind || 'fix';
    if (kind === 'retry') return; // 한글 입력 등은 별도 카드 생략

    var isPerfect = kind === 'perfect';
    var label = corr.label || (kind === 'upgrade' ? '더 자연스럽게' : '교정');
    var headIcon = isPerfect ? '🌟' : (kind === 'upgrade' ? '💡' : '✍️');

    var el = document.createElement('div');
    el.className = 'correction' + (isPerfect ? ' perfect' : '');

    var body = '';
    if (!isPerfect && original) {
      body += '<div class="corr-row old"><span class="tag">내 말</span><s>' + esc(original) + '</s></div>';
    }
    body += '<div class="corr-row new"><span class="tag">' + (isPerfect ? '좋아요' : '이렇게') + '</span>' +
      esc(corr.better) + ' ' + speakButtonHtml(corr.better) + '</div>';
    if (corr.note) body += '<div class="corr-note">' + esc(corr.note) + '</div>';

    var headLabel = isPerfect ? '칭찬' : (AI.isLive() ? 'AI 교정' : '표현 교정');

    el.innerHTML =
      '<div class="corr-head">' + headIcon + ' ' + headLabel + ' · ' + esc(label) + '</div>' +
      body +
      (isPerfect ? '' : '<button type="button" class="corr-try" data-try="' + esc(corr.better) + '">따라 말해보기 ▶</button>');

    $('messages').appendChild(el);
  }

  function updateHintButton() {
    var btn = $('hintBtn');
    var has = state.rp.hints && state.rp.hints.length;
    btn.disabled = !has;
    btn.style.opacity = has ? '1' : '.45';
    btn.textContent = has ? '💡 뭐라고 말할지 막힐 때' : '💡 힌트를 다 썼어요';
  }

  function scrollChat(instant) {
    var el = $('chatScroll');
    if (!el) return;
    var doScroll = function () {
      el.scrollTo({ top: el.scrollHeight, behavior: instant ? 'auto' : 'smooth' });
    };
    requestAnimationFrame(doScroll);
  }

  function setRpBusy(on) {
    state.rp.busy = on;
    $('chatSendBtn').disabled = on;
    $('chatInput').disabled = on;
  }

  function sendRoleplay(rawText) {
    var text = String(rawText || '').trim();
    if (!text || state.rp.busy || !state.rp.scenario) return;
    if (state.rp.done) {
      toast('대화가 끝났어요. 다시 시작해 볼까요?');
      return;
    }

    $('chatInput').value = '';
    appendMessage({ en: text, tutor: false });
    scrollChat();
    setRpBusy(true);
    appendTyping();

    var scenario = state.rp.scenario;
    var turnIndex = state.rp.turnIndex;

    if (AI.isLive()) {
      state.rp.history.push({ role: 'user', content: text });
      AI.chat({
        mode: state.mode,
        scenario: scenario,
        history: state.rp.history.slice(0, -1),
        text: text
      }).then(function (res) {
        finishTurn(res, text);
      }).catch(function (err) {
        // AI 오류 시 데모 엔진으로 이어서 대화
        toast((err && err.message) || 'AI 연결에 실패했어요.', 3200);
        var fallback = DEMO.reply({ scenario: scenario, mode: state.mode, turnIndex: turnIndex, text: text });
        fallback.__fallback = true;
        finishTurn(fallback, text);
      });
    } else {
      var delay = DEMO.thinkingDelay(state.mode);
      setTimeout(function () {
        var res = DEMO.reply({ scenario: scenario, mode: state.mode, turnIndex: turnIndex, text: text });
        finishTurn(res, text);
      }, delay);
    }
  }

  function finishTurn(res, originalText) {
    removeTyping();
    setRpBusy(false);

    var reply = String(res.reply || '').trim();
    if (!reply) reply = 'Sorry, could you say that again?';

    appendMessage({ en: reply, ko: res.replyKo || '', tutor: true });

    var corr = res.correction;
    if (corr) {
      // AI 응답은 {better, explanation} 형태 → 카드 형식으로 변환
      if (!corr.note && corr.explanation) corr.note = corr.explanation;
      appendCorrection(corr, originalText);
    }

    state.rp.history.push({ role: 'assistant', content: reply });
    state.rp.turnIndex = state.rp.turnIndex + 1;
    state.rp.hints = res.hints || [];
    updateHintButton();
    scrollChat();

    if (!res.__fallback) {
      speakText(reply, { rate: 1 });
    }

    if (res.done) {
      state.rp.done = true;
      var end = document.createElement('div');
      end.className = 'chat-goal';
      end.style.marginTop = '6px';
      end.innerHTML = '<b>완료</b><span>대화를 끝까지 마쳤어요! 다른 상황도 골라 보세요.</span>';
      $('messages').appendChild(end);
      updateHintButton();
      scrollChat();
    }
  }

  /* ── 롤플레이 마이크 ───────────────────────────── */
  function onChatMic() {
    if (state.rp.busy) return;
    SPEECH.stopSpeaking();
    SPEECH.stopAudio();

    if (state.rp.listening) {
      stopChatListening();
      return;
    }

    if (SPEECH.recognitionAvailable()) {
      startChatRecognition();
    } else if (AI.isLive() && SPEECH.recordingAvailable()) {
      startChatRecording();
    } else {
      $('chatInput').focus();
      toast('음성 인식이 없는 브라우저예요. 텍스트로 입력해 주세요.', 2600);
    }
  }

  function setChatListening(on) {
    state.rp.listening = on;
    $('chatMicBtn').classList.toggle('is-listening', on);
    $('composeNote').textContent = on
      ? '듣고 있어요… 말이 끝나면 자동으로 마무리돼요'
      : micHintText();
  }

  function startChatRecognition() {
    var acc = '';
    var session = rpSession;
    setChatListening(true);
    SPEECH.startRecognition({
      lang: 'en-US',
      onInterim: function (interim, finalText) {
        if (session !== rpSession) return;
        acc = (finalText + ' ' + interim).trim();
        $('chatInput').value = acc;
      },
      onError: function (code) {
        if (session !== rpSession) return;
        recognitionFailed = true;
        handleRecognitionError(code);
      },
      onEnd: function (finalText) {
        if (session !== rpSession) return;
        setChatListening(false);
        var text = (finalText || acc || '').trim();
        if (text) {
          $('chatInput').value = text;
          toast('확인하고 보내기 버튼을 눌러 주세요.', 1800);
        } else if (recognitionFailed) {
          $('chatInput').focus();
          toast('음성 인식이 어려워요. 텍스트로 입력해 주세요.', 2600);
        }
      }
    });
  }

  function stopChatListening() {
    SPEECH.stopRecognition();
    setChatListening(false);
  }

  function startChatRecording() {
    SPEECH.startRecording().then(function () {
      setChatListening(true);
      state.rp.recording = true;
    }).catch(function () {
      toast('마이크 권한을 허용해 주세요.', 2600);
    });
  }

  function finishChatRecording() {
    var session = rpSession;
    setChatListening(false);
    $('composeNote').textContent = '음성을 확인하고 있어요…';
    SPEECH.stopRecording().then(function (rec) {
      if (!rec || !rec.blob || !rec.blob.size) throw new Error('빈 녹음이에요. 다시 말해 주세요.');
      return AI.transcribe(rec.blob, rec.extension);
    }).then(function (text) {
      if (session !== rpSession) return;
      $('composeNote').textContent = micHintText();
      if (text && text.trim()) {
        $('chatInput').value = text.trim();
        toast('확인하고 보내기 버튼을 눌러 주세요.', 1800);
      } else {
        toast('잘 안 들렸어요. 다시 말해 주세요.', 2400);
      }
    }).catch(function (err) {
      if (session !== rpSession) return;
      $('composeNote').textContent = micHintText();
      toast((err && err.message) || '음성 인식에 실패했어요.', 2800);
    });
  }

  /* ── 힌트 ──────────────────────────────────────── */
  function openHints() {
    if (!state.rp.hints || !state.rp.hints.length) {
      toast('지금은 힌트가 없어요.');
      return;
    }
    var list = $('hintList');
    list.innerHTML = '';
    state.rp.hints.forEach(function (hint) {
      var item = document.createElement('div');
      item.className = 'hint-item';
      var id = speakStore.push(hint) - 1;
      item.innerHTML =
        '<div class="hi-text"><b>' + esc(hint) + '</b></div>' +
        '<div class="hi-actions">' +
          '<button type="button" data-speak="' + id + '" aria-label="듣기">🔊</button>' +
          '<button type="button" class="use" data-use-hint="' + esc(hint) + '">쓰기</button>' +
        '</div>';
      list.appendChild(item);
    });
    openSheet('hintSheet');
  }

  /* ── 설정 ──────────────────────────────────────── */
  function initSettingsUI() {
    qsa('input[name="aiMode"]').forEach(function (radio) {
      radio.checked = radio.value === AI.config.mode;
      radio.addEventListener('change', function () {
        if (!radio.checked) return;
        AI.setMode(radio.value);
        $('keyBox').hidden = radio.value !== 'key';
        updateAIStatus();
        updateBadge();
        if (radio.value === 'server') {
          AI.probeServer().then(function () {
            updateAIStatus();
            updateBadge();
            $('composeNote').textContent = micHintText();
          });
        }
        if (radio.value === 'key' && AI.config.key) {
          AI.verifyKey().then(function (ok) {
            updateAIStatus(ok);
          });
        }
        $('composeNote').textContent = micHintText();
      });
    });

    $('apiKeyInput').value = AI.config.key || '';
    $('keyBox').hidden = AI.config.mode !== 'key';

    var keyTimer = null;
    $('apiKeyInput').addEventListener('input', function () {
      clearTimeout(keyTimer);
      keyTimer = setTimeout(function () {
        AI.setKey($('apiKeyInput').value);
        updateAIStatus();
        updateBadge();
      }, 700);
    });

    $('keyToggleBtn').addEventListener('click', function () {
      var input = $('apiKeyInput');
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      $('keyToggleBtn').textContent = show ? '숨기기' : '보기';
    });

    $('voiceTestBtn').addEventListener('click', function () {
      var sample = state.mode === 'kid'
        ? "Hey! Want to hear about the book I just finished? I have so many thoughts about the ending."
        : 'Hi there! This is how I sound. Ready to practice?';
      if (speakStore.length > 200) speakStore = [];
      SPEECH.speak(sample, { rate: 1 });
      $('voiceStatus').textContent = SPEECH.voiceCount
        ? '영어 목소리 ' + SPEECH.voiceCount + '개를 찾았어요. (선택: ' + (SPEECH.voiceName() || '기본') + ')'
        : '이 브라우저에서 목소리 목록을 아직 불러오지 못했어요. 재생해 보세요.';
    });

    $('resetBtn').addEventListener('click', function () {
      if (!window.confirm('학습 기록(별 · 완료 표시)을 지울까요?')) return;
      state.stars = { adult: 0, kid: 0 };
      state.done = {};
      saveProgress();
      updateMeter();
      renderNav();
      resetDrillResult();
      toast('학습 기록을 지웠어요.');
    });

    updateAIStatus();
  }

  function updateAIStatus(verified) {
    var el = $('aiStatusText');
    if (!el) return;
    var mode = AI.config.mode;
    el.classList.remove('ok', 'warn');

    if (mode === 'demo') {
      el.textContent = '지금은 데모 모드예요. 키 없이도 따라 말하기·롤플레이·교정을 모두 체험할 수 있어요.';
    } else if (mode === 'key') {
      if (!AI.config.key) {
        el.textContent = 'OpenAI API 키를 입력하면 Whisper 음성인식 · gpt-4o-mini · TTS로 동작해요.';
        el.classList.add('warn');
      } else if (verified === false) {
        el.textContent = '키를 확인하지 못했어요. 키가 맞는지 확인해 주세요.';
        el.classList.add('warn');
      } else {
        el.textContent = '키가 저장됐어요. 이 기기 브라우저에만 보관되고, 음성·문장은 OpenAI로 전송돼요.';
        el.classList.add('ok');
      }
    } else {
      if (AI.config.serverOk && AI.config.serverHasKey === false) {
        el.textContent = '서버는 연결됐지만 OPENAI_API_KEY가 없어요. 배포 환경변수에 키를 추가해 주세요. (지금은 데모로 동작)';
        el.classList.add('warn');
      } else if (AI.config.serverOk) {
        el.textContent = '배포 서버에 연결됐어요. API 키는 서버에만 있고 앱에는 노출되지 않아요.';
        el.classList.add('ok');
      } else {
        el.textContent = '서버를 찾지 못했어요. Vercel에 배포하거나 OpenAI API 키 모드를 사용해 주세요.';
        el.classList.add('warn');
      }
    }
  }

  /* ── 이벤트 바인딩 ─────────────────────────────── */
  function bindEvents() {
    qsa('[data-mode-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setMode(btn.getAttribute('data-mode-btn'));
      });
    });

    qsa('[data-tab-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setTab(btn.getAttribute('data-tab-btn'));
      });
    });

    qsa('[data-speed]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.speed = Number(btn.getAttribute('data-speed'));
        renderSpeed();
        playPhrase(state.speed);
      });
    });

    $('playBtn').addEventListener('click', function () { playPhrase(state.speed); });
    $('playSlowBtn').addEventListener('click', function () { playPhrase(0.8); });
    $('micBtn').addEventListener('click', onDrillMic);

    $('typeToggle').addEventListener('click', function () {
      showTypeInput();
    });

    $('typeForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('typeInput').value.trim();
      if (!v) {
        $('typeInput').focus();
        return;
      }
      $('typeInput').value = '';
      handleDrillResult(v);
    });

    $('prevBtn').addEventListener('click', function () {
      if (state.phraseIndex === 0) return;
      state.phraseIndex -= 1;
      stopAllAudio();
      renderPhrase();
    });

    $('nextBtn').addEventListener('click', function () {
      if (state.phraseIndex >= topic().phrases.length - 1) {
        toast(state.mode === 'kid' ? '이 이야기 문장은 다 했어! 다른 이야기도 골라 봐!' : '이 상황의 문장을 모두 연습했어요!');
        return;
      }
      state.phraseIndex += 1;
      stopAllAudio();
      renderPhrase();
    });

    $('settingsBtn').addEventListener('click', function () { openSheet('settingsSheet'); });

    $('chatBackBtn').addEventListener('click', function () { closeRoleplay(false); });
    $('chatResetBtn').addEventListener('click', function () {
      if (!state.rp.scenario) return;
      var id = state.rp.scenario.id;
      SPEECH.stopSpeaking();
      SPEECH.stopAudio();
      openScenario(id);
      toast('대화를 처음부터 다시 시작해요.');
    });

    $('hintBtn').addEventListener('click', openHints);
    $('composer').addEventListener('submit', function (e) {
      e.preventDefault();
      sendRoleplay($('chatInput').value);
    });
    $('chatMicBtn').addEventListener('click', function () {
      if (state.rp.recording) {
        state.rp.recording = false;
        finishChatRecording();
        return;
      }
      onChatMic();
    });

    qsa('[data-close-sheet]').forEach(function (el) {
      el.addEventListener('click', closeSheet);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSheet();
    });

    document.addEventListener('click', function (e) {
      var speakBtn = e.target.closest ? e.target.closest('[data-speak]') : null;
      if (speakBtn) {
        var id = Number(speakBtn.getAttribute('data-speak'));
        var text = speakStore[id];
        if (text) {
          SPEECH.stopSpeaking();
          speakText(text, { rate: 1 });
        }
        return;
      }
      var tryBtn = e.target.closest ? e.target.closest('[data-try]') : null;
      if (tryBtn) {
        var sentence = tryBtn.getAttribute('data-try');
        if (sentence) {
          SPEECH.stopSpeaking();
          speakText(sentence, { rate: 1 });
        }
        return;
      }
      var useBtn = e.target.closest ? e.target.closest('[data-use-hint]') : null;
      if (useBtn) {
        $('chatInput').value = useBtn.getAttribute('data-use-hint');
        closeSheet();
        $('chatInput').focus();
      }
    });

    document.addEventListener('pointerdown', function () {
      SPEECH.unlockAudio();
    }, { once: true });

    // 대화 중 바깥을 눌러도 시트 닫기
    qsa('.sheet-backdrop').forEach(function (b) {
      b.addEventListener('click', closeSheet);
    });
  }

  /* ── 시작 ──────────────────────────────────────── */
  function init() {
    loadProgress();
    AI.load();

    if (state.mode === 'kid') state.speed = DATA.kid.defaultSpeed;
    else state.speed = DATA.adult.defaultSpeed;

    updateModeUI();
    renderTopics();
    renderPhrase();
    renderScenarioGrid();
    bindEvents();
    initSettingsUI();
    setTab('drill');

    if (AI.config.mode === 'server') {
      AI.probeServer().then(function (ok) {
        updateAIStatus();
        updateBadge();
        $('composeNote').textContent = micHintText();
        if (!ok) toast('배포 서버를 찾지 못했어요. 데모 모드로 동작해요.', 3200);
      });
    }

    // PWA 서비스워커
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) &&
        !/[?&]nosw\b/.test(location.search)) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function () {});
      });
    }

    // 음성 인식 지원 여부 안내
    if (!SPEECH.recognitionAvailable() && !(AI.isLive() && SPEECH.recordingAvailable())) {
      $('composeNote').textContent = micHintText();
    }

    document.body.classList.add('is-ready');
  }

  // 디버그/검증용 핸들 (앱 동작에는 영향 없음)
  window.SpeakyApp = {
    state: state,
    setMode: setMode,
    setTab: setTab,
    openScenario: openScenario,
    handleDrillResult: handleDrillResult,
    sendRoleplay: sendRoleplay,
    playPhrase: playPhrase,
    errors: window.__speakyErrors
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
