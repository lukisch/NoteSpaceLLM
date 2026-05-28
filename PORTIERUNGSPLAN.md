# Portierungsplan -- NoteSpaceLLM

Stand: 2026-05-28

## Ergebnis des Checks

Für NoteSpaceLLM gab es bisher keinen eigenständigen Portierungsplan. Es
existieren aber mehrere relevante Bausteine: eine lokale PySide6-Desktop-App,
ein ignorierter historischer Webservice-Prototyp unter
`webservice_SpaceNot/`, eine REST-/CLI-Aufgabenplanung in `AUFGABEN.txt`,
Multi-Format-Export und klare Datenschutzregeln für lokale Projektordner.

Die sinnvolle Plattformstrategie ist deshalb keine vollständige
Neuentwicklung auf allen Plattformen, sondern eine getrennte Produktlinie:

- Desktop bleibt die autoritative Vollversion für lokale Dokumente,
  RAG-Index, LLM-Provider und vertrauliche Arbeitsstände.
- Web/PWA wird die bevorzugte Android-/iOS-/Browser-Linie für mobile
  Recherche-, Lese- und Review-Workflows.
- Der Datenaustausch läuft über ein explizites Exportformat statt über direkte
  Kopie von `data/`, `profiles/`, `workflows/`, `output/` oder `chroma_db/`.

## Begründung

NoteSpaceLLM hat hohen Mobilitätsnutzen, weil Nutzer Berichte, Exzerpte,
Quellenlisten und Recherchefragen unterwegs prüfen oder weitergeben wollen.
Gleichzeitig sind Rohdokumente, lokale Vektordatenbanken, API-Schlüssel und
vertrauliche Projektstände besonders sensibel. Eine native Mobile-Kopie der
Desktop-App wäre daher teuer, riskant und funktional eingeschränkt. Ein
Web/PWA-Companion deckt den Bedarf besser ab: mobil lesen, kommentieren,
kleine Nachfragen stellen und Ergebnisse exportieren, während die schwere
Indexierung und lokale Dokumenthaltung auf dem Desktop bleibt.

## Plattformentscheidungen

| Plattform | Entscheidung | Begründung | Priorität |
|---|---|---|---|
| Windows Store | Vorbereiten, aber PyMuPDF-/AGPL-Kontext und Datenschutz klar dokumentieren | Desktop ist die Vollversion; Store kann Reichweite bringen, muss aber lokale Datenhaltung und optional externe Provider erklären | P1 |
| Webapp / PWA | Bevorzugte Companion-Linie | Gemeinsame Basis für Browser, Android und iOS; guter Fit für Lesen, Review, Chat über exportierte Kontexte und kleine Workflows | P1 |
| Android | Über PWA/Capacitor prüfen, kein nativer Clone | Mobile Nutzung ist sinnvoll, aber lokale Dateisystem- und Vektor-DB-Funktionen passen schlecht zu Android-Sandboxing | P2 |
| iOS | Über PWA/Capacitor prüfen, kein nativer Clone | Gleiche Companion-Logik wie Android; native App nur bei nachgewiesener Nachfrage | P2 |
| macOS | Source-/Build-Smoke aus derselben PySide6-Codebasis | Desktop-App kann fachlich passen; Paketierung erst nach stabilem Windows-Store-/GitHub-Pfad | P3 |
| Linux | Source-/Build-Smoke aus derselben PySide6-Codebasis | Entwickler- und Forschungszielgruppe relevant; keine separate UI-Linie nötig | P3 |

## Zielarchitektur

1. Desktop-App bleibt offline-first und verwaltet Rohdokumente, ChromaDB,
   Profile, Workflows und lokale Provider-Konfiguration.
2. `notespacellm-workspace-v1.json` wird der stabile Austauschvertrag für
   Companion-Clients.
3. Standardexport enthält Metadaten, Dokumentliste, ausgewählte Textauszüge,
   Fragestellung, Workflow, Ergebnisbericht und Exportdateien, aber keine
   Rohdokumente.
4. Rohdokumente dürfen nur optional und bewusst als separates Archiv oder
   lokales Verzeichnis referenziert werden.
5. Web/PWA-Companion startet als Reader/Reviewer für exportierte Workspaces
   und später als leichter Query-Client gegen eine lokale oder selbst
   gehostete API.
6. Android/iOS nutzen dieselbe Web/PWA-Basis; nativer Store-Wrapper erst nach
   funktionierendem Browser-Companion.
7. macOS/Linux werden über Smoke-Tests und dokumentierte Startpfade geprüft,
   nicht über separate Rebuilds.

## Export- und Importstrategie

Der erste technische Schritt ist kein neuer Webservice, sondern ein stabiler
Desktop-Export. Details stehen in `EXPORTFORMAT.md`.

Kurzfassung:

- `schema_version`: `notespacellm-workspace-v1`
- Enthält Projektmetadaten, Dokumentmetadaten, ausgewählte Auszüge, Workflow,
  Fragestellung, Bericht, Chat-/Prompt-Export und Provider-Hinweise.
- Enthält standardmäßig keine API-Schlüssel, keine vollständigen Rohdokumente
  und keine ChromaDB-Dateien.
- Import in Companion-Clients ist read-only, bis Konflikt- und
  Synchronisationsregeln definiert sind.

## Umsetzungsschritte

| Phase | Aufgabe | Ergebnis |
|---|---|---|
| P0 | Exportformat finalisieren und Desktop-Export ergänzen | `notespacellm-workspace-v1.json` kann aus der Desktop-App erzeugt werden |
| P1 | Windows-Store-Readiness prüfen | Store-Listing, Privacy-Text, Screenshots, AGPL-/PyMuPDF-Hinweis und WACK-Plan stehen |
| P1 | Web/PWA-Companion als neuer, getrennter Strang starten | `web_companion/` importiert Workspace-JSON lokal im Browser, zeigt Bericht und Dokumente read-only und exportiert Review-Notizen |
| P2 | Android/iOS über PWA testen | Mobile Review- und Leseflüsse funktionieren ohne native Desktop-Funktionen |
| P3 | macOS/Linux Smoke-Tests | Start, Import, Export und einfache Analyse laufen aus der PySide6-Codebasis |

## Nicht-Ziele

- Keine direkte Synchronisation kompletter lokaler Projektordner.
- Keine Mobile-App mit lokaler ChromaDB als Pflichtbestandteil.
- Keine Übernahme des ignorierten `webservice_SpaceNot/` als produktiver
  Standard ohne vorherige Bereinigung.
- Keine automatische Übertragung vertraulicher Dokumente an externe Provider.

## Update 2026-05-28: erster Companion-Strang

Der Ordner `web_companion/` enthält jetzt einen statischen PWA-Reader für
`notespacellm-workspace-v1.json`. Der erste Scope bleibt bewusst klein:

- lokaler JSON-Import ohne Server-Upload
- Bericht, Dokumentmetadaten und Auszüge read-only anzeigen
- Review-Notizen nur lokal im Browser speichern
- Export der eigenen Review-Notizen als Markdown

Damit ist die Web-/Mobil-Linie fachlich gestartet, ohne schon Rohdokumente,
LLM-Zugänge oder Synchronisationslogik in den Browser zu ziehen. Die nächsten
Schritte bleiben Desktop-Export, Android-/iOS-Smokes und spätere
Konfliktregeln für optionale Rückkanäle.

## Status

Plan aktiv. P1-Companion gestartet; P0-Workspace-Export und mobile Smokes sind
die nächsten Plattformschritte.
