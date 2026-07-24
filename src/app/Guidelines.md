# Red Button — Safety & Operational Guidelines

**Status:** Draft for hackathon/prototype use. Not reviewed by legal counsel.
**Last updated:** 2026-07-24

This document defines how Red Button is intended to be used, what it does and does not guarantee, and the operational rules that keep it safe. It is a design and usage guide, not a legal contract — see `TERMS_AND_CONDITIONS.md` for that.

---

## 1. Purpose and scope

Red Button is a decision-support and escalation tool for industrial equipment emergencies. It retrieves guidance from equipment manuals and SOPs uploaded by an Admin, and can escalate serious situations to a human Shift Supervisor for confirmed action.

**Red Button is not:**
- A replacement for site emergency procedures, fire alarms, or official safety training.
- A certified safety system, medical device, or emergency dispatch service.
- A guarantee that any specific action is safe in every circumstance — physical conditions vary and the system cannot see or verify the real-world state of a machine.

**Red Button is:**
- A retrieval-grounded assistant that answers only from documentation an Admin has uploaded for that specific machine.
- An escalation router that gets the right human involved quickly, with the right context.

---

## 2. Roles and responsibilities

| Role | Responsibility |
|---|---|
| **Worker** | Uses the red button in good faith during genuine equipment issues. Follows official site safety procedures first; Red Button supplements but does not override them. |
| **Shift Supervisor** | Reviews and confirms or declines every actuation-adjacent action (emergency call, worker notification, backup request) before it fires. Responsible for the real-world judgment call, not the AI. |
| **Admin** | Responsible for uploading accurate, current manuals and SOPs, keeping equipment tags correctly mapped to machines, and managing user accounts and roles. |

The system is designed so that **no physical action is taken without a human confirming it.** The AI proposes; a named human approves. This allocation of responsibility is intentional and should not be changed without re-evaluating the whole safety model.

---

## 3. What the system will and won't do

### Advisory tier (autonomous)
- Retrieves and answers only from the specific machine's uploaded documentation, scoped by QR/NFC tag.
- Every answer is grounded in a citation back to the source document.
- If retrieval confidence is low, or the manual doesn't cover the question, the system says so and escalates to a human — it does not guess or fabricate an answer.

### Actuation-adjacent tier (supervisor-confirmed, always logged)
- `escalate_to_human` — pushes a live incident summary to the Shift Supervisor in-app.
- `call_emergency_services` — places an outbound call via the voice-call integration, only after Supervisor confirmation.
- `notify_nearest_workers` / `request_backup` — sends SMS notifications, only after Supervisor confirmation.

No tool in this tier fires automatically. Every action is logged with a timestamp, the proposing session, and the confirming Supervisor's identity.

### Explicitly out of scope
- The system does **not** control physical plant equipment, alarms, sprinklers, or any actuator. (`trigger_emergency_protocol` was removed from scope for this reason.)
- The system does **not** contact real emergency services (911 or local equivalent) in demo/test environments — only pre-configured, verified test numbers.

---

## 4. Escalation and timeout policy

- If a Shift Supervisor does not respond to a pending confirmation within the site-defined timeout window, the incident escalates according to a pre-agreed fallback policy (e.g., broadcast to all supervisors, or auto-approval for declared life-threat severity only). This fallback must be explicitly configured per site — it is not a silent default.
- All escalations, confirmations, timeouts, and fallback triggers are logged and included in the post-incident report.

---

## 5. Data handling guidelines

- Equipment manuals, incident transcripts, worker location/zone data, and voice/photo inputs may all be processed by the system. Treat all of this as sensitive operational data.
- Retention: define a clear retention period for incident transcripts and recordings (e.g., aligned with your workplace safety recordkeeping requirements) rather than keeping them indefinitely by default.
- Access to incident data should be role-gated: Workers see their own sessions; Supervisors see incidents for their shift/area; Admins see aggregate data for reporting, not necessarily raw transcripts.

---

## 6. Known limitations (disclose these openly)

- Answers are only as good as the manuals uploaded — outdated or incomplete documentation produces outdated or incomplete guidance.
- Voice/photo input quality affects the system's ability to understand the situation; noisy environments or poor image quality may degrade retrieval accuracy.
- Network or third-party service outages (voice call provider, SMS provider) can delay or prevent actuation-tier actions from completing. The system should fail loudly (visible error to Supervisor) rather than silently.
- This is a prototype. It has not undergone formal safety certification, penetration testing, or regulatory review.

---

## 7. Before any real (non-demo) deployment

- [ ] Legal review of liability allocation, especially for the emergency-call and notification features.
- [ ] Confirm compliance with local workplace safety and data protection law (e.g., handling of health-adjacent data from injury reports).
- [ ] Formal incident-response and escalation-timeout policy signed off by site safety officer.
- [ ] Security review of all MCP server integrations and third-party credentials.
- [ ] Written acknowledgment from users (via the Terms & Conditions) that the system is a supplement to, not a replacement for, site emergency procedures.