# Red Button — Design Brief

**Event:** Hack for Good @ [hack-vsit.tech](https://hack-vsit.tech)
**Team:** Canon Event — Waqar Akhtar & Akshat Talwar
**Stack:** Expo SDK 57 (React Native 0.86, React 19.2) · Anthropic Claude · Custom MCP server

---

## 1. Product Vision

When something goes wrong on a factory floor, workers face a dangerous gap: critical
safety information is buried in 200-page manuals, and there's no time to search during
an emergency. **Seconds matter.**

Red Button is a multimodal, RAG-based emergency assistant. Workers hit a physical/virtual
"red button," and get **instant, cited, machine-specific guidance** via voice, text, or
photo — grounded strictly in real documentation, never guessed. It's not just a chatbot:
it's an **agent with real-world tools** (via a custom MCP server) that can *act*, not
just advise.

---

## 2. Target Users

| Persona | Goal | Context |
|---|---|---|
| **Floor Worker** | Get correct, fast guidance during a crisis | Panicked, gloved hands, noisy floor, one hand free |
| **Safety Officer / Supervisor** | Situational awareness + control | Receives live escalations, verifies high-stakes actions |
| **Plant Admin** | Populate & maintain knowledge base | Uploads manuals/SOPs, tags to machines, reviews incidents |

---

## 3. Core Experience Principles

1. **Zero-friction entry** — the Red Button is the whole home screen. One tap in a crisis.
2. **Machine-scoped truth** — scanning a QR/NFC tag narrows guidance to *this* machine only.
3. **Grounded or nothing** — every answer cites its source; low confidence → escalate to a human.
4. **Multimodal by default** — voice, text, and photo/video are equal first-class inputs.
5. **Fast but safe** — advisory actions are instant; high-stakes actions are human-verified and logged.
6. **Calm under pressure** — high-contrast, large targets, minimal text, haptic + audio feedback.

---

## 4. Visual & Interaction Language

- **Color:** Emergency red primary (`#E11900`-class), high-contrast dark surfaces, amber for
  "escalating," green for "grounded/confident."
- **Typography:** Large, legible, minimal words. Guidance shown as short numbered steps.
- **Targets:** Oversized tap zones; hold-to-confirm on destructive/actuation actions.
- **Feedback:** Haptics (`expo-haptics`) on button press; TTS (`expo-speech`) reads steps aloud.
- **Motion:** Restrained — a pulsing Red Button; no decorative animation during an incident.

---

## 5. Key Screens

| Screen | Purpose |
|---|---|
| **Red Button (home)** | Full-screen emergency trigger + quick machine scan |
| **Scan** | QR/NFC capture → sets machine scope + location |
| **Emergency Chat** | Multimodal, machine-scoped conversation with citations & confidence banner |
| **Admin: Manuals** | Upload/manage manuals & SOPs, tag to machines |
| **Admin: Incidents** | Incident log, transcripts, generated reports |

---

## 6. Signature Moments (demo highlights)

1. Scan machine → hit Red Button → speak "there's smoke coming from the motor."
2. App answers with **cited steps** from that machine's manual, read aloud.
3. Confidence gate: an ambiguous question → app **escalates to the safety officer** instead of guessing.
4. Agent fires an **actuation-adjacent tool** (e.g. `trigger_emergency_protocol`) behind a human-verify confirm — logged to the audit trail.
5. Post-incident: one tap generates an **OSHA-style report** draft.

---

## 7. Out of Scope (for the hackathon build)

- Production integration with real factory alarm/sprinkler hardware (simulated + logged).
- Real emergency-services dispatch (mocked with pre-filled payload).
- Multi-tenant org management / billing.
- Full offline model inference (relies on backend; local cache only for last-known SOPs).

See `SESSION_HANDOFF.md` for the rationale behind what was deliberately removed.
See `ARCHITECTURE.md` for the technical design and `PRD.md` for detailed requirements.
