/**
 * Cinematic Intro Landing Experience
 * Recreates the viral "Developer Flex" intro sequence:
 * 1. Centered glowing spotlight with white exclamation mark (!)
 * 2. Dynamic tilt & sweep revealing "DIVYANSH" in 3D metallic typography
 * 3. Cybernetic letter-by-letter glyph scramble: DIVYANSH -> PORTFOLIO
 * 4. Starfield celestial particle canvas fades in with "AI ENGINEER" subtitle
 * 5. Smooth curtain dissolve revealing the main portfolio
 */

export function initCinematicIntro() {
  const container = document.getElementById('cinematic-intro');
  if (!container) return;

  // Accessibility: if reduced motion requested, skip immediately
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    container.style.display = 'none';
    return;
  }

  // Prevent scroll during intro playback
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  const canvas = document.getElementById('intro-starfield-canvas');
  const exclamationWrap = document.getElementById('intro-exclamation-wrap');
  const exclamationStem = document.getElementById('intro-exclamation-stem');
  const exclamationDot = document.getElementById('intro-exclamation-dot');
  const textStage = document.getElementById('intro-text-stage');
  const mainWord = document.getElementById('intro-main-word');
  const subtitle = document.getElementById('intro-subtitle');
  const skipBtn = document.getElementById('intro-skip-btn');

  let isExited = false;
  let animFrameId = null;

  // --------------------------------------------------------------------------
  // 1. Celestial Starfield Particle Canvas (60fps Lightweight 2D Canvas)
  // --------------------------------------------------------------------------
  let stars = [];
  let starOpacity = 0;
  let targetStarOpacity = 0;

  function initStarfield() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createStars();
    }

    function createStars() {
      stars = [];
      const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 9000), 160);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.4 + 0.4,
          baseAlpha: Math.random() * 0.7 + 0.3,
          speed: Math.random() * 0.25 + 0.08,
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: Math.random() * 0.025 + 0.015,
          color: Math.random() > 0.4 ? '#ffffff' : (Math.random() > 0.5 ? '#cbd5e1' : '#93c5fd')
        });
      }
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    function renderStars() {
      if (isExited) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth opacity ramp
      starOpacity += (targetStarOpacity - starOpacity) * 0.05;

      if (starOpacity > 0.005) {
        ctx.save();
        ctx.globalAlpha = starOpacity;

        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          s.phase += s.phaseSpeed;
          s.y -= s.speed;
          if (s.y < -5) s.y = canvas.height + 5;

          const currentAlpha = Math.max(0.1, s.baseAlpha + Math.sin(s.phase) * 0.3);
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.globalAlpha = starOpacity * currentAlpha;
          ctx.fill();
        }
        ctx.restore();
      }

      animFrameId = requestAnimationFrame(renderStars);
    }

    renderStars();
  }

  // --------------------------------------------------------------------------
  // 2. Smooth Exit to Main Portfolio
  // --------------------------------------------------------------------------
  function dismissIntro() {
    if (isExited) return;
    isExited = true;

    // Restore page scrolling
    document.body.style.overflow = previousOverflow || '';

    // Smooth exit transition
    container.style.transition = 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)';
    container.style.opacity = '0';
    container.style.transform = 'scale(1.05)';
    container.style.pointerEvents = 'none';

    setTimeout(() => {
      container.style.display = 'none';
      if (animFrameId) cancelAnimationFrame(animFrameId);
    }, 900);
  }

  // Bind early skip triggers (Button, Click Anywhere, Escape/Space key)
  if (skipBtn) skipBtn.addEventListener('click', (e) => { e.stopPropagation(); dismissIntro(); });
  container.addEventListener('click', dismissIntro);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === ' ') {
      dismissIntro();
    }
  });

  // --------------------------------------------------------------------------
  // 3. Glyphic Text Scramble / Morph Utility (DIVYANSH -> PORTFOLIO)
  // --------------------------------------------------------------------------
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#*';

  function scrambleMorph(element, startWord, targetWord, durationMs, onComplete) {
    const startTime = performance.now();
    const maxLength = Math.max(startWord.length, targetWord.length);

    function update(now) {
      if (isExited) return;
      const progress = Math.min((now - startTime) / durationMs, 1);
      
      // Determine how many characters are locked in
      const lockedCount = Math.floor(progress * (targetWord.length + 1));
      let output = '';

      for (let i = 0; i < targetWord.length; i++) {
        if (i < lockedCount) {
          output += targetWord[i];
        } else if (progress > 0.05 && progress < 0.95) {
          output += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        } else {
          output += (i < startWord.length ? startWord[i] : targetWord[i]);
        }
      }

      element.textContent = output;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = targetWord;
        if (onComplete) onComplete();
      }
    }

    requestAnimationFrame(update);
  }

  // --------------------------------------------------------------------------
  // 4. Choreographed Timeline Sequence
  // --------------------------------------------------------------------------
  initStarfield();

  // Phase 1 (0ms): Exclamation Mark fades in at center
  setTimeout(() => {
    if (isExited) return;
    if (exclamationWrap) {
      exclamationWrap.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      exclamationWrap.style.opacity = '1';
      exclamationWrap.style.transform = 'scale(1)';
    }
  }, 200);

  // Phase 2 (1200ms): Exclamation mark tilts dynamically like a flashlight beam
  setTimeout(() => {
    if (isExited) return;
    if (exclamationStem) {
      // Tilt the stem around the dot (pivot)
      exclamationStem.style.transition = 'transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)';
      exclamationStem.style.transformOrigin = 'center 110%';
      exclamationStem.style.transform = 'rotate(38deg) scaleY(1.05)';
    }
    if (exclamationWrap) {
      exclamationWrap.style.transition = 'transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)';
      exclamationWrap.style.transform = 'translateX(-12px) scale(0.96)';
    }
  }, 1200);

  // Phase 3 (1850ms): Sweep and Reveal "DIVYANSH"
  setTimeout(() => {
    if (isExited) return;

    // Fade out exclamation mark cleanly
    if (exclamationWrap) {
      exclamationWrap.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      exclamationWrap.style.opacity = '0';
      exclamationWrap.style.transform = 'scale(0.8) rotate(45deg)';
    }

    // Reveal DIVYANSH
    if (textStage && mainWord) {
      mainWord.textContent = 'DIVYANSH';
      textStage.style.transition = 'opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
      textStage.style.opacity = '1';
      textStage.style.transform = 'scale(1)';
    }
  }, 1900);

  // Phase 4 (3200ms): Scramble & Morph from DIVYANSH to PORTFOLIO
  setTimeout(() => {
    if (isExited) return;

    // Trigger subtle sheen ripple
    if (mainWord) {
      mainWord.classList.add('cinematic-sheen');
    }

    scrambleMorph(mainWord, 'DIVYANSH', 'PORTFOLIO', 1600, () => {
      // Phase 5: Once PORTFOLIO has locked in
      if (isExited) return;

      // Ignite celestial starfield in background
      targetStarOpacity = 0.95;

      // Reveal Subtitle "AI ENGINEER" with slide-up
      if (subtitle) {
        subtitle.style.opacity = '1';
        subtitle.style.transform = 'translateY(0)';
      }
    });
  }, 3200);

  // Phase 6 (6800ms): Auto-dismiss intro and reveal main portfolio
  setTimeout(() => {
    if (!isExited) {
      dismissIntro();
    }
  }, 7000);
}

// Auto-boot on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCinematicIntro);
} else {
  initCinematicIntro();
}

