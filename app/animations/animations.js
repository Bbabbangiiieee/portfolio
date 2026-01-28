import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function startBadgeAnimations(badgeClass) {
  const badges = Array.from(document.querySelectorAll(`.${badgeClass}`));
  if (badges.length === 0) return () => { };

  const handlers = [];
  const tweens = [];

  badges.forEach((badge, index) => {
    const distances = [150, -95, 120];
    const durations = [3, 4.5, 3.5];
    const distance = distances[index % distances.length];
    const duration = durations[index % durations.length];

    const tween = gsap.to(badge, {
      x: distance,
      duration: duration,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const onEnter = () => tween.pause();
    const onLeave = () => tween.resume();

    badge.addEventListener("mouseenter", onEnter);
    badge.addEventListener("mouseleave", onLeave);

    handlers.push({ badge, onEnter, onLeave });
    tweens.push(tween);
  });

  return () => {
    handlers.forEach(({ badge, onEnter, onLeave }) => {
      badge.removeEventListener("mouseenter", onEnter);
      badge.removeEventListener("mouseleave", onLeave);
    });
    tweens.forEach((t) => t.kill());
  };
}

export function startDotAnimations(container, opts = {}) {
  if (!container) return () => { };
  const total = opts.total ?? 80;
  const R = (max) => Math.random() * max;

  const tweens = [];
  const elements = [];

  const Anim = (elm) => {
    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const t = gsap.to(elm, {
      left: R(w) + "px",
      top: R(h) + "px",
      opacity: Math.random() * 0.5 + 0.25,
      duration: R(14) + 12,
      ease: "none",
      onComplete: () => Anim(elm),
    });
    tweens.push(t);
  };

  for (let i = 0; i < total; i++) {
    const div = document.createElement("div");
    div.className = "dot";
    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    // ensure each dot is absolutely positioned within the container
    div.style.position = "absolute";
    gsap.set(div, {
      left: R(w) + "px",
      top: R(h) + "px",
      opacity: Math.random() * 0.5 + 0.25,
    });
    container.appendChild(div);
    elements.push(div);
    // staggered start
    const d = gsap.delayedCall(R(4), () => Anim(div));
    tweens.push(d);
  }

  return () => {
    tweens.forEach((t) => t.kill && t.kill());
    elements.forEach((el) => el.remove());
  };
}

export function startDividerAnimation(dividerInnerClass, triggerClass, opts = {}) {
  try {
    const { gsap } = require("gsap");
    const ScrollTrigger = require("gsap/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);

    const target = document.querySelector(`.${dividerInnerClass}`);
    if (!target) return () => { };

    const triggerEl = document.querySelector(`.${triggerClass}`) || target;

    const animation = gsap.fromTo(
      target,
      { scaleY: 0, transformOrigin: "top" },
      {
        scaleY: 1,
        duration: opts.duration ?? 1.5,
        ease: opts.ease ?? "power2.out",
        transformOrigin: "top",
        scrollTrigger: {
          trigger: triggerEl,
          start: opts.start ?? "top top",
          // play on enter, reverse on leave so it can play again when re-entering
          toggleActions: opts.toggleActions ?? "play reverse play reverse",
        },
      }
    );

    return () => {
      try {
        animation.kill();
        const all = ScrollTrigger.getAll ? ScrollTrigger.getAll() : [];
        all.forEach((t) => t.kill());
      } catch (e) { }
    };
  } catch (e) {
    return () => { };
  }
}

export function startToolsIconsAnimation(toolsItemClass, triggerClass, opts = {}) {
  try {
    const { gsap } = require("gsap");
    const ScrollTrigger = require("gsap/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);

    const items = document.querySelectorAll(`.${toolsItemClass}`);
    if (!items.length) return () => { };

    const triggerEl = document.querySelector(`.${triggerClass}`) || items[0];

    const animation = gsap.fromTo(
      items,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: opts.duration ?? 1,
        stagger: opts.stagger ?? 0.1,
        ease: opts.ease ?? "power2.out",
        scrollTrigger: {
          trigger: triggerEl,
          start: opts.start ?? "top center",
          toggleActions: opts.toggleActions ?? "play reverse play reverse",
        },
      }
    );

    return () => {
      try {
        animation.kill();
        const all = ScrollTrigger.getAll ? ScrollTrigger.getAll() : [];
        all.forEach((t) => t.kill());
      } catch (e) { }
    };
  } catch (e) {
    return () => { };
  }
}

export function startTimelineAnimation() {
  const cards = gsap.utils.toArray(".tl-card");
  const years = gsap.utils.toArray(".tl-year");
  const rightCol = document.querySelector(".tl-right");

  const timelineSection =
    document.querySelector(".tl-section") || // ✅ add this class in JSX
    document.querySelector("[class*='timeline']");

  const headerEl =
    document.querySelector(".tl-header") ||   // ✅ add this too
    document.querySelector("[class*='timelineHeader']");

  if (!cards.length || !years.length || !rightCol || !timelineSection) return () => {};

  let current = -1;
  let timelineActive = false;

  // ---------------- INIT YEARS ----------------
  gsap.set(years, { autoAlpha: 0, y: 20 });
  gsap.set(years[0], { autoAlpha: 1, y: 0 }); // year visible, dot not active yet
  gsap.set(years[0].querySelectorAll(".tl-digit"), { yPercent: 0 });

  // ---------------- CSS VARS FOR DOT ----------------
  const applyVars = () => {
    const headerH = headerEl ? headerEl.offsetHeight : 0;

    const rightRect = rightCol.getBoundingClientRect();
    const root = document.documentElement;

    const wrapper = document.querySelector(".tl-wrapper");
    const gapStr = wrapper ? getComputedStyle(wrapper).gap : "4rem";
    const rootFont = parseFloat(getComputedStyle(root).fontSize) || 16;
    const gapPx = gapStr.includes("rem")
      ? parseFloat(gapStr) * rootFont
      : parseFloat(gapStr) || 64;

    const halfGap = gapPx / 2;
    const radius = 7;

    const lineCenterX = rightRect.left - halfGap - radius;

    root.style.setProperty("--timelineStickyTop", `${headerH}px`);
    root.style.setProperty("--timelineLineX", `${lineCenterX}px`);
  };

  // ---------------- ACTIVATE ITEM ----------------
  const activate = (i) => {
    if (!timelineActive || i === current) return;
    current = i;

    cards.forEach((c, idx) => c.classList.toggle("is-active", idx === i));

    years.forEach((y, idx) => {
      if (idx !== i) {
        gsap.set(y, { autoAlpha: 0, y: 20 });
        gsap.set(y.querySelectorAll(".tl-digit"), { yPercent: 100 });
      }
    });

    const target = years[i];
    const digits = target.querySelectorAll(".tl-digit");

    gsap.set(target, { autoAlpha: 1 });
    gsap.to(target, { y: 0, duration: 0.25, ease: "power2.out" });
    gsap.to(digits, { yPercent: 0, duration: 0.25, ease: "power2.out", stagger: 0.02 });
  };

  const clearDots = () => {
    current = -1;
    cards.forEach((c) => c.classList.remove("is-active"));
  };

  const getHeaderH = () => (headerEl ? headerEl.offsetHeight : 0);

  applyVars();

  // ---------------- SECTION GATE ----------------
  const gate = ScrollTrigger.create({
    trigger: timelineSection,
    start: `top top-=60`,
    end: "bottom center",
    onEnter: () => {
      timelineActive = true;
      activate(0); // ✅ first dot activates ONLY now
    },
    onLeave: () => {
      timelineActive = false;
      clearDots(); // ✅ remove fixed dot in other sections
    },
    onEnterBack: () => {
      timelineActive = true;
      activate(Math.max(current, 0));
    },
    onLeaveBack: () => {
      timelineActive = false;
      clearDots();
    },
  });

  // ---------------- CARD TRIGGERS ----------------
  const triggers = cards.map((card, i) =>
    ScrollTrigger.create({
      trigger: card,
      start: () => `top top+=${getHeaderH() + 50}`,
      end: () => `bottom top+=${getHeaderH() + 50}`,
      onEnter: () => activate(i),
      onEnterBack: () => activate(i),
      invalidateOnRefresh: true,
    })
  );

  ScrollTrigger.addEventListener("refreshInit", applyVars);
  window.addEventListener("resize", applyVars);
  ScrollTrigger.refresh();

  return () => {
    triggers.forEach((t) => t.kill());
    gate.kill();
    ScrollTrigger.removeEventListener("refreshInit", applyVars);
    window.removeEventListener("resize", applyVars);
  };
}