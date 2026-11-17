/* ==========================================================
   Feltone — 사이트 동작
   1) 첫 화면 데모 플레이어
   2) 제품 페이지 데모 목록
   3) 출시 소식 받기 양식
   ========================================================== */

(function () {
  'use strict';

  /* 한 번에 한 곡만 재생되도록 모든 재생을 이 하나로 관리해요. */
  var audio = new Audio();
  var stopCurrent = null;

  function stopAll() {
    audio.pause();
    if (stopCurrent) { stopCurrent(); stopCurrent = null; }
  }

  /* ---------- 1) 첫 화면 데모 플레이어 ----------
     index.html 의 .player 에 있는 data-src-original / data-src-converted 에
     음원 파일 경로를 넣으면 재생돼요. 예: audio/demo-original.mp3
     비어 있으면 '준비 중'으로 표시돼요. */
  document.querySelectorAll('.player').forEach(function (player) {
    var playBtn = player.querySelector('.play-btn');
    var caption = player.querySelector('.player__caption');
    var modeButtons = player.querySelectorAll('[data-mode-btn]');
    var sources = {
      original: player.getAttribute('data-src-original') || '',
      converted: player.getAttribute('data-src-converted') || ''
    };
    var captions = {
      original: player.getAttribute('data-caption-original') || '원본 가이드 보컬',
      converted: player.getAttribute('data-caption-converted') || '변환된 목소리'
    };

    function currentMode() { return player.getAttribute('data-mode') || 'converted'; }

    function refresh() {
      var mode = currentMode();
      var ready = !!sources[mode];
      playBtn.disabled = !ready;
      caption.textContent = ready ? captions[mode] : captions[mode] + ' · 데모 음원 준비 중';
      modeButtons.forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-mode-btn') === mode ? 'true' : 'false');
      });
    }

    function setPlaying(on) {
      player.classList.toggle('is-playing', on);
      playBtn.setAttribute('aria-label', on ? '일시정지' : '재생');
    }

    modeButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var wasPlaying = player.classList.contains('is-playing');
        var time = audio.currentTime;
        player.setAttribute('data-mode', btn.getAttribute('data-mode-btn'));
        refresh();
        if (wasPlaying && sources[currentMode()]) {
          audio.src = sources[currentMode()];
          audio.currentTime = time;
          audio.play().catch(function () { setPlaying(false); });
        } else if (wasPlaying) {
          stopAll();
        }
      });
    });

    playBtn.addEventListener('click', function () {
      if (player.classList.contains('is-playing')) { stopAll(); return; }
      var src = sources[currentMode()];
      if (!src) return;
      stopAll();
      audio.src = src;
      audio.play().then(function () {
        setPlaying(true);
        stopCurrent = function () { setPlaying(false); };
      }).catch(function () {
        setPlaying(false);
        caption.textContent = '음원을 불러오지 못했어요.';
      });
    });

    audio.addEventListener('ended', function () { setPlaying(false); });
    refresh();
  });

  /* ---------- 2) 제품 페이지 데모 목록 ----------
     product.html 의 각 .demo-btn 에 있는 data-src 에 음원 경로를 넣으면 재생돼요. */
  var demoButtons = document.querySelectorAll('.demo-btn');
  demoButtons.forEach(function (btn) {
    var src = btn.getAttribute('data-src') || '';
    var idleLabel = btn.textContent.trim();
    var playingLabel = btn.getAttribute('data-playing-label') || '재생 중';

    if (!src) {
      btn.disabled = true;
      btn.textContent = idleLabel + ' (준비 중)';
      return;
    }

    btn.addEventListener('click', function () {
      if (btn.getAttribute('aria-pressed') === 'true') { stopAll(); return; }
      stopAll();
      audio.src = src;
      audio.play().then(function () {
        btn.setAttribute('aria-pressed', 'true');
        btn.textContent = playingLabel;
        stopCurrent = function () {
          btn.setAttribute('aria-pressed', 'false');
          btn.textContent = idleLabel;
        };
      }).catch(function () {
        btn.textContent = '불러오기 실패';
      });
    });
  });
  audio.addEventListener('ended', function () {
    if (stopCurrent) { stopCurrent(); stopCurrent = null; }
  });

  /* ---------- 3) 출시 소식 받기 ----------
     뉴스레터 서비스를 정하면 form 의 data-endpoint 에 서비스가 알려주는 주소를 넣어요.
     (Formspree처럼 주소로 양식을 받는 서비스 기준)
     비어 있으면 신청을 받지 않고 '준비 중' 안내만 보여줘요.
     → 실제로 저장되지 않는데 '신청됐어요'라고 보여주면 안 되기 때문이에요. */
  document.querySelectorAll('.js-newsletter').forEach(function (form) {
    var endpoint = form.getAttribute('data-endpoint') || '';
    var emailInput = form.querySelector('input[type="email"]');
    var consentInput = form.querySelector('input[type="checkbox"]');
    var message = form.querySelector('.form-message');
    var submitBtn = form.querySelector('button[type="submit"]');
    var done = form.parentElement.querySelector('.newsletter__done');

    function show(text, kind) {
      message.textContent = text;
      message.className = 'form-message form-message--' + kind;
      message.hidden = !text;
    }

    [emailInput, consentInput].forEach(function (el) {
      el.addEventListener('input', function () { show('', 'error'); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = emailInput.value.trim();
      if (!email || !emailInput.checkValidity()) {
        show('이메일 주소를 확인해 주세요.', 'error');
        emailInput.focus();
        return;
      }
      if (!consentInput.checked) {
        show('이메일 수집·이용에 동의해 주세요.', 'error');
        consentInput.focus();
        return;
      }
      if (!endpoint) {
        show('소식 받기는 곧 열려요. 그동안은 아래 이메일로 연락 주세요.', 'info');
        return;
      }

      submitBtn.disabled = true;
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      }).then(function (res) {
        if (!res.ok) throw new Error('failed');
        form.hidden = true;
        if (done) done.hidden = false;
      }).catch(function () {
        show('신청을 보내지 못했어요. 잠시 뒤 다시 시도해 주세요.', 'error');
      }).then(function () {
        submitBtn.disabled = false;
      });
    });
  });
})();
