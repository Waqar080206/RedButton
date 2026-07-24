# Session Handoff

**Project:** Red Button — AI-powered emergency assistant for industrial safety
**Event:** Hack for Good @ [hack-vsit.tech](https://hack-vsit.tech)
**Team:** Canon Event — Waqar Akhtar & Akshat Talwar

This file captures prior-session decisions and what was deliberately removed, so any
contributor (or future session) can resume without re-litigating settled questions.

---

## 1. Current State

- ✅ Expo app scaffolded with `create-expo-app` — **SDK 57** (React Native 0.86, React 19.2),
  TypeScript, `src/` layout, `expo-router` file-based routing.
- ✅ Architecture documented in `docs/ARCHITECTURE.md`.
- ✅ Design brief in `docs/Design_brief.md`, requirements in `docs/PRD.md`.
- ⏳ No feature code written yet (intentional — see decisions below).
- ⏳ Backend location **not yet decided**.

---

## 2. Decisions Made (do not revisit without reason)

| # | Decision | Rationale |
|---|---|---|
| D1 | **Expo SDK 57**, pinned | Latest at scaffold time; always check https://docs.expo.dev/versions/v57.0.0/ before writing Expo code (per `AGENTS.md`). |
| D2 | **Anthropic Claude** as LLM/RAG generation provider | Chosen by team; strong tool-use for the agentic MCP flow. |
| D3 | **Demo targets: Android + all-Expo** (iOS/web via Expo) | Primary demo on Android; keep universal. |
| D4 | **This session = architecture/plan only**, no feature code | Lock the design before building to avoid rework. |
| D5 | **Backend abstracted behind `services/api.ts`** | Location undecided ("wait for it"); keep app agnostic. |
| D6 | **Advisory vs actuation-adjacent tool split** | Fast in a crisis, safe + auditable for high-stakes actions. |
| D7 | **Citation-grounded answers only; confidence gate → escalate** | No hallucinated safety instructions — core safety guarantee. |

---

## 3. Deliberately Removed / Deferred

These were considered and **intentionally cut** from the hackathon scope:

- **Real hardware actuation** (physical alarms, sprinklers, evac systems) — *simulated and
  logged instead.* Wiring real industrial control systems is unsafe and out of scope for a hackathon.
- **Real emergency-services (911/112) dispatch** — *mocked with a pre-filled payload.* Cannot
  responsibly place real calls in a demo.
- **NFC in Expo Go** — NFC (`react-native-nfc-manager`) requires a **Dev Client build**; QR via
  `expo-camera` is the primary scan path for the demo, NFC is a stretch.
- **On-device model inference / full offline mode** — relies on the backend; only a **local
  cache of last-known SOPs** (`expo-sqlite`) is planned for connectivity gaps.
- **Multi-tenant org management, auth roles beyond worker/admin, billing** — not needed to prove the concept.
- **Backend implementation** — deferred until location is chosen (separate `/server`, Expo API
  routes, or external service).

---

## 4. Open Questions / Next Session

1. **Backend location** — separate `/server` (Node/TS), Expo API routes (`expo-server`), or external? (blocks RAG + MCP wiring)
2. **Vector store** choice (e.g. local SQLite-vec, pgvector, hosted).
3. **MCP transport** — how the app/backend reaches the MCP server.
4. Start build order per `ARCHITECTURE.md` §7 (recommended: app shell first with mocked backend).

---

## 5. Key References

- `docs/ARCHITECTURE.md` — system diagram, MCP tool contracts, app structure, RAG pipeline.
- `docs/Design_brief.md` — UX vision, screens, visual language.
- `docs/PRD.md` — functional/non-functional requirements.
- `AGENTS.md` — **must** read SDK 57 versioned docs before writing Expo code.
