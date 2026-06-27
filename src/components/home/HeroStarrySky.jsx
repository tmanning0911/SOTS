import { useEffect, useRef } from "react";

/**
 * Rowayton July sky — upper-left hero, clear of headline copy.
 */
const FEATURED_STARS = {
  deneb: { x: 0.14, y: 0.14, magnitude: 1.25, accent: "gold" },
  vega: { x: 0.42, y: 0.2, magnitude: 0.03, accent: "bright" },
  altair: { x: 0.26, y: 0.32, magnitude: 0.77, accent: "bright" },
  sadr: { x: 0.2, y: 0.22, magnitude: 2.23, accent: "gold" },
  albireo: { x: 0.34, y: 0.28, magnitude: 3.05, accent: "soft" },
};

function starRadius(magnitude) {
  return Math.max(1.6, 3.2 - magnitude * 0.42);
}

function createRng(seed) {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function buildStarField(width, height) {
  const rng = createRng(4104);
  const count = Math.round((width * height) / 6200);
  const stars = [];

  for (let i = 0; i < count; i += 1) {
    const depth = rng();
    stars.push({
      x: rng() * width * 0.7,
      y: rng() * height * 0.56,
      radius: depth * 1.25 + 0.35,
      alpha: depth * 0.32 + 0.14,
      twinkleSpeed: rng() * 1.2 + 0.7,
      twinkleOffset: rng() * Math.PI * 2,
      twinkleAmount: rng() * 0.12 + 0.18,
    });
  }

  return stars;
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function twinkleFactor(now, speed, offset, amount = 0.16) {
  const primary = Math.sin(now * 0.00105 * speed + offset);
  const secondary = Math.sin(now * 0.00185 * speed + offset * 1.35);
  return 0.9 + primary * amount + secondary * amount * 0.45;
}

function drawFeaturedStar(ctx, star, reveal, x, y, twinkle = 1) {
  const radius = starRadius(star.magnitude) * reveal * (0.94 + twinkle * 0.06);
  const glow = star.accent === "bright" ? 0.22 : star.accent === "gold" ? 0.16 : 0.1;
  const core =
    star.accent === "bright"
      ? `rgba(255, 255, 255, ${0.88 * reveal * twinkle})`
      : star.accent === "gold"
        ? `rgba(249, 197, 52, ${0.72 * reveal * twinkle})`
        : `rgba(249, 197, 52, ${0.48 * reveal * twinkle})`;

  ctx.beginPath();
  ctx.arc(x, y, radius * 2.8, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 255, 255, ${glow * reveal * twinkle})`;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = core;
  ctx.fill();
}

export function HeroStarrySky() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let stars = [];
    let frameId = 0;
    let startTime = performance.now();
    let shootingStar = null;
    let nextShootingStarAt = performance.now() + 14000;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = buildStarField(width, height);
    };

    const drawFeaturedStars = (progress, now) => {
      Object.values(FEATURED_STARS).forEach((star, starIndex) => {
        const reveal = easeOutCubic(Math.min(1, progress * 1.1 - starIndex * 0.05));
        if (reveal <= 0) return;
        const twinkle = reducedMotion
          ? 1
          : twinkleFactor(now, 0.85 + starIndex * 0.12, starIndex * 1.7, 0.18);
        drawFeaturedStar(ctx, star, reveal, star.x * width, star.y * height, twinkle);
      });
    };

    const drawShootingStar = (star, elapsed) => {
      const headX = star.x + star.vx * elapsed;
      const headY = star.y + star.vy * elapsed;
      const tailX = headX - star.vx * 0.03 * 56;
      const tailY = headY - star.vy * 0.03 * 56;
      const fade = Math.max(0, 1 - elapsed / star.duration);

      const gradient = ctx.createLinearGradient(tailX, tailY, headX, headY);
      gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
      gradient.addColorStop(1, `rgba(255, 255, 255, ${0.55 * fade})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(headX, headY);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.1;
      ctx.stroke();
    };

    const render = (now) => {
      const starProgress = reducedMotion ? 1 : Math.min(1, (now - startTime) / 3200);

      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        const twinkle = reducedMotion
          ? 1
          : twinkleFactor(now, star.twinkleSpeed, star.twinkleOffset, star.twinkleAmount);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * (0.94 + twinkle * 0.06), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * twinkle})`;
        ctx.fill();
      });

      drawFeaturedStars(starProgress, now);

      if (!reducedMotion) {
        if (!shootingStar && now >= nextShootingStarAt) {
          shootingStar = {
            x: width * (0.1 + Math.random() * 0.28),
            y: height * (0.12 + Math.random() * 0.18),
            vx: 3.8 + Math.random() * 1.4,
            vy: 1.8 + Math.random() * 1,
            duration: 780,
            startedAt: now,
          };
        }

        if (shootingStar) {
          const starElapsed = now - shootingStar.startedAt;
          if (starElapsed <= shootingStar.duration) {
            drawShootingStar(shootingStar, starElapsed);
          } else {
            shootingStar = null;
            nextShootingStarAt = now + 12000 + Math.random() * 10000;
          }
        }
      }

      frameId = window.requestAnimationFrame(render);
    };

    resize();
    frameId = window.requestAnimationFrame(render);

    const observer = new ResizeObserver(resize);
    observer.observe(container);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="orpheum-hero__sky" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
