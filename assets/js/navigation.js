const navItems = [
  { key: "git", label: "Git", href: "../git/index.html" },
  { key: "pull-request", label: "Pull Requests", href: "../pull-request/index.html" },
  { key: "github", label: "GitHub Actions", href: "../github/index.html" },
  { key: "docker", label: "Docker", href: "../docker/index.html" },
  { key: "dockerfile", label: "Dockerfile", href: "../dockerfile/index.html" },
  { key: "linux", label: "Linux", href: "../linux/index.html" },
  { key: "html", label: "HTML", href: "../html/index.html" },
  { key: "markdown", label: "Markdown", href: "../markdown/index.html" },
  { key: "vim", label: "Vim", href: "../vim/index.html" },
  { key: "vscode", label: "VS Code", href: "../vscode/index.html" },
  { key: "dependencies", label: "Dependencies", href: "../dependencies/index.html" },
];

const pageMeta = {
  git: {
    docHref: "https://git-scm.com/doc",
    docLabel: "Official Git Docs →",
  },
  "pull-request": {
    docHref: "https://docs.github.com/en/pull-requests",
    docLabel: "Official PR Docs →",
  },
  github: {
    docHref: "https://docs.github.com/en/actions",
    docLabel: "GitHub Actions Docs →",
  },
  docker: {
    docHref: "https://docs.docker.com/reference/cli/docker/",
    docLabel: "Docker CLI Docs →",
  },
  dockerfile: {
    docHref: "https://docs.docker.com/reference/dockerfile/",
    docLabel: "Dockerfile Docs →",
  },
  linux: {
    docHref: "https://www.gnu.org/software/coreutils/manual/coreutils.html",
    docLabel: "Coreutils Docs →",
  },
  html: {
    docHref: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    docLabel: "HTML Docs →",
  },
  markdown: {
    docHref: "https://docs.github.com/en/get-started/writing-on-github",
    docLabel: "Markdown Docs →",
  },
  vim: {
    docHref: "https://www.vim.org/docs.php",
    docLabel: "Vim Docs →",
  },
  vscode: {
    docHref: "https://code.visualstudio.com/docs",
    docLabel: "VS Code Docs →",
  },
  dependencies: {
    docHref: "https://docs.npmjs.com/",
    docLabel: "Official npm Docs →",
  },
};

const getCurrentPageKey = () => {
  const path = window.location.pathname.replace(/\/+$/, "");
  const segments = path.split("/").filter(Boolean);
  const last = segments[segments.length - 1];

  if (last === "index.html") {
    return segments[segments.length - 2] ?? "";
  }

  return last;
};

const renderSharedNavigation = () => {
  const header = document.querySelector("[data-shared-nav]");

  if (!header) {
    return;
  }

  const currentPageKey = getCurrentPageKey();
  const currentPageMeta = pageMeta[currentPageKey];

  if (!currentPageMeta) {
    return;
  }

  const navLinks = navItems
    .map((item) => {
      const isActive = item.key === currentPageKey;
      const className = isActive ? ' class="is-active active"' : "";
      const ariaCurrent = isActive ? ' aria-current="page"' : "";
      return `<a${className} href="${item.href}"${ariaCurrent}>${item.label}</a>`;
    })
    .join("\n            ");

  header.innerHTML = `
      <div class="nav-shell container">
        <div class="nav-main">
          <a class="brand-link" href="../index.html">Developer Cheat Sheets</a>

          <button
            class="nav-toggle"
            type="button"
            aria-expanded="false"
            aria-controls="site-nav"
            aria-label="Toggle site navigation"
          >
            Menu
          </button>

          <nav class="site-nav" id="site-nav" aria-label="Main">
            ${navLinks}
          </nav>
        </div>

        <div class="nav-tools">
          <a class="home-link" href="../index.html">← All Cheat Sheets</a>

          <form class="page-search" id="page-search" role="search">
            <label class="sr-only" for="page-search-input">
              Find a command or section on this page
            </label>
            <input
              id="page-search-input"
              type="search"
              name="page-search"
              placeholder="Find command or section"
              autocomplete="off"
            />
            <button type="submit">Search</button>
          </form>

          <a
            class="doc-link"
            href="${currentPageMeta.docHref}"
            target="_blank"
            rel="noopener noreferrer"
          >
            ${currentPageMeta.docLabel}
          </a>
        </div>

        <p class="search-feedback" id="search-feedback" aria-live="polite"></p>
      </div>
  `;
};

renderSharedNavigation();
