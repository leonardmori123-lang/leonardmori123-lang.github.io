// Simple interactions: tabs and search filter
(function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Tabs with filtering between modes
  const tabs = $$(".tab");
  function applyModeFilter(activeMode) {
    const allCards = $$(".card");
    allCards.forEach((c) => {
      const mode = c.getAttribute("data-mode") || "warfare";
      c.style.display = mode === activeMode ? "flex" : "none";
    });
    const title = $("#metaTitle");
    const subtitle = $("#metaSubtitle");
    if (title && subtitle) {
      if (activeMode === "operations") {
        title.textContent = "Current Operations Meta";
        subtitle.textContent = "The best loadouts that dominate the Operations meta right now.";
      } else {
        title.textContent = "Current Warfare Meta";
        subtitle.textContent = "The best loadouts that dominate the Warfare meta right now.";
      }
    }

    // Body mode class to drive CSS differences
    document.body.classList.toggle("mode-operations", activeMode === "operations");
    document.body.classList.toggle("mode-warfare", activeMode !== "operations");
  }

  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      btn.classList.add("is-active");
      const activeMode = btn.dataset.tab; // 'warfare' or 'operations'
      applyModeFilter(activeMode);
    });
  });

  // Initial filter
  applyModeFilter("warfare");

  // Subtabs
  const subtabs = $$(".subtab");
  subtabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      subtabs.forEach((t) => t.classList.remove("is-active"));
      btn.classList.add("is-active");
      // Note: No content switching needed for demo
    });
  });

  const cards = $$(".card");

  // Clipboard helpers
  async function copyTextToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
      } catch (err) {
        document.body.removeChild(ta);
        return false;
      }
    }
  }

  // Wire buttons
  $$(".card").forEach((card) => {
    // Mark media that has an <img>
    const media = $(".card-media", card);
    if (media && $("img", media)) {
      media.classList.add("has-image");
    }

    const codeP = $(".code", card);
    if (!codeP) return;
    const codeSpan = codeP.querySelector("span");
    const btnCopyCode = codeP.querySelector('.btn-copy[data-copy="code"]');

    if (btnCopyCode) {
      btnCopyCode.addEventListener("click", async () => {
        const text = codeSpan ? codeSpan.textContent.trim() : "";
        const ok = await copyTextToClipboard(text);
        btnCopyCode.textContent = ok ? "Copied!" : "Copy Failed";
        setTimeout(() => (btnCopyCode.textContent = "Copy"), 1200);
      });
    }

    // no image copy button anymore
  });
})();


