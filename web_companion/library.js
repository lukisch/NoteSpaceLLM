const DEFAULT_APP = Object.freeze({
  name: "NoteSpaceLLM",
  version: "unbekannt",
  exported_at: ""
});

const DEFAULT_WORKSPACE = Object.freeze({
  title: "Unbenannter Workspace",
  question: "",
  workflow_type: "",
  locale: "de"
});

function asString(value, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asBoolean(value, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function toDocumentId(index) {
  return `doc-${index + 1}`;
}

function normalizeExcerpt(excerpt, index) {
  return {
    id: asString(excerpt?.id, `excerpt-${index + 1}`),
    text: asString(excerpt?.text),
    source_hint: asString(excerpt?.source_hint)
  };
}

function normalizeDocument(document, index) {
  const excerpts = asArray(document?.excerpts)
    .map(normalizeExcerpt)
    .filter((entry) => entry.text);

  return {
    id: asString(document?.id, toDocumentId(index)),
    name: asString(document?.name, `Dokument ${index + 1}`),
    path_hint: asString(document?.path_hint),
    format: asString(document?.format),
    selected: asBoolean(document?.selected, false),
    content_included: asBoolean(document?.content_included, false),
    excerpts
  };
}

export function parseWorkspaceText(text) {
  if (!asString(text).trim()) {
    throw new Error("Die ausgewählte Datei ist leer.");
  }

  let raw;
  try {
    raw = JSON.parse(text);
  } catch (error) {
    throw new Error("Die Datei ist kein gültiges JSON.");
  }

  return normalizeWorkspacePayload(raw);
}

export function normalizeWorkspacePayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Der Workspace muss ein JSON-Objekt sein.");
  }

  const schemaVersion = asString(payload.schema_version);
  if (schemaVersion && schemaVersion !== "notespacellm-workspace-v1") {
    throw new Error(`Nicht unterstützte Schema-Version: ${schemaVersion}`);
  }

  const documents = asArray(payload.documents).map(normalizeDocument);
  const excerpts = documents.flatMap((document) => document.excerpts);
  const selectedDocuments = documents.filter((document) => document.selected);
  const reportContent = asString(payload.report?.content);
  const chatMessages = asArray(payload.chat?.messages);

  return {
    schema_version: schemaVersion || "notespacellm-workspace-v1",
    app: {
      ...DEFAULT_APP,
      name: asString(payload.app?.name, DEFAULT_APP.name),
      version: asString(payload.app?.version, DEFAULT_APP.version),
      exported_at: asString(payload.app?.exported_at, DEFAULT_APP.exported_at)
    },
    workspace: {
      ...DEFAULT_WORKSPACE,
      title: asString(payload.workspace?.title, DEFAULT_WORKSPACE.title),
      question: asString(payload.workspace?.question, DEFAULT_WORKSPACE.question),
      workflow_type: asString(payload.workspace?.workflow_type, DEFAULT_WORKSPACE.workflow_type),
      locale: asString(payload.workspace?.locale, DEFAULT_WORKSPACE.locale)
    },
    documents,
    report: {
      title: asString(payload.report?.title, "Bericht"),
      format: asString(payload.report?.format, reportContent ? "markdown" : "keiner"),
      content: reportContent
    },
    chat: {
      messages: chatMessages
    },
    provider: {
      mode: asString(payload.provider?.mode, "unbekannt"),
      name: asString(payload.provider?.name, "unbekannt"),
      secret_exported: asBoolean(payload.provider?.secret_exported, false)
    },
    summary: {
      document_count: documents.length,
      selected_count: selectedDocuments.length,
      excerpt_count: excerpts.length,
      chat_message_count: chatMessages.length,
      has_report: Boolean(reportContent.trim())
    }
  };
}

export function buildReviewMarkdown(workspacePayload, notes) {
  const title = asString(workspacePayload?.workspace?.title, "Unbenannter Workspace");
  const question = asString(workspacePayload?.workspace?.question, "Keine Leitfrage angegeben");
  const reportTitle = asString(workspacePayload?.report?.title, "Bericht");
  const exportedAt = asString(workspacePayload?.app?.exported_at, "unbekannt");
  const excerptCount = workspacePayload?.summary?.excerpt_count ?? 0;
  const documentCount = workspacePayload?.summary?.document_count ?? 0;
  const reportFormat = asString(workspacePayload?.report?.format, "unbekannt");
  const noteBody = asString(notes).trim() || "_Keine zusätzlichen Review-Notizen._";

  return [
    `# Review-Notizen: ${title}`,
    "",
    `- Exportiert: ${exportedAt}`,
    `- Leitfrage: ${question}`,
    `- Bericht: ${reportTitle} (${reportFormat})`,
    `- Dokumente: ${documentCount}`,
    `- Auszüge: ${excerptCount}`,
    "",
    "## Notizen",
    "",
    noteBody
  ].join("\n");
}

export function getDemoWorkspace() {
  return normalizeWorkspacePayload({
    schema_version: "notespacellm-workspace-v1",
    app: {
      name: "NoteSpaceLLM",
      version: "1.0.0",
      exported_at: "2026-05-28T10:00:00Z"
    },
    workspace: {
      title: "Demo: Forschungsnotizen",
      question: "Welche Kernthesen tragen den Bericht am stärksten?",
      workflow_type: "research",
      locale: "de"
    },
    documents: [
      {
        id: "doc-1",
        name: "berichtsentwurf.md",
        path_hint: "berichte/berichtsentwurf.md",
        format: "markdown",
        selected: true,
        content_included: false,
        excerpts: [
          {
            id: "doc-1-excerpt-1",
            text: "Die stärkste Evidenz liegt in der Kombination aus Primärquelle und Gegenprüfung.",
            source_hint: "Abschnitt 2"
          }
        ]
      },
      {
        id: "doc-2",
        name: "literatur.pdf",
        path_hint: "quellen/literatur.pdf",
        format: "pdf",
        selected: true,
        content_included: false,
        excerpts: [
          {
            id: "doc-2-excerpt-1",
            text: "Mehrere Studien weisen auf denselben methodischen Engpass hin.",
            source_hint: "Seite 14"
          }
        ]
      }
    ],
    report: {
      title: "Synthesebericht",
      format: "markdown",
      content: "# Synthese\n\n- Kernthese A wird durch zwei Quellen gestützt.\n- Offene Lücke: Vergleichsdaten für 2024 fehlen noch."
    },
    chat: {
      messages: [
        {
          role: "assistant",
          content: "Fasse die Quellenlage für die Hauptthese zusammen."
        }
      ]
    },
    provider: {
      mode: "local",
      name: "ollama",
      secret_exported: false
    }
  });
}
