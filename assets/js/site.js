const copyButtons = document.querySelectorAll(".copy-button");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const tocLinks = [...document.querySelectorAll("[data-toc-link]")];
const observedTargets = tocLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const visibleTargets = new Set();
const scrollSentinel = document.getElementById("scroll-sentinel");
const backToTopButton = document.getElementById("back-to-top");
const searchForm = document.getElementById("page-search");
const searchInput = document.getElementById("page-search-input");
const searchFeedback = document.getElementById("search-feedback");
const searchTargets = [...document.querySelectorAll("[data-search-target]")];

const getSearchLabel = (target) =>
  target.querySelector("h2, h3")?.innerText.trim() ?? target.id;

const getCopyText = (button) => {
  if (button.dataset.copyText) {
    return button.dataset.copyText;
  }

  const codeBlock = button.nextElementSibling;
  return codeBlock?.innerText ?? "";
};

const getCopyFeedbackNode = (button) =>
  button.querySelector("[data-copy-label]") ?? button;

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const code = getCopyText(button);
    const feedbackNode = getCopyFeedbackNode(button);
    const defaultLabel =
      feedbackNode.dataset.defaultLabel ?? feedbackNode.innerText;

    if (feedbackNode.dataset.defaultLabel === undefined) {
      feedbackNode.dataset.defaultLabel = defaultLabel;
    }

    try {
      await navigator.clipboard.writeText(code);
      feedbackNode.innerText = "Copied!";

      setTimeout(() => {
        feedbackNode.innerText = defaultLabel;
      }, 1500);
    } catch (error) {
      feedbackNode.innerText = "Failed";
    }
  });
});

const checklistRoots = [...document.querySelectorAll("[data-checklist-root]")];

checklistRoots.forEach((root) => {
  const rootKey = root.dataset.checklistRoot || "default";
  const storageKey = `developer-handbook:${window.location.pathname}:${rootKey}`;
  const milestoneInputs = [...root.querySelectorAll("[data-checklist-item]")];
  const progressOutput = root.querySelector("[data-checklist-progress]");
  const resetButton = root.querySelector("[data-checklist-reset]");

  if (!milestoneInputs.length) {
    return;
  }

  const readSavedState = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) ?? "[]");
    } catch (error) {
      return [];
    }
  };

  const writeSavedState = () => {
    const state = milestoneInputs.map((input) => input.checked);
    localStorage.setItem(storageKey, JSON.stringify(state));
  };

  const updateChecklist = () => {
    milestoneInputs.forEach((input, index) => {
      const previousComplete = index === 0 || milestoneInputs[index - 1].checked;
      const card = input.closest("[data-milestone-card]");
      const isLocked = !previousComplete && !input.checked;

      input.disabled = isLocked;

      if (card) {
        card.classList.toggle("is-complete", input.checked);
        card.classList.toggle("is-locked", isLocked);
      }
    });

    const completedCount = milestoneInputs.filter((input) => input.checked).length;

    if (progressOutput) {
      progressOutput.textContent = `${completedCount} of ${milestoneInputs.length} milestones complete`;
    }

    writeSavedState();
  };

  readSavedState().forEach((isChecked, index) => {
    if (milestoneInputs[index]) {
      milestoneInputs[index].checked = Boolean(isChecked);
    }
  });

  milestoneInputs.forEach((input) => {
    input.addEventListener("change", () => {
      updateChecklist();
    });
  });

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      milestoneInputs.forEach((input) => {
        input.checked = false;
      });

      updateChecklist();
    });
  }

  updateChecklist();
});

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const setActiveTocLink = (id) => {
  tocLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const updateCurrentSection = () => {
  const current = [...visibleTargets]
    .map((id) => document.getElementById(id))
    .filter(Boolean)
    .sort((a, b) => {
      const aTop = Math.abs(a.getBoundingClientRect().top);
      const bTop = Math.abs(b.getBoundingClientRect().top);
      return aTop - bTop;
    })[0];

  if (current) {
    setActiveTocLink(current.id);
  }
};

if (observedTargets.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleTargets.add(entry.target.id);
        } else {
          visibleTargets.delete(entry.target.id);
        }
      });

      updateCurrentSection();
    },
    {
      rootMargin: "-18% 0px -55% 0px",
      threshold: [0.1, 0.25, 0.5],
    },
  );

  observedTargets.forEach((target) => sectionObserver.observe(target));
  setActiveTocLink(observedTargets[0].id);
}

if (scrollSentinel && backToTopButton) {
  const sentinelObserver = new IntersectionObserver(
    ([entry]) => {
      backToTopButton.classList.toggle("is-visible", !entry.isIntersecting);
    },
    {
      threshold: 0,
    },
  );

  sentinelObserver.observe(scrollSentinel);
}

if (backToTopButton) {
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if (searchForm && searchInput && searchFeedback) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
      searchFeedback.textContent = "Enter a command or section name to search.";
      return;
    }

    const exactHeadingMatch = searchTargets.find(
      (target) => getSearchLabel(target).toLowerCase() === query,
    );
    const partialHeadingMatch = searchTargets.find((target) =>
      getSearchLabel(target).toLowerCase().includes(query),
    );
    const textMatch = searchTargets.find((target) =>
      target.innerText.toLowerCase().includes(query),
    );
    const match = exactHeadingMatch ?? partialHeadingMatch ?? textMatch;

    if (!match) {
      searchFeedback.textContent = `No match found for "${searchInput.value.trim()}".`;
      return;
    }

    match.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveTocLink(match.id);
    searchFeedback.textContent = `Jumped to "${getSearchLabel(match)}".`;
  });
}
