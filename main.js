const siteConfig = {
  brand: "Michał Chowaniec",
  lessonsUrl: "https://micchowaniec.github.io/ABoMatma/",
  websiteUrl: "https://micchowaniec.github.io/ABoStrona/",
  contactEmail: "micchowaniec@gmail.com",
  location: "Online",
};

const yearNodes = document.querySelectorAll("[data-year]");
const brandNodes = document.querySelectorAll("[data-brand]");
const emailLinks = document.querySelectorAll("[data-email-link]");
const locationNodes = document.querySelectorAll("[data-location]");
const lessonsLinks = document.querySelectorAll("[data-lessons-link]");
const websiteLinks = document.querySelectorAll("[data-website-link]");

for (const node of yearNodes) {
  node.textContent = String(new Date().getFullYear());
}

for (const node of brandNodes) {
  node.textContent = siteConfig.brand;
}

for (const node of emailLinks) {
  node.href = `mailto:${siteConfig.contactEmail}`;
}

for (const node of locationNodes) {
  node.textContent = siteConfig.location;
}

for (const node of lessonsLinks) {
  node.href = siteConfig.lessonsUrl;
  node.setAttribute("target", "_blank");
  node.setAttribute("rel", "noreferrer");
}

for (const node of websiteLinks) {
  node.href = siteConfig.websiteUrl;
  node.setAttribute("target", "_blank");
  node.setAttribute("rel", "noreferrer");
}

function initMatrixBackground() {
  if (document.querySelector(".matrix-bg")) {
    return;
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  canvas.className = "matrix-bg";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const glyphPool =
    "01ABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]<>/=+*%#@&$?^~|:;MATHCODEWEBAPIUXNLP";
  const fontSize = 16;
  const columnGap = 22;
  const rowGap = 22;
  const rotation = -Math.PI / 2;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let width = 0;
  let height = 0;
  let columns = [];
  let animationFrame = 0;
  let lastTime = 0;

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function randomInt(min, max) {
    return Math.floor(randomBetween(min, max + 1));
  }

  function pickGlyph() {
    return glyphPool[Math.floor(Math.random() * glyphPool.length)];
  }

  function makeColumn(index) {
    const trailLength = randomInt(18, 34);

    return {
      x: index * columnGap + randomBetween(-4, 4),
      y: randomBetween(-height, height),
      speed: randomBetween(22, 42),
      trailLength,
      opacity: randomBetween(0.56, 0.92),
      shimmerPhase: randomBetween(0, Math.PI * 2),
      shimmerSpeed: randomBetween(0.38, 0.82),
      glyphs: Array.from({ length: trailLength }, pickGlyph),
      swapTimers: Array.from({ length: trailLength }, () => randomBetween(80, 1800)),
      resetAt: height + randomBetween(height * 0.12, height * 0.65),
    };
  }

  function setupCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `700 ${fontSize}px "Courier New", monospace`;

    const columnCount = Math.ceil(width / columnGap) + 2;
    columns = Array.from({ length: columnCount }, (_, index) => makeColumn(index));
  }

  function drawGlyph(glyph, x, y, brightness, glow, isHead) {
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.shadowBlur = glow;
    context.shadowColor = isHead
      ? `rgba(180, 255, 210, ${Math.min(brightness + 0.12, 1)})`
      : `rgba(64, 255, 138, ${Math.min(brightness, 0.85)})`;
    context.fillStyle = isHead
      ? `rgba(226, 255, 236, ${Math.min(brightness + 0.2, 1)})`
      : `rgba(74, 255, 144, ${brightness})`;
    context.fillText(glyph, 0, 0);
    context.restore();
  }

  function resetColumn(column) {
    column.y = randomBetween(-height * 0.75, -rowGap * column.trailLength);
    column.speed = randomBetween(22, 42);
    column.opacity = randomBetween(0.56, 0.92);
    column.shimmerPhase = randomBetween(0, Math.PI * 2);
    column.shimmerSpeed = randomBetween(0.38, 0.82);
    column.resetAt = height + randomBetween(height * 0.12, height * 0.65);

    for (let index = 0; index < column.trailLength; index += 1) {
      column.glyphs[index] = pickGlyph();
      column.swapTimers[index] = randomBetween(80, 1800);
    }
  }

  function drawFrame(timestamp) {
    if (!lastTime) {
      lastTime = timestamp;
    }

    const deltaTime = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;

    context.fillStyle = "rgba(2, 10, 6, 0.11)";
    context.fillRect(0, 0, width, height);

    for (const column of columns) {
      column.y += column.speed * deltaTime;
      column.shimmerPhase += deltaTime * column.shimmerSpeed;

      for (let index = 0; index < column.trailLength; index += 1) {
        column.swapTimers[index] -= deltaTime * 1000;

        if (column.swapTimers[index] <= 0) {
          column.glyphs[index] = pickGlyph();
          column.swapTimers[index] = randomBetween(90, 2200);
        }

        const y = column.y - index * rowGap;

        if (y < -rowGap || y > height + rowGap) {
          continue;
        }

        const trailRatio = 1 - index / column.trailLength;
        const pulse =
          0.72 +
          0.18 * Math.sin(timestamp * 0.0012 + column.shimmerPhase + index * 0.34) +
          0.12 * Math.cos(timestamp * 0.0008 + column.x * 0.025 - index * 0.19);
        const flash = column.swapTimers[index] < 140 ? 0.14 : 0;
        const brightness = Math.max(
          0.08,
          Math.min(0.98, column.opacity * trailRatio * 0.82 + pulse * 0.16 + flash),
        );
        const glow = 10 + trailRatio * 18 + flash * 60;
        const isHead = index === 0;

        if (isHead && Math.random() < 0.28) {
          column.glyphs[index] = pickGlyph();
        }

        drawGlyph(column.glyphs[index], column.x, y, brightness, glow, isHead);
      }

      if (column.y - column.trailLength * rowGap > column.resetAt) {
        resetColumn(column);
      }
    }

    animationFrame = window.requestAnimationFrame(drawFrame);
  }

  function drawStaticFrame() {
    context.clearRect(0, 0, width, height);
    context.fillStyle = "rgba(2, 10, 6, 0.08)";
    context.fillRect(0, 0, width, height);

    for (const column of columns) {
      const visibleLength = Math.min(column.trailLength, randomInt(10, 18));

      for (let index = 0; index < visibleLength; index += 1) {
        const y = height * 0.15 + index * rowGap + (column.x % 36);

        if (y > height) {
          break;
        }

        const trailRatio = 1 - index / visibleLength;
        drawGlyph(
          pickGlyph(),
          column.x,
          y,
          0.14 + trailRatio * 0.24,
          8 + trailRatio * 10,
          index === 0,
        );
      }
    }
  }

  function start() {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    lastTime = 0;
    setupCanvas();

    if (reducedMotion.matches) {
      drawStaticFrame();
      return;
    }

    animationFrame = window.requestAnimationFrame(drawFrame);
  }

  let resizeTimeout = 0;

  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(start, 120);
  });

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", start);
  }

  start();
}

initMatrixBackground();
