/* ============================================================
   Speaky — 발화 비교 · 교정 엔진
   - 따라 말하기: 단어 정렬(LCS) 기반 채점/하이라이트
   - 롤플레이: 규칙 기반 문장 교정 + 자연스러운 표현 제안
   ============================================================ */
(function () {
  'use strict';

  var CONTRACTIONS = {
    "i'm": 'i am', "i'd": 'i would', "i'll": 'i will', "i've": 'i have',
    "you're": 'you are', "you'd": 'you would', "you'll": 'you will', "you've": 'you have',
    "he's": 'he is', "she's": 'she is', "it's": 'it is', "that's": 'that is',
    "we're": 'we are', "we'd": 'we would', "we'll": 'we will', "we've": 'we have',
    "they're": 'they are', "they'd": 'they would', "they'll": 'they will', "they've": 'they have',
    "don't": 'do not', "doesn't": 'does not', "didn't": 'did not',
    "can't": 'can not', "cannot": 'can not', "couldn't": 'could not', "won't": 'will not',
    "isn't": 'is not', "aren't": 'are not', "wasn't": 'was not', "weren't": 'were not',
    "haven't": 'have not', "hasn't": 'has not', "hadn't": 'had not',
    "wouldn't": 'would not', "shouldn't": 'should not', "mustn't": 'must not',
    "let's": 'let us', "what's": 'what is', "where's": 'where is', "who's": 'who is',
    "how's": 'how is', "there's": 'there is', "here's": 'here is', "when's": 'when is',
    "wanna": 'want to', "gonna": 'going to', "gotta": 'have to'
  };

  var NUMBER_WORDS = {
    '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five',
    '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine', '10': 'ten',
    '11': 'eleven', '12': 'twelve'
  };

  function cleanText(text) {
    return String(text == null ? '' : text)
      .replace(/[\u2018\u2019\u02BC]/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* 원문 토큰 + 비교용 정규화 토큰 + 매핑 */
  function tokenize(text) {
    var src = cleanText(text);
    var raw = src.length ? src.split(' ') : [];
    var canon = [];       // 비교용 토큰
    var mapToRaw = [];    // canon index -> raw index

    raw.forEach(function (word, rawIdx) {
      var w = word.toLowerCase()
        .replace(/[^a-z0-9'’\-]/g, '')
        .replace(/^-+|-+$/g, '');
      if (!w) return;
      var expanded = CONTRACTIONS[w] || w;
      expanded.split(' ').forEach(function (piece) {
        var p = piece.replace(/[^a-z0-9]/g, '');
        if (!p) return;
        p = NUMBER_WORDS[p] || p;
        canon.push(p);
        mapToRaw.push(rawIdx);
      });
    });

    return { raw: raw, canon: canon, map: mapToRaw };
  }

  function levenshtein(a, b) {
    if (a === b) return 0;
    var m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    var prev = new Array(n + 1), cur = new Array(n + 1), i, j;
    for (j = 0; j <= n; j++) prev[j] = j;
    for (i = 1; i <= m; i++) {
      cur[0] = i;
      for (j = 1; j <= n; j++) {
        var cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      }
      var t = prev; prev = cur; cur = t;
    }
    return prev[n];
  }

  function similar(a, b) {
    if (a === b) return 2;
    var maxLen = Math.max(a.length, b.length);
    if (maxLen < 3) return 0;
    var d = levenshtein(a, b);
    if (maxLen >= 7 && d <= 2) return 1;
    if (maxLen >= 4 && d <= 1) return 1;
    return 0;
  }

  /* 단어 단위 정렬: 반환 { pairs:[[ti,si]...], tStatus:[], sStatus:[] } */
  function align(tCanon, sCanon) {
    var n = tCanon.length, m = sCanon.length;
    var dp = [];
    var i, j;
    for (i = 0; i <= n; i++) {
      dp.push(new Array(m + 1).fill(0));
    }
    for (i = 1; i <= n; i++) {
      for (j = 1; j <= m; j++) {
        if (tCanon[i - 1] === sCanon[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }
    var pairs = [];
    i = n; j = m;
    while (i > 0 && j > 0) {
      if (tCanon[i - 1] === sCanon[j - 1]) {
        pairs.push([i - 1, j - 1]);
        i--; j--;
      } else if (dp[i - 1][j] >= dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }
    pairs.reverse();

    var tStatus = new Array(n).fill('missed');
    var sStatus = new Array(m).fill('extra');
    pairs.forEach(function (p) {
      tStatus[p[0]] = 'matched';
      sStatus[p[1]] = 'matched';
    });

    // 흡사 발음(철자 근접) 매칭
    for (i = 0; i < n; i++) {
      if (tStatus[i] !== 'missed') continue;
      for (j = 0; j < m; j++) {
        if (sStatus[j] !== 'extra') continue;
        var score = similar(tCanon[i], sCanon[j]);
        if (score) {
          tStatus[i] = 'near';
          sStatus[j] = 'near';
          pairs.push([i, j]);
          break;
        }
      }
    }

    return { pairs: pairs, tStatus: tStatus, sStatus: sStatus };
  }

  /**
   * 목표 문장과 인식 문장 비교
   * @returns {{score:number, target:Array, spoken:Array, matched:number, near:number, missed:number, extra:number, band:string}}
   */
  function compare(targetText, spokenText) {
    var T = tokenize(targetText);
    var S = tokenize(spokenText);

    var result = {
      score: 0,
      target: [],
      spoken: [],
      matched: 0,
      near: 0,
      missed: T.canon.length,
      extra: S.canon.length,
      band: 'low',
      empty: !S.canon.length
    };

    if (!S.canon.length) {
      T.raw.forEach(function (w) {
        result.target.push({ text: w, status: 'missed' });
      });
      return result;
    }

    var al = align(T.canon, S.canon);

    // 원문 토큰 상태 계산
    var tRawStatus = T.raw.map(function () { return 'missed'; });
    var sRawStatus = S.raw.map(function () { return 'extra'; });

    al.tStatus.forEach(function (st, ci) {
      var ri = T.map[ci];
      if (st === 'matched' && tRawStatus[ri] !== 'matched') tRawStatus[ri] = 'matched';
      else if (st === 'near' && tRawStatus[ri] !== 'matched') tRawStatus[ri] = 'near';
    });
    al.sStatus.forEach(function (st, ci) {
      var ri = S.map[ci];
      if (st === 'matched') sRawStatus[ri] = 'matched';
      else if (st === 'near' && sRawStatus[ri] !== 'matched') sRawStatus[ri] = 'near';
    });

    result.target = T.raw.map(function (w, i) {
      return { text: w, status: tRawStatus[i] };
    });
    result.spoken = S.raw.map(function (w, i) {
      return { text: w, status: sRawStatus[i] };
    });

    result.matched = al.tStatus.filter(function (s) { return s === 'matched'; }).length;
    result.near = al.tStatus.filter(function (s) { return s === 'near'; }).length;
    result.missed = al.tStatus.filter(function (s) { return s === 'missed'; }).length;
    result.extra = al.sStatus.filter(function (s) { return s === 'extra'; }).length;

    var targetLen = Math.max(1, T.canon.length);
    var raw = (result.matched + result.near * 0.55) / targetLen * 100;
    raw -= Math.min(18, result.extra * 3);
    var score = Math.round(Math.max(0, Math.min(100, raw)));
    result.score = score;
    result.band = score >= 90 ? 'perfect' : score >= 72 ? 'great' : score >= 45 ? 'ok' : 'low';
    return result;
  }

  /* ── 문장 교정 규칙 ───────────────────────────────── */
  var RULES = [
    { re: /\bi\b/g, to: 'I', note: "'i'는 항상 대문자 'I'로 써요.", label: '대문자 I' },
    { re: /\bi\s+am\b/gi, to: "I'm", note: "회화에서는 'I am'을 'I'm'으로 줄여 말해요.", label: '축약', basic: true },
    { re: /\bi\s+would\s+like\b/gi, to: "I'd like", note: "'I would like'는 'I'd like'로 줄여요.", label: '축약', basic: true },
    { re: /\bdo\s+not\b/gi, to: "don't", note: "'do not'은 회화에서 'don't'로 줄여요.", label: '축약', basic: true },
    { re: /\bcan\s*not\b/gi, to: "can't", note: "'cannot'은 'can't'로 줄여요.", label: '축약', basic: true },
    { re: /\bi\s+want\b(?!\s+to\b)/gi, to: "I'd like", note: "주문·부탁에는 'I want'보다 'I'd like'가 훨씬 공손해요.", label: '공손한 표현', basic: true },
    { re: /\bgive\s+me\b/gi, to: 'Could I have', note: "'Give me'는 명령처럼 들려요. 'Could I have ~?'가 부드러워요.", label: '공손한 표현' },
    { re: /\bwanna\b/gi, to: 'want to', note: "'wanna'는 발음 나는 대로 쓴 말이에요. 글로는 'want to'로 써요.", label: '정확한 철자', basic: true },
    { re: /\bgonna\b/gi, to: 'going to', note: "'gonna' 대신 'going to'를 써요.", label: '정확한 철자', basic: true },
    { re: /\bgotta\b/gi, to: 'have to', note: "'gotta' 대신 'have to'를 써요.", label: '정확한 철자', basic: true },
    { re: /\ba\s+([aeiouAEIOU]\w*)/g, to: 'an $1', note: "모음 소리 앞에는 'a' 대신 'an'을 써요.", label: '관사', basic: true },
    { re: /\b(he|she|it)\s+go\b/gi, to: '$1 goes', note: '3인칭 단수 주어 뒤 동사에는 -s를 붙여요.', label: '동사 형태' },
    { re: /\b(two|three|four|five|six|seven|eight|nine|ten)\s+(coffee|tea|water|ticket|bag|scoop|piece|book)\b/gi, to: '$1 $2s', note: '숫자 뒤 명사는 복수형으로 써요.', label: '복수형', basic: true },
    { re: /\bi\s+very\s+like\b/gi, to: 'I really like', note: "'very like'가 아니라 'really like'라고 해요.", label: '부사' },
    { re: /\bi'?m\s+boring\b/gi, to: "I'm bored", note: "'boring'은 지루하게 만드는 것, 내가 지루하면 'bored'예요.", label: '형용사' },
    { re: /\bi'?m\s+agree\b/gi, to: 'I agree', note: "'agree'는 동사라서 'I agree'라고 해요.", label: '동사' },
    { re: /\bopen\s+the\s+light\b/gi, to: 'turn on the light', note: '불을 켜는 건 "turn on the light"예요.', label: '콩글리시' },
    { re: /\bclose\s+the\s+light\b/gi, to: 'turn off the light', note: '불을 끄는 건 "turn off the light"예요.', label: '콩글리시' },
    { re: /\bhow\s+do\s+you\s+think\b/gi, to: 'what do you think', note: '의견을 물을 때는 "What do you think?"예요.', label: '의문문' },
    { re: /\bby\s+walk\b/gi, to: 'on foot', note: "'걸어서'는 'on foot'이에요.", label: '표현' },
    { re: /\bdiscuss\s+about\b/gi, to: 'discuss', note: "'discuss' 뒤에는 about을 쓰지 않아요.", label: '전치사' },
    { re: /\bmore\s+better\b/gi, to: 'better', note: "'better'는 이미 비교급이라 more를 붙이지 않아요.", label: '비교급' },
    { re: /\bhave\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+years?\s+old\b/gi, to: "am $1 years old", note: '나이는 "I am ~ years old"로 말해요.', label: '나이 표현' },
    { re: /\bmany\s+money\b/gi, to: 'much money', note: 'money는 셀 수 없어서 "much money"라고 해요.', label: '수량 표현' }
  ];

  var QUESTION_START = /^(can|could|do|does|did|is|are|was|were|what|where|when|who|why|how|would|will|may|should|have|has|am)\b/i;

  function capitalizeFirst(s) {
    return s.replace(/^([a-z])/, function (m) { return m.toUpperCase(); });
  }

  function finishSentence(s) {
    var t = s.trim();
    if (!t) return t;
    t = capitalizeFirst(t);
    if (!/[.!?]$/.test(t)) {
      t += QUESTION_START.test(t) ? '?' : '.';
    }
    return t;
  }

  /**
   * 롤플레이용 교정
   * @param {string} text 사용자 발화
   * @param {object} coach {better, note}
   * @param {string} mode adult|kid
   * @param {string[]} hints 이번 턴 추천 표현
   */
  function correct(text, coach, mode, hints) {
    var clean = cleanText(text);
    var kid = mode === 'kid';

    // 한글 입력 → 영어로 유도
    if (/[가-힣]/.test(clean)) {
      return {
        kind: 'retry',
        better: (hints && hints[0]) || "Let's try in English!",
        note: kid ? '영어로 말해 볼까? 힌트를 보면 바로 말할 수 있어.' : '영어로 말해볼까요? 힌트를 눌러 문장을 확인해 보세요.',
        label: '영어로 말하기'
      };
    }

    if (!clean) {
      return {
        kind: 'perfect',
        better: (hints && hints[0]) || '',
        note: kid ? '한 문장만 더 말해 볼까?' : '한마디만 더 해볼까요?',
        label: '다시 말하기'
      };
    }

    var working = clean.replace(/\s+/g, ' ');
    working = working.replace(/\bi\b/g, 'I');
    var fixes = [];
    var seen = {};

    RULES.forEach(function (rule) {
      // 아이 모드(바이링구어)는 이미 아는 기초 규칙(축약·철자·관사·복수형)으로
      // 가르치지 않고, 뜻과 논리를 다듬는 교정에 집중합니다.
      if (kid && rule.basic) return;
      var before = working;
      working = working.replace(rule.re, rule.to);
      if (before !== working && !seen[rule.label]) {
        seen[rule.label] = true;
        fixes.push({ label: rule.label, note: rule.note });
      }
    });

    // 중복 please 정리
    working = working.replace(/\bplease\b([\s,]+)please\b/gi, 'please');
    working = working.replace(/\s+,/g, ',');

    // 요청인데 please가 없으면 추가 (성인 모드)
    var isRequest = /^(can|could|would|will|may|i'?d like|i want|give me|where|what time|how much)\b/i.test(working);
    var hasPlease = /\bplease\b/i.test(working);
    if (!kid && isRequest && !hasPlease && working.split(' ').length >= 2 && !/\?$/.test(working)) {
      working = working.replace(/[.!]*$/, '') + ', please';
      if (!seen['공손한 표현']) {
        seen['공손한 표현'] = true;
        fixes.push({ label: '공손한 표현', note: "부탁에는 'please'를 붙이면 훨씬 부드러워요." });
      }
    }

    var better = finishSentence(working);

    if (fixes.length) {
      var note = fixes.slice(0, 2).map(function (f) { return f.note; }).join(' ');
      return { kind: 'fix', better: better, note: note, label: fixes[0].label, fixes: fixes.slice(0, 3) };
    }

    if (coach && coach.better && coach.better.toLowerCase().replace(/[^a-z ]/g, '') !==
        clean.toLowerCase().replace(/[^a-z ]/g, '')) {
      return {
        kind: 'upgrade',
        better: coach.better,
        note: coach.note || (kid ? '이렇게 말하면 훨씬 세련돼 보여.' : '이렇게 말하면 더 자연스러워요.'),
        label: '더 자연스럽게'
      };
    }

    return {
      kind: 'perfect',
      better: better,
      note: kid ? '완벽해! 원어민처럼 자연스러워. 이제 이유도 한 문장 더 붙여 볼까? 🌟' : '완벽해요. 그대로 써도 자연스러운 문장이에요.',
      label: '좋아요'
    };
  }

  window.SpeakyText = {
    compare: compare,
    correct: correct,
    clean: cleanText,
    tokenize: tokenize
  };
})();
