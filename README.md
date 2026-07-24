# 🔴 Red Button

**AI-powered emergency assistant for industrial safety.**

> Built for **Hack for Good** @ [hack-vsit.tech](https://hack-vsit.tech)
> by **Team Canon Event** — Waqar Akhtar & Akshat Talwar.

---

## The Problem

When something goes wrong on a factory floor, workers face a dangerous gap: critical safety
information is buried in 200-page manuals, and there's no time to search during an emergency.
**Seconds matter.**

## The Solution

A multimodal, RAG-based emergency chatbot that admins populate with equipment manuals and
SOPs. Workers hit a **Red Button** during an emergency and get instant, cited, machine-specific
guidance via **voice, text, or photo** — grounded strictly in real documentation, never guessed.

But it doesn't stop at conversation. It's an **agent with real-world tools**, connected via a
custom **MCP server**, so it can *act* — not just advise.

## Core Tech

- **Machine-scoped RAG** — QR/NFC-tagged equipment → scoped retrieval.
- **Multimodal input** — voice, text, photo/video.
- **Citation-grounded answers** — no hallucinated safety instructions.
- **Confidence-gated responses** — escalates to a human instead of guessing.

## Agentic Tools (MCP Server)

**Live escalation** — `escalate_to_human`, `trigger_emergency_protocol`,
`call_emergency_services`, `notify_nearest_workers`, `request_backup`.
**Post-incident** — `schedule_debrief`, `generate_incident_report`.

Tools are split into **advisory** (agent can call autonomously) and **actuation-adjacent**
(escalation, protocols, dispatch — high-stakes, human-verifiable, always logged). This keeps
the system fast in a crisis while staying safe and auditable.

---

## Tech Stack

- **App:** [Expo](https://expo.dev) SDK 57 (React Native 0.86, React 19.2), TypeScript, `expo-router`.
- **AI:** Anthropic Claude (RAG generation + agentic tool use).
- **Tools:** Custom MCP server (backend location TBD).

## Documentation

| Doc | Purpose |
|---|---|
| [docs/Design_brief.md](docs/Design_brief.md) | UX vision, personas, screens, visual language |
| [docs/PRD.md](docs/PRD.md) | Functional & non-functional requirements |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, MCP tool contracts, app structure, RAG pipeline |
| [docs/SESSION_HANDOFF.md](docs/SESSION_HANDOFF.md) | Prior-session decisions & deliberately-removed scope |

---

## Get Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

Open in a [development build](https://docs.expo.dev/develop/development-builds/introduction/),
[Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/),
[iOS simulator](https://docs.expo.dev/workflow/ios-simulator/), or [Expo Go](https://expo.dev/go).

> ⚠️ Several native features (camera, audio, location, NFC, notifications) require a
> **Dev Client build** (`npx expo run:android`) and won't work in Expo Go.

App source lives in the `src/app` directory using [file-based routing](https://docs.expo.dev/router/introduction).

> **Note:** Always consult the versioned docs at
> [docs.expo.dev/versions/v57.0.0](https://docs.expo.dev/versions/v57.0.0/) before writing Expo code.

---

## Team

**Canon Event** — Waqar Akhtar · Akshat Talwar
