// Everything on this page comes from data/projects.json.
// To add new work: open that file, copy an entry, edit it, save.
// Paste a normal YouTube or Vimeo link into videoUrl and it embeds itself.
// This file never needs to change.

async function loadData() {
  const res = await fetch("data/projects.json");
  return res.json();
}

function embedUrl(url) {
  if (!url) return null;
  if (url.includes("youtube.com/watch")) {
    const id = new URL(url).searchParams.get("v");
    return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1].split(/[?&]/)[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes("vimeo.com/") && !url.includes("player.vimeo.com")) {
    const id = url.split("vimeo.com/")[1].split(/[?&]/)[0];
    return `https://player.vimeo.com/video/${id}`;
  }
  if (url.includes("drive.google.com/file/d/")) {
    const id = url.split("/file/d/")[1].split("/")[0];
    return `https://drive.google.com/file/d/${id}/preview`;
  }
  return url;
}

function renderCards(id, items) {
  const grid = document.getElementById(id);
  if (items.length === 0) {
    grid.innerHTML = `<p class="note">Nothing added yet.</p>`;
    return;
  }
  grid.innerHTML = items.map(p => {
    const url = embedUrl(p.videoUrl);
    const media = url
      ? `<iframe src="${url}" title="${p.title}" allowfullscreen></iframe>`
      : `<span class="ph">No media yet</span>`;
    const meta = [p.role, p.year].filter(Boolean).join(" · ");
    return `
      <article class="card">
        <div class="media">${media}</div>
        <div class="info">
          <h3>${p.title}</h3>
          <div class="meta">${meta}</div>
          ${p.recognition ? `<div class="recognition">${p.recognition}</div>` : ""}
        </div>
      </article>
    `;
  }).join("");
}

function renderCredits(id, items) {
  const list = document.getElementById(id);
  if (items.length === 0) {
    list.innerHTML = "";
    return;
  }
  list.innerHTML = items.map(p => `
    <li>
      <span class="title">${p.title}</span>
      <span class="meta">${[p.role, p.credit, p.year].filter(Boolean).join(" · ")}</span>
    </li>
  `).join("");
}

// Crew work is split: entries with a video link become cards,
// entries without one stay in the plain credit list below.
function renderCrew(gridId, listId, items) {
  const withVideo = items.filter(p => p.videoUrl);
  const withoutVideo = items.filter(p => !p.videoUrl);
  renderCards(gridId, withVideo);
  renderCredits(listId, withoutVideo);
  document.getElementById(gridId).style.marginBottom = withVideo.length ? "18px" : "0";
}

async function init() {
  document.getElementById("year").textContent = new Date().getFullYear();
  const data = await loadData();
  const byCategory = cat => data.projects.filter(p => p.category === cat);
  renderCards("directorial-grid", byCategory("directorial"));
  renderCrew("crew-grid", "crew-list", byCategory("crew"));
  renderCards("early-grid", byCategory("early"));
}

init();
