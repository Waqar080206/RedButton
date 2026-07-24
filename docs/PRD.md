# Product Requirements Document — Red Button

**Event:** Hack for Good @ [hack-vsit.tech](https://hack-vsit.tech)
**Team:** Canon Event — Waqar Akhtar & Akshat Talwar
**Version:** 0.1 (hackathon) · **Status:** Draft

---

## 1. Summary

Red Button is a multimodal, RAG-based emergency assistant for industrial safety. Workers
trigger it during an emergency and receive instant, cited, machine-specific guidance via
voice, text, or photo — grounded strictly in real documentation. As an agent with a custom
MCP server, it can also *act*: escalate to humans, fire emergency protocols, dispatch help,
and generate compliance reports — with high-stakes actions human-verified and logged.

---

## 2. Goals & Non-Goals

### Goals
- G1. Deliver correct, **cited**, machine-scoped guidance in seconds during an emergency.
- G2. Accept **voice, text, and photo/video** input interchangeably.
- G3. **Never hallucinate** safety instructions; escalate to a human when confidence is low.
- G4. Enable the agent to take **real-world actions** safely via an auditable MCP server.
- G5. Let admins **populate and maintain** the knowledge base (manuals/SOPs per machine).

### Non-Goals (hackathon)
- Real hardware/utility actuation (simulated + logged).
- Real emergency-services dispatch (mocked payload).
- Multi-tenant org management, billing, advanced RBAC.
- Full on-device/offline inference.

---

## 3. Personas

- **Worker** — triggers Red Button, asks questions, follows guidance.
- **Safety Officer** — receives live escalations, verifies actuation-adjacent actions.
- **Admin** — uploads/tags manuals, reviews incidents and reports.

---

## 4. Functional Requirements

### 4.1 Emergency Entry
- FR1. A full-screen **Red Button** is the app's default home; single tap opens the chat.
- FR2. Hold-to-confirm for actuation-adjacent actions to prevent accidental triggers.
- FR3. Haptic feedback on trigger (`expo-haptics`).

### 4.2 Machine Scoping
- FR4. Scan **QR** (`expo-camera`) to set the active `machine_id`.
- FR5. **NFC** scan supported in a Dev Client build (stretch; `react-native-nfc-manager`).
- FR6. Capture **location** (`expo-location`) at scan/trigger time.
- FR7. All retrieval and answers are **scoped to the active `machine_id`**.

### 4.3 Multimodal Chat
- FR8. **Text** input via composer.
- FR9. **Voice** input: record (`expo-audio`) → transcribe → send.
- FR10. **Photo/video** input (`expo-image-picker`, `expo-video`) attached to a message.
- FR11. **TTS** playback of guidance (`expo-speech`).
- FR12. Guidance rendered as short, numbered steps.

### 4.4 Grounding, Citations & Confidence
- FR13. Every answer displays **citations** (source doc + page/section) via a citation card.
- FR14. Answers are generated **only** from retrieved documentation.
- FR15. A **confidence gate**: below threshold, the app shows an "escalating to a human" banner
  and invokes `escalate_to_human` instead of answering.

### 4.5 Agentic Tools (MCP)
- FR16. **Advisory** tools may be called autonomously by the agent.
- FR17. **Actuation-adjacent** tools require **human verification** before execution.
- FR18. Every tool call is written to an **immutable audit log** (`timestamp, caller, args, result, verifier?`).
- FR19. Tools implemented (contracts in `ARCHITECTURE.md` §3):
  - Live: `escalate_to_human`, `trigger_emergency_protocol`, `call_emergency_services`,
    `notify_nearest_workers`, `request_backup`.
  - Post-incident: `schedule_debrief`, `generate_incident_report`.

### 4.6 Admin
- FR20. Upload manuals/SOPs (`expo-document-picker`, `expo-file-system`); tag to a `machine_id`.
- FR21. Ingested docs are chunked, embedded, and stored with machine metadata.
- FR22. View incident log with transcripts.
- FR23. Generate an **OSHA-style incident report** draft for human sign-off.

---

## 5. Non-Functional Requirements

| ID | Requirement | Target |
|---|---|---|
| NFR1 | Time-to-first-guidance | ≤ ~3 s after query on a normal connection |
| NFR2 | Accessibility | High contrast, large targets, TTS, works with gloves/noise |
| NFR3 | Auditability | 100% of MCP tool calls logged, immutable |
| NFR4 | Safety | No answer without citation; low confidence always escalates |
| NFR5 | Security | Least-privilege MCP auth; app never holds emergency-system credentials; secrets in `expo-secure-store` |
| NFR6 | Resilience | Local cache of last-known SOPs for connectivity gaps (`expo-sqlite`) |
| NFR7 | Platforms | Android primary; iOS/web via Expo |
| NFR8 | Versioning | Pinned to Expo SDK 57; verify against versioned docs |

---

## 6. Success Metrics (demo)
- SM1. Worker gets a cited answer for a scanned machine in a live demo.
- SM2. A low-confidence question visibly escalates instead of guessing.
- SM3. An actuation-adjacent tool fires behind a human-verify step and appears in the audit log.
- SM4. A post-incident report is generated from a transcript.

---

## 7. Dependencies & Risks

| Risk | Mitigation |
|---|---|
| Several native features need a **Dev Client build** (camera, audio, location, NFC, notifications) | Build with `npx expo run:android`; note Expo Go limits |
| Backend location undecided | App abstracted behind `services/api.ts`; decide before RAG/MCP wiring |
| Transcription/TTS quality | Backend transcription; keep steps short for TTS |
| Time constraints (hackathon) | Prioritize per `ARCHITECTURE.md` §7 build order |

---

## 8. Related Docs
- `ARCHITECTURE.md` — technical design & MCP contracts.
- `Design_brief.md` — UX vision & screens.
- `SESSION_HANDOFF.md` — decisions & deliberately-removed scope.
