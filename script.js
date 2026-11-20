// Edit githubUsername once you confirm your exact GitHub handle.
const SITE_CONFIG = {
  email: "muhammadalfarris@gmail.com",
  discordHandle: "@alphasolacee",
  tiktokHandle: "@alphasolacee",
  githubUsername: "ralfarris",
  excludedRepos: ["app2safe"],
  maxRepos: 3
};

document.getElementById("year").textContent = new Date().getFullYear();

// Copy button helper
function bindCopyButton(buttonId, value, fallbackUrl) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(value);
      btn.textContent = "Copied!";
      setTimeout(() => {
        btn.textContent = "Copy";
      }, 1800);
    } catch {
      if (fallbackUrl) window.location.href = fallbackUrl;
    }
  });
}

bindCopyButton("copy-email-btn", SITE_CONFIG.email, `mailto:${SITE_CONFIG.email}`);
bindCopyButton("copy-discord-btn", SITE_CONFIG.discordHandle);

// Mailto brief builder
const inquiryForm = document.getElementById("inquiry-form");
if (inquiryForm) {
  inquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const service = document.getElementById("service-select").value;
    const name = document.getElementById("client-name").value.trim();
    const details = document.getElementById("client-details").value.trim();

    const subject = encodeURIComponent(`[Hire] ${service} — ${name}`);
    const body = encodeURIComponent(
      `Hi AlphaSolacee,\n\nService: ${service}\nFrom: ${name}\n\nProject Details:\n${details}\n\nPayment preference: PayPal Invoice\n`
    );

    window.location.href = `mailto:${SITE_CONFIG.email}?subject=${subject}&body=${body}`;
  });
}

// Optional dynamic GitHub repo loader
async function loadGitHubRepos(username) {
  const profileLink = document.getElementById("github-profile-link");
  const footerLink = document.getElementById("footer-github-link");
  const heading = document.getElementById("github-handle-heading");
  const statusText = document.getElementById("github-status-text");
  const listEl = document.getElementById("github-repos-list");

  if (!username) {
    statusText.textContent =
      "Set your GitHub username in script.js to auto-load your latest public repositories.";
    return;
  }

  const profileUrl = `https://github.com/${encodeURIComponent(username)}`;
  profileLink.href = profileUrl;
  footerLink.href = profileUrl;
  heading.textContent = `github.com/${username}`;

  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=10`
    );
    if (!res.ok) throw new Error("Failed to fetch repos");
    const rawRepos = await res.json();

    const excluded = new Set(SITE_CONFIG.excludedRepos.map((r) => r.toLowerCase()));
    const repos = Array.isArray(rawRepos)
      ? rawRepos
          .filter((repo) => !excluded.has(repo.name.toLowerCase()))
          .slice(0, SITE_CONFIG.maxRepos)
      : [];

    if (repos.length === 0) {
      statusText.textContent = "No public repositories found yet.";
      return;
    }

    statusText.textContent = "Latest public repositories:";
    listEl.innerHTML = "";
    for (const repo of repos) {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = repo.html_url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = repo.name;

      const desc = document.createElement("span");
      desc.className = "repo-desc";
      desc.textContent = repo.description || "Public project repository";

      li.appendChild(link);
      li.appendChild(desc);
      listEl.appendChild(li);
    }
  } catch {
    statusText.textContent = "View all code and mini-app projects directly on GitHub.";
  }
}

loadGitHubRepos(SITE_CONFIG.githubUsername);
