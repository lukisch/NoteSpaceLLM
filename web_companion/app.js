import {
  buildReviewMarkdown,
  getDemoWorkspace,
  parseWorkspaceText
} from "./library.js";

const STORAGE_PREFIX = "notespacellm-companion-notes:";

const elements = {
  clearNotes: document.querySelector("#clear-notes"),
  documentBadge: document.querySelector("#document-badge"),
  documentList: document.querySelector("#document-list"),
  exportNotes: document.querySelector("#export-notes"),
  fileInput: document.querySelector("#workspace-file"),
  loadDemo: document.querySelector("#load-demo"),
  notes: document.querySelector("#review-notes"),
  reportBadge: document.querySelector("#report-badge"),
  reportPreview: document.querySelector("#report-preview"),
  reportTitle: document.querySelector("#report-title"),
  status: document.querySelector("#status-message"),
  summary: document.querySelector("#workspace-summary")
};

let currentWorkspace = null;

function setStatus(message, isError = false) {
  elements.status.textContent = message;
  elements.status.style.color = isError ? "#b91c1c" : "";
}

function workspaceStorageKey(payload) {
  const title = payload?.workspace?.title || "workspace";
  return `${STORAGE_PREFIX}${title}`;
}

function saveNotes() {
  if (!currentWorkspace) {
    return;
  }
  localStorage.setItem(workspaceStorageKey(currentWorkspace), elements.notes.value);
}

function loadNotes(payload) {
  const value = localStorage.getItem(workspaceStorageKey(payload)) || "";
  elements.notes.value = value;
}

function downloadText(filename, content) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function renderSummary(payload) {
  const values = [
    payload.workspace.title,
    payload.workspace.question || "Keine Leitfrage",
    `${payload.summary.selected_count} von ${payload.summary.document_count} ausgewählt`,
    `${payload.summary.excerpt_count} Auszüge`,
    payload.report.title,
    `${payload.provider.name} (${payload.provider.mode})`
  ];

  [...elements.summary.querySelectorAll("dd")].forEach((node, index) => {
    node.textContent = values[index] || "-";
  });
}

function renderReport(payload) {
  elements.reportTitle.textContent = payload.report.title;
  elements.reportBadge.textContent = payload.report.format;
  elements.reportPreview.textContent = payload.report.content || "Kein Bericht im Export enthalten.";
}

function renderDocuments(payload) {
  elements.documentBadge.textContent = `${payload.summary.document_count} Einträge`;

  if (!payload.documents.length) {
    elements.documentList.className = "stacked-list empty-state";
    elements.documentList.textContent = "Der Export enthält keine Dokumente.";
    return;
  }

  elements.documentList.className = "stacked-list";
  elements.documentList.innerHTML = "";

  payload.documents.forEach((document) => {
    const article = document.createElement("article");
    article.className = "doc-card";

    const excerpts = document.excerpts.length
      ? `<div class="excerpt-list">${document.excerpts
          .map(
            (excerpt) => `
              <div class="excerpt">
                <span class="excerpt-source">${excerpt.source_hint || "Auszug"}</span>
                <div>${excerpt.text}</div>
              </div>
            `
          )
          .join("")}</div>`
      : `<p class="doc-meta">Keine Auszüge im Export.</p>`;

    article.innerHTML = `
      <div class="doc-header">
        <div class="doc-name">${document.name}</div>
        <span class="pill">${document.selected ? "Ausgewählt" : "Nicht ausgewählt"}</span>
      </div>
      <div class="doc-meta">
        ${document.format || "unbekannt"} · ${document.path_hint || "ohne Pfadhinweis"} ·
        ${document.content_included ? "Inhalt enthalten" : "nur Metadaten"}
      </div>
      ${excerpts}
    `;

    elements.documentList.append(article);
  });
}

function renderWorkspace(payload, sourceLabel) {
  currentWorkspace = payload;
  renderSummary(payload);
  renderReport(payload);
  renderDocuments(payload);
  loadNotes(payload);
  setStatus(`${sourceLabel} geladen: ${payload.workspace.title}`);
}

async function handleFile(file) {
  if (!file) {
    return;
  }

  try {
    const text = await file.text();
    const payload = parseWorkspaceText(text);
    renderWorkspace(payload, file.name);
  } catch (error) {
    setStatus(error.message, true);
  }
}

elements.fileInput.addEventListener("change", (event) => {
  const [file] = event.target.files || [];
  void handleFile(file);
});

elements.loadDemo.addEventListener("click", () => {
  renderWorkspace(getDemoWorkspace(), "Demo-Workspace");
});

elements.exportNotes.addEventListener("click", () => {
  if (!currentWorkspace) {
    setStatus("Zuerst einen Workspace laden.", true);
    return;
  }

  const safeTitle = currentWorkspace.workspace.title
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "workspace";
  const markdown = buildReviewMarkdown(currentWorkspace, elements.notes.value);
  downloadText(`${safeTitle}-review-notizen.md`, markdown);
  setStatus(`Review-Notizen exportiert: ${safeTitle}-review-notizen.md`);
});

elements.clearNotes.addEventListener("click", () => {
  elements.notes.value = "";
  saveNotes();
  setStatus("Lokale Review-Notizen geleert.");
});

elements.notes.addEventListener("input", saveNotes);

const params = new URLSearchParams(window.location.search);
if (params.get("demo") === "1") {
  renderWorkspace(getDemoWorkspace(), "Demo-Workspace");
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // Offline-Support ist optional; UI bleibt auch ohne Service Worker nutzbar.
    });
  });
}
