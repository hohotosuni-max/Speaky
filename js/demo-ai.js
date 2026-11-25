/* ============================================================
   Speaky — 데모 AI (API 키 없이 동작하는 상황 엔진)
   아이 모드(9세 바이링구어)는 한 단어 답에도 꼬리 질문으로
   대화를 이어 가고, 짧은 답은 한 문장으로 늘려 주도록 안내합니다.
   ============================================================ */
(function () {
  'use strict';

  /* 아이 모드 튜터가 자연스럽게 던지는 꼬리 질문 */
  var KID_PROBES = [
    'Can you say a bit more about that?',
    'Really? How come?',
    'Why do you think so?',
    'What made you choose that?',
    'Could you give me an example?'
  ];

  var BARE_ANSWER = /^\s*(yes|no|yeah|yep|nope|ok|okay|sure|maybe|fine|right)\b[\s.!]*$/i;

  function norm(text) {
    return String(text || '').toLowerCase();
  }

  function wordCount(text) {
    return String(text || '').trim().split(/\s+/).filter(Boolean).length;
  }

  function matchesBranch(branch, text) {
    if (!branch || !branch.any) return false;
    var t = norm(text);
    return branch.any.some(function (kw) { return t.indexOf(norm(kw)) >= 0; });
  }

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function opening(scenario) {
    return {
      reply: scenario.opening.en,
      replyKo: scenario.opening.ko,
      hints: (scenario.steps[0] && scenario.steps[0].hints) || [],
      correction: null
    };
  }

  /* 이유·연결어가 들어간 답인지 (바이링구어 아이 기준) */
  var REASONED = /\b(because|so|since|which|but|although|though|if|when|that's why|so that|even though)\b/i;

  /* 아이 모드: 너무 짧은 답이면 대화를 넘기지 않고 한 번 더 물어봅니다 */
  function probeForKid(text) {
    if (BARE_ANSWER.test(text)) return pick(KID_PROBES);
    if (wordCount(text) <= 2) return pick(KID_PROBES);
    return '';
  }

  /*
     아이 모드 교정:
     - 한 단어·두 단어 답 → 같은 뜻의 완전한 문장으로 늘려 줌
     - 이유까지 붙인 제대로 된 답 → "내 말"을 긋지 않고 칭찬 카드로 (좋은 예시 문장만 보여 줌)
     - 실제 오류(fix)는 그대로 교정
  */
  function kidCorrection(text, hints, baseCorrection) {
    var t = String(text).trim();
    var words = wordCount(t);

    if (baseCorrection.kind === 'retry') return baseCorrection;

    if (hints && hints.length && (BARE_ANSWER.test(t) || words <= 2)) {
      return {
        kind: 'upgrade',
        better: hints[0],
        note: '한 단어로도 통하지만, 이렇게 한 문장으로 말하면 친구가 더 잘 알아들어.',
        label: '한 문장으로'
      };
    }

    if (baseCorrection.kind === 'fix') return baseCorrection;

    if (baseCorrection.kind === 'upgrade' && REASONED.test(t) && words >= 6) {
      return {
        kind: 'perfect',
        better: baseCorrection.better,
        note: '이유까지 붙여서 아주 자연스러워! 이 표현도 같이 기억해 두자.',
        label: '좋아요'
      };
    }

    return baseCorrection;
  }

  /**
   * @param {object} p {scenario, mode, turnIndex, text}
   */
  function reply(p) {
    var scenario = p.scenario;
    var mode = p.mode;
    var kid = mode === 'kid';
    var turnIndex = p.turnIndex || 0;
    var text = p.text || '';
    var steps = scenario.steps || [];

    var step = steps[turnIndex] || null;
    var coach = step && step.coach;
    var hintsForUser = step && step.hints;

    var correction = window.SpeakyText.correct(text, coach, mode, hintsForUser);
    if (kid) correction = kidCorrection(String(text).trim(), hintsForUser, correction);
    if (!step) {
      return {
        reply: scenario.closing ? scenario.closing.en : 'Thanks for chatting! See you next time!',
        replyKo: scenario.closing ? scenario.closing.ko : '이야기해 줘서 고마워요! 다음에 또 봐요!',
        hints: [],
        correction: correction,
        done: true
      };
    }

    var say = step.say;
    if (step.branches) {
      for (var i = 0; i < step.branches.length; i++) {
        if (matchesBranch(step.branches[i], text)) {
          say = step.branches[i].say;
          break;
        }
      }
    }

    var nextStep = steps[turnIndex + 1] || null;
    var last = !nextStep;

    var replyText = say.en;
    if (kid && !last) {
      var probe = probeForKid(String(text).trim());
      if (probe) replyText = replyText + ' ' + probe;
    }

    // 마지막 단계에서는 상황의 맺음말까지 이어서 대화를 자연스럽게 닫아 줍니다.
    var replyKoText = say.ko;
    if (last && scenario.closing) {
      replyText = replyText + ' ' + scenario.closing.en;
      replyKoText = replyKoText + ' ' + scenario.closing.ko;
    }

    return {
      reply: replyText,
      replyKo: replyKoText,
      hints: nextStep ? nextStep.hints : [],
      correction: correction,
      done: last,
      isLast: last
    };
  }

  /* 실제 AI처럼 보이도록 생각하는 시간 (아이 모드는 또래 친구처럼 조금 더 빠르게) */
  function thinkingDelay(mode) {
    var base = mode === 'kid' ? 420 : 700;
    return base + Math.random() * 420;
  }

  window.SpeakyDemoAI = {
    opening: opening,
    reply: reply,
    thinkingDelay: thinkingDelay
  };
})();
