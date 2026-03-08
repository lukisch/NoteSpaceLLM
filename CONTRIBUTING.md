# Beitragsrichtlinie / Contributing Guide

## Deutsch

Vielen Dank fuer Ihr Interesse, zu diesem Projekt beizutragen!

### Wie Sie beitragen koennen

1. **Bug melden:** Erstellen Sie ein Issue mit dem Label `bug`
2. **Feature vorschlagen:** Erstellen Sie ein Issue mit dem Label `enhancement`
3. **Code beitragen:** Erstellen Sie einen Pull Request

### Pull Requests

1. Forken Sie das Repository
2. Erstellen Sie einen Feature-Branch: `git checkout -b feature/mein-feature`
3. Committen Sie Ihre Aenderungen: `git commit -m "Beschreibung der Aenderung"`
4. Pushen Sie den Branch: `git push origin feature/mein-feature`
5. Erstellen Sie einen Pull Request

### Contributor License Agreement (CLA)

<!-- OPTION A: Fuer Projekte mit Dual-Licensing (RPX, etc.) -- diesen Block verwenden -->
Dieses Projekt verwendet ein [Contributor License Agreement (CLA)](CLA.md).
Bei Ihrem ersten Pull Request bestaetigen Sie bitte Ihre Zustimmung durch einen Kommentar:

> I have read and agree to the Contributor License Agreement (CLA).

Sie behalten Ihr Urheberrecht -- das CLA raeumt dem Projektinhaber lediglich Nutzungsrechte ein, die eine flexible Lizenzierung des Gesamtprojekts ermoeglichen.

<!-- OPTION B: Fuer Community-Projekte ohne kommerzielle Plaene -- diesen Block stattdessen verwenden
### Developer Certificate of Origin (DCO)

Dieses Projekt verwendet den [Developer Certificate of Origin (DCO)](https://developercertificate.org/).
Bitte signieren Sie jeden Commit mit `--signoff`:

    git commit --signoff -m "Beschreibung der Aenderung"

Damit bestaetigen Sie, dass Sie das Recht haben, den Code unter der Projektlizenz einzureichen.
-->

### Code-Richtlinien

- Python: PEP 8 Stil
- Encoding: UTF-8 fuer alle Dateien
- Sprache: Code und Kommentare auf Deutsch oder Englisch
- Keine hardcoded Pfade oder API-Keys

### Erste Schritte

```bash
git clone https://github.com/lukisch/REL-PUB_NoteSpaceLLM_SOCIAL.git
cd REL-PUB_NoteSpaceLLM_SOCIAL
pip install -r requirements.txt
python main.py
```

---

## English

Thank you for your interest in contributing to this project!

### How to Contribute

1. **Report bugs:** Create an issue with the `bug` label
2. **Suggest features:** Create an issue with the `enhancement` label
3. **Contribute code:** Create a Pull Request

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Description of change"`
4. Push the branch: `git push origin feature/my-feature`
5. Create a Pull Request

### Contributor License Agreement (CLA)

<!-- OPTION A: For projects with dual licensing (RPX, etc.) -->
This project uses a [Contributor License Agreement (CLA)](CLA.md).
On your first pull request, please confirm your agreement by commenting:

> I have read and agree to the Contributor License Agreement (CLA).

You retain your copyright -- the CLA only grants the project owner usage rights that enable flexible licensing of the overall project.

<!-- OPTION B: For community projects without commercial plans
### Developer Certificate of Origin (DCO)

This project uses the [Developer Certificate of Origin (DCO)](https://developercertificate.org/).
Please sign off every commit with `--signoff`:

    git commit --signoff -m "Description of change"

This certifies that you have the right to submit the code under the project license.
-->

### Code Guidelines

- Python: PEP 8 style
- Encoding: UTF-8 for all files
- Language: Code and comments in German or English
- No hardcoded paths or API keys

### Getting Started

```bash
git clone https://github.com/lukisch/REL-PUB_NoteSpaceLLM_SOCIAL.git
cd REL-PUB_NoteSpaceLLM_SOCIAL
pip install -r requirements.txt
python main.py
```
