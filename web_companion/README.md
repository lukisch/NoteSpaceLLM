# NoteSpaceLLM Web/PWA-Companion

Der Companion ist der erste mobile und browserbasierte Reader für exportierte
`notespacellm-workspace-v1.json`-Dateien aus NoteSpaceLLM. Er bleibt bewusst
read-only für den importierten Workspace und erzeugt nur eigene
Review-Notizen.

## Ziel

- lokaler Import ohne Server-Upload
- mobile Lesbarkeit für Android, iOS und Browser
- Bericht, Dokumentmetadaten und ausgewählte Auszüge anzeigen
- eigene Review-Notizen lokal speichern und als Markdown exportieren

## Lokaler Start

Für einen kurzen lokalen Test reicht ein statischer Server:

```powershell
$env:PYTHONIOENCODING='utf-8'
python -m http.server 8765 -d web_companion
```

Danach im Browser öffnen:

```text
http://127.0.0.1:8765
```

## Tests

```powershell
cd web_companion
node --test tests/library.test.mjs
```

## Scope des ersten Strangs

- kein Upload auf entfernte Server
- keine Bearbeitung des Workspaces im Browser
- keine Rohdokumente, Vektordatenbanken oder API-Schlüssel im Companion
- kein nativer Android-/iOS-Clone
