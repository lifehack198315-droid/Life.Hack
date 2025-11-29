// script.js
// AI-style credit assistant for Advance Credit Solution (front-end logic only)

document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Mobile nav (simple)
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.style.display === "flex";
      mainNav.style.display = isOpen ? "none" : "flex";
    });
  }

  // Ask AI logic
  const questionInput = document.getElementById("ask-ai-question");
  const askButton = document.getElementById("ask-ai-button");
  const answerBox = document.getElementById("ask-ai-answer");

  if (!questionInput || !askButton || !answerBox) return;

  function getNumber(id) {
    const el = document.getElementById(id);
    if (!el) return 0;
    const value = parseFloat(el.value);
    return Number.isFinite(value) ? value : 0;
  }

  function buildAnswer(rawQuestion) {
    const q = (rawQuestion || "").trim();
    const lower = q.toLowerCase();

    const collections = getNumber("snap-collections");
    const chargeoffs = getNumber("snap-chargeoffs");
    const lates = getNumber("snap-lates");
    const repos = getNumber("snap-repos");
    const utilization = getNumber("snap-utilization");
    const score = getNumber("snap-score");

    const tips = [];

    // Intro
    tips.push(
      "First, breathe. Your credit is a situation, not a life sentence. We’re going to focus on the highest-impact moves instead of trying to fix everything at once."
    );

    // Collections logic
    if (collections > 0) {
      tips.push(
        `You mentioned around ${collections} collection account(s). Start by pulling all three reports and listing each collection with name, balance, account number, and dates. Anything that looks wrong or duplicate gets disputed first under the Fair Credit Reporting Act.`
      );
      tips.push(
        "Do not call collection agencies and make deals over the phone. Keep everything in writing so you have a paper trail and so you don’t restart old statutes accidentally."
      );
    }

    // Charge-offs
    if (chargeoffs > 0) {
      tips.push(
        `You have about ${chargeoffs} charge-off(s). For each one, separate the problem into two parts: (1) Is the reporting accurate? (2) Do you want to negotiate a settlement or deletion? Fix wrong data first, then talk settlement in writing only.`
      );
    }

    // Lates
    if (lates > 0) {
      tips.push(
        `You estimated roughly ${lates} late payment(s) in the last 24 months. Focus on keeping everything current going forward and look closely for any late marks that don’t match your actual pay history — those are dispute candidates.`
      );
      tips.push(
        "For accurate lates, you may ask the creditor for a goodwill adjustment once you’ve built a new streak of on-time payments. It’s not guaranteed, but it works often enough to try."
      );
    }

    // Repos / judgments
    if (repos > 0) {
      tips.push(
        `Repos/judgments: you listed about ${repos}. Get copies of any contracts or court documents so you can compare what’s reported on your credit reports against what actually happened. Anything that doesn’t match the paperwork can be challenged.`
      );
    }

    // Utilization logic
    if (utilization > 0) {
      if (utilization > 80) {
        tips.push(
          `Your utilization looks very high (around ${utilization}%). That alone can crush your score even if you never pay late. Your first rebuilding move is to create a plan to bring each card under 50%, then under 30%, and ideally into the 10–20% range.`
        );
      } else if (utilization > 30) {
        tips.push(
          `Your utilization is around ${utilization}%. Good news: this is very fixable. Aim to pay balances down below 30% per card and under about 10–15% if you’re trying to squeeze out extra points before a big purchase.`
        );
      } else {
        tips.push(
          `Your utilization (around ${utilization}%) is not the main fire. The main gains will likely come from cleaning inaccurate negatives and building positive history. Keep utilization in the low range and focus on disputes and rebuild strategy.`
        );
      }
    }

    // Score context
    if (score > 0) {
      if (score < 580) {
        tips.push(
          `With a score around ${score}, you’re in the “heavy rebuild” zone. Your first wins will come from deleting bad data, lowering utilization, and preventing any new late payments while you work the plan.`
        );
      } else if (score < 650) {
        tips.push(
          `A score around ${score} means you’re closer than you think. A few successful deletions and a utilization drop can move you into a much better approval tier if you stay consistent.`
        );
      } else {
        tips.push(
          `Around ${score} is not terrible at all. At this level, accurate clean-up plus disciplined utilization and a couple of solid positive tradelines can put you in a strong position for major goals.`
        );
      }
    }

    // Question-based logic
    if (lower.includes("car") || lower.includes("auto loan")) {
      tips.push(
        "Since you mentioned a car, work backward from the date you want to buy. Give yourself at least 6–12 months to clean up reports, lower utilization, and build a stable pattern of on-time payments before shopping lenders."
      );
    }

    if (lower.includes("house") || lower.includes("mortgage")) {
      tips.push(
        "For a house or mortgage goal, stability is everything. Lenders care about on-time history, stable income, and lower utilization. We want your reports as clean as possible and your last 12 months to look boring and responsible."
      );
    }

    if (lower.includes("bankruptcy")) {
      tips.push(
        "With a bankruptcy in the picture, the focus becomes precise reporting and rebuild. Make sure included accounts are coded correctly after discharge, then add small, manageable tradelines and keep them extremely clean."
      );
    }

    if (lower.includes("identity theft") || lower.includes("fraud")) {
      tips.push(
        "For identity theft or fraud, file an identity theft report, consider a police report, and use that documentation when disputing. Lock down your reports with fraud alerts or freezes while you clean up the damage."
      );
    }

    // Generic fallback if not much else
    if (tips.length <= 2) {
      tips.push(
        "Write down your snapshot on paper: collections, charge-offs, lates, repos, utilization, and your current scores. That becomes your control panel. Then hit the biggest, most obvious errors first."
      );
      tips.push(
        "Your ongoing job: no new lates, lower utilization over time, and add positive tradelines you can actually afford to manage. That combination is how scores move and stay up."
      );
    }

    const html = `
      <p><strong>Here’s a calm, AI-style game plan based on what you shared:</strong></p>
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

  function handleAskClick() {
    const question = questionInput.value || "";

    if (!question.trim()) {
      answerBox.innerHTML =
        "<p><strong>Quick note:</strong> Type your question first so I know what you’re dealing with.</p>";
      answerBox.classList.add("visible");
      answerBox.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const html = buildAnswer(question);
    answerBox.innerHTML = html;
    answerBox.classList.add("visible");
    answerBox.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  askButton.addEventListener("click", handleAskClick);

  // Convenience: Ctrl+Enter or Cmd+Enter submits
  questionInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      handleAskClick();
    }
  });
});
