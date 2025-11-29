// ============================================================
// Advance Credit Solution / AI Credit Platform
// SUPER UPGRADED SITE BRAIN
// - Mobile nav
// - Smooth scroll
// - Snapshot persistence (localStorage)
// - AI-style credit assistant with risk level
// - Typing / thinking effect
// - Sample question helper
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // ----------------------------------------------------------
  // 1. UTILITIES
  // ----------------------------------------------------------

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const scrollToElement = (el, block = "start") => {
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block, behavior: "smooth" });
  };

  const getNumber = (id) => {
    const el = document.getElementById(id);
    if (!el) return 0;
    const value = parseFloat(el.value);
    return Number.isFinite(value) ? value : 0;
  };

  const debounce = (fn, delay = 140) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  // ----------------------------------------------------------
  // 2. AUTO-YEAR IN FOOTER
  // ----------------------------------------------------------

  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }

  // ----------------------------------------------------------
  // 3. MOBILE NAV & SMOOTH SCROLL
  // ----------------------------------------------------------

  const navToggle = $(".nav-toggle");
  const mainNav = $(".main-nav");

  const closeNav = () => {
    if (!mainNav) return;
    mainNav.style.display = "";
  };

  const toggleNav = () => {
    if (!mainNav) return;
    const isOpen = mainNav.style.display === "flex";
    mainNav.style.display = isOpen ? "none" : "flex";
  };

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", toggleNav);

    mainNav.addEventListener("click", (event) => {
      const target = event.target;
      if (target.tagName === "A") {
        closeNav();
      }
    });
  }

  // Smooth scroll for in-page anchors
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#" || !href.startsWith("#")) return;

      const targetId = href.slice(1);
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      event.preventDefault();
      scrollToElement(targetEl, "start");
    });
  });

  // ----------------------------------------------------------
  // 4. SNAPSHOT PERSISTENCE (localStorage)
  // ----------------------------------------------------------

  const SNAPSHOT_KEY = "acs_snapshot_v2";

  const snapshotIds = [
    "snap-collections",
    "snap-chargeoffs",
    "snap-lates",
    "snap-repos",
    "snap-utilization",
    "snap-score",
  ];

  const loadSnapshot = () => {
    try {
      const raw = localStorage.getItem(SNAPSHOT_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      snapshotIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (Object.prototype.hasOwnProperty.call(data, id)) {
          el.value = data[id];
        }
      });
    } catch (e) {
      console.warn("Could not load snapshot:", e);
    }
  };

  const saveSnapshot = () => {
    const data = {};
    snapshotIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (el.value !== "") {
        data[id] = el.value;
      }
    });
    try {
      localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Could not save snapshot:", e);
    }
  };

  // Attach listeners
  snapshotIds.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", debounce(saveSnapshot, 200));
  });

  // Load snapshot once
  loadSnapshot();

  // ----------------------------------------------------------
  // 5. AI-STYLE CREDIT ASSISTANT
  // ----------------------------------------------------------

  const questionInput = document.getElementById("ask-ai-question");
  const askButton = document.getElementById("ask-ai-button");
  const answerBox = document.getElementById("ask-ai-answer");

  if (!questionInput || !askButton || !answerBox) {
    return; // no Ask AI UI, nothing to run
  }

  // Optional: add a sample question helper button
  // (If you want this visible, you can add a button in HTML and give it this ID)
  const sampleBtnId = "ask-ai-sample";
  let sampleButton = document.getElementById(sampleBtnId);
  if (!sampleButton) {
    // Create it automatically if it doesn't exist
    sampleButton = document.createElement("button");
    sampleButton.id = sampleBtnId;
    sampleButton.type = "button";
    sampleButton.className = "btn-outline ask-ai-button";
    sampleButton.style.marginLeft = "0.5rem";
    sampleButton.textContent = "Use a sample question";
    askButton.parentNode.insertBefore(sampleButton, askButton.nextSibling);
  }

  sampleButton.addEventListener("click", () => {
    questionInput.value =
      "I have 4 collections, 2 charge-offs, late payments, and my utilization is high. My score is around 540 and I want to buy a car in 12 months. What should I fix first?";
    questionInput.focus();
  });

  // Snapshot fields + highlight helper
  const snapshotElements = snapshotIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const pulseField = (el) => {
    if (!el) return;
    el.classList.add("snapshot-pulse");
    setTimeout(() => el.classList.remove("snapshot-pulse"), 600);
  };

  // Build a simple risk label based on score + utilization
  const computeRiskLevel = (score, utilization) => {
    if (score <= 0 && utilization <= 0) return null;

    const s = score || 0;
    const u = utilization || 0;

    if (s >= 700 && u < 30) return "Low risk / strong base. You’re in “protect and fine-tune” mode.";
    if (s >= 640 && u < 50)
      return "Moderate risk. Clean-up plus utilization work can put you into strong approval territory.";
    if (s >= 580 && u < 90)
      return "Higher risk, but very fixable. Focus on disputes, no new lates, and getting utilization under control.";
    return "High risk right now. This doesn’t mean impossible — it means your biggest wins will come from removing bad data and aggressively lowering utilization over time.";
  };

  // Core logic: build AI-style answer HTML
  function buildAnswer(rawQuestion) {
    const q = (rawQuestion || "").trim();
    const lower = q.toLowerCase();

    // Snapshot values
    const collections = getNumber("snap-collections");
    const chargeoffs = getNumber("snap-chargeoffs");
    const lates = getNumber("snap-lates");
    const repos = getNumber("snap-repos");
    const utilization = clamp(getNumber("snap-utilization"), 0, 300);
    const score = clamp(getNumber("snap-score"), 0, 999);

    const tips = [];

    // Snapshot summary
    const snapshotSummaryParts = [];
    if (collections > 0) snapshotSummaryParts.push(`${collections} collections`);
    if (chargeoffs > 0) snapshotSummaryParts.push(`${chargeoffs} charge-offs`);
    if (lates > 0) snapshotSummaryParts.push(`${lates} late(s) in last 24 months`);
    if (repos > 0) snapshotSummaryParts.push(`${repos} repo/judgment(s)`);
    if (utilization > 0) snapshotSummaryParts.push(`utilization around ${utilization}%`);
    if (score > 0) snapshotSummaryParts.push(`score around ${score}`);

    const snapshotSummary =
      snapshotSummaryParts.length > 0
        ? snapshotSummaryParts.join(" · ")
        : "You didn’t give many numbers, so we’ll keep this general.";

    tips.push(
      "Step 1: Breathe. Your credit is a situation, not your identity. We’re going to tackle this in a sequence that makes sense instead of trying to fix everything in one night."
    );

    // Collections
    if (collections > 0) {
      tips.push(
        `You mentioned about ${collections} collection account(s). Start by pulling all three credit reports and making a clean list with: creditor names, balances, account numbers, and dates.`
      );
      tips.push(
        "Circle anything that looks off — wrong balance, dates that don’t match, old addresses, duplicate listings. These are your first dispute targets under the Fair Credit Reporting Act."
      );
      tips.push(
        "Avoid getting dragged into emotional calls with collectors. Keep everything in writing so you control the pace and keep a paper trail."
      );
    }

    // Charge-offs
    if (chargeoffs > 0) {
      tips.push(
        `You also have around ${chargeoffs} charge-off(s). Treat each charge-off as a two-part question: (1) is the reporting accurate and verifiable, and (2) does it make sense to negotiate a written settlement or deletion?`
      );
      tips.push(
        "Fix wrong data first. Then, for any remaining charge-offs that are truly yours, consider written settlement offers that fit your budget — not whatever they throw at you first."
      );
    }

    // Lates
    if (lates > 0) {
      tips.push(
        `With roughly ${lates} late payment(s) in the last 24 months, your “recent behavior” is part of what’s dragging your score. Step one is: absolutely no new lates from this moment forward.`
      );
      tips.push(
        "Compare each late mark to your bank records. If a late doesn’t match your actual payment history, it becomes a dispute candidate. If it’s accurate, you might later ask for a goodwill adjustment after building a clean streak."
      );
    }

    // Repos / judgments
    if (repos > 0) {
      tips.push(
        `Repos/judgments listed: about ${repos}. Track down any court documents, contracts, or repo notices so you can line them up against what’s on your credit reports.`
      );
      tips.push(
        "If the reporting doesn’t line up with the legal paperwork, that mismatch can be the core of a strong dispute. When legal stuff is involved, facts and documents matter more than anything."
      );
    }

    // Utilization logic
    if (utilization > 0) {
      if (utilization > 120) {
        tips.push(
          `Your utilization reading (about ${utilization}%) suggests maxed-out or over-limit accounts. Don’t panic — but understand this alone can shred your score. Your job is to create a written pay-down plan with real numbers and dates.`
        );
      } else if (utilization > 80) {
        tips.push(
          `At roughly ${utilization}% utilization, you’re in the “heavy pressure” zone. Even if you never pay late, this weighs your score down hard. Aim for phases: under 80%, then 50%, then 30%.`
        );
      } else if (utilization > 30) {
        tips.push(
          `Utilization near ${utilization}% is workable but still costing you points. As you clean up negatives, also push for balances under 30% per card and under 10–15% when you’re prepping for major approvals.`
        );
      } else {
        tips.push(
          `Utilization around ${utilization}% isn’t the main emergency. Keep it in this healthy range and pour your energy into cleaning inaccurate negatives and building long-term positive payment history.`
        );
      }
    }

    // Score-based guidance
    if (score > 0) {
      if (score < 580) {
        tips.push(
          `With a score around ${score}, think “heavy rebuild mode.” Your first wins come from (1) removing wrong or unverifiable negatives, (2) never missing another due date, and (3) chopping down utilization over time.`
        );
      } else if (score < 650) {
        tips.push(
          `A score around ${score} is way more fixable than it feels. A couple of solid deletions plus a smart utilization drop can unlock much better approval terms in 6–12 months if you stay consistent.`
        );
      } else if (score < 720) {
        tips.push(
          `At about ${score}, you’re much closer than you think. You’re in “fine-tune and protect” territory: clean the last few negatives, keep utilization tight, and avoid any new lates before big applications.`
        );
      } else {
        tips.push(
          `Score around ${score} is already strong. Your job now is to avoid unnecessary new accounts, keep utilization low, and make sure your reports stay clean and boring to underwriters.`
        );
      }
    }

    // Goal-based logic from their question
    if (lower.includes("car") || lower.includes("auto loan") || lower.includes("vehicle")) {
      tips.push(
        "Because you mentioned a car/auto loan, give yourself 6–12 months of disciplined cleanup before shopping lenders. Clean reports and lower utilization can mean thousands saved over the life of the loan."
      );
    }

    if (lower.includes("house") || lower.includes("mortgage") || lower.includes("home loan")) {
      tips.push(
        "For a house or mortgage, underwriters care about: the last 12 months of payment history, your utilization, and how “boring” your credit looks. We want your reports calm, consistent, and drama-free before you apply."
      );
    }

    if (lower.includes("business") || lower.includes("llc") || lower.includes("startup")) {
      tips.push(
        "For business or LLC goals, strong personal credit is still the foundation at first. Clean personal files, then build business banking relationships and vendors that report to business bureaus when you’re ready."
      );
    }

    if (lower.includes("identity theft") || lower.includes("fraud")) {
      tips.push(
        "With identity theft or fraud, you’re in the “documentation and protection” playbook. Use IdentityTheft.gov, consider a police report, and lock your reports with fraud alerts or freezes."
      );
    }

    if (lower.includes("bankruptcy") || lower.includes("chapter 7") || lower.includes("chapter 13")) {
      tips.push(
        "Post-bankruptcy, your power comes from precision and rebuild. Verify that accounts included in the bankruptcy are reporting correctly and then add only small, controllable tradelines you treat perfectly."
      );
    }

    // Generic fallback if not much was given
    if (tips.length <= 2) {
      tips.push(
        "Start with a simple control panel: on one page, list collections, charge-offs, lates (last 24 months), repos/judgments, utilization, and your scores. That page becomes your dashboard."
      );
      tips.push(
        "Then: dispute what’s clearly wrong, lower utilization in phases, and keep every new payment on time. That combination is what shifts scores and approvals over time."
      );
    }

    const riskText = computeRiskLevel(score, utilization);

    const html = `
      <p><strong>Snapshot read:</strong> ${snapshotSummary}</p>
      ${
        riskText
          ? `<p><strong>Risk level (plain talk):</strong> ${riskText}</p>`
          : `<p><strong>Risk level (plain talk):</strong> Not enough data to score it, but you still have a path forward.</p>`
      }
      <p><strong>Here’s your AI-style game plan:</strong></p>
      <ol>
        ${tips.map((tip) => `<li>${tip}</li>`).join("")}
      </ol>
      <p class="ask-ai-footer">
        This is education, not legal, tax, or investment advice. Always save copies of your reports,
        letters, and responses — your paper trail is your protection.
      </p>
    `;

    return html;
  }

  // Render with “thinking…” state
  function renderWithThinking(container, fullHtml) {
    container.innerHTML =
      'Thinking through your situation<span class="hero-terminal-cursor"></span>';
    container.classList.add("visible");

    setTimeout(() => {
      container.innerHTML = fullHtml;
      container.classList.add("visible");
      scrollToElement(container, "center");
    }, 800);
  }

  // Ask AI handler
  function handleAskClick() {
    const question = questionInput.value || "";

    // Clear highlight first
    snapshotElements.forEach((el) => el && el.classList.remove("snapshot-pulse"));

    if (!question.trim()) {
      answerBox.innerHTML =
        "<p><strong>Quick note:</strong> Type your question first so I know what you’re dealing with.</p>";
      answerBox.classList.add("visible");
      scrollToElement(answerBox, "center");
      pulseField(questionInput);
      return;
    }

    // If absolutely no snapshot info was given, gently pulse fields
    const hasAnySnapshot = snapshotIds.some((id) => {
      const el = document.getElementById(id);
      return el && el.value.trim() !== "";
    });

    if (!hasAnySnapshot) {
      snapshotElements.forEach(pulseField);
    }

    const html = buildAnswer(question);
    renderWithThinking(answerBox, html);
  }

  askButton.addEventListener("click", handleAskClick);

  // Ctrl+Enter / Cmd+Enter to submit from textarea
  questionInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      handleAskClick();
    }
  });
});
