# Getting Started — Red Button

How to run the **Red Button** Expo app locally. This is the *how-to-start* guide; for
*what* we're building and *why*, see the docs in [`docs/`](docs/).

> Stack: **Expo SDK 57** (React Native 0.86, React 19.2), TypeScript, `expo-router`.
> Always consult the versioned docs at
> [docs.expo.dev/versions/v57.0.0](https://docs.expo.dev/versions/v57.0.0/) before writing Expo code.

---

## 1. Prerequisites

| Tool | Version needed | Check |
|---|---|---|
| **Node.js** | 20+ (24 confirmed working) | `node -v` |
| **npm** | 10+ (11 confirmed working) | `npm -v` |
| **Git** | any recent | `git --version` |

For running on a **device or emulator** (beyond the browser):

- **Android:** [Android Studio](https://docs.expo.dev/workflow/android-studio-emulator/) with an emulator, or a physical device with USB debugging.
- **iOS (macOS only):** Xcode + [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/).
- **Quick preview:** the [Expo Go](https://expo.dev/go) app on your phone (limited — see §5).

---

## 2. Install

From the project root (`C:\Code\RedButton`):

```bash
npm install
```

This installs everything in `package.json`. `node_modules/` is git-ignored, so this
step is required on a fresh clone.

---

## 3. Run

Start the Metro dev server:

```bash
npx expo start
```

Then choose a target from the interactive menu (or use a shortcut script):

| Command | Target |
|---|---|
| `npm run web` | Browser (fastest to iterate; no native modules) |
| `npm run android` | Android emulator / connected device |
| `npm run ios` | iOS Simulator (macOS only) |
| press `w` / `a` / `i` in the `expo start` terminal | web / android / ios |

The app entry is `expo-router/entry`; screens live in **`src/app/`** using
[file-based routing](https://docs.expo.dev/router/introduction). Save a file and it
hot-reloads.

---

## 4. Useful commands

```bash
npm run web        # start on web
npm run android    # start on Android
npm run ios        # start on iOS (macOS)
npm run lint       # expo lint
npm run reset-project   # move starter code to app-example/ and reset src/app (destructive)
npx expo start -c  # start with cache cleared (fixes weird Metro errors)
```

---

## 5. Native features need a Dev Client build ⚠️

Several planned features **do not work in Expo Go** and require a custom Dev Client:
camera (QR scan), audio recording, location, NFC, and push notifications.

When you start wiring those up, build a dev client instead of using Expo Go:

```bash
npx expo run:android   # builds + installs a dev client on Android
npx expo run:ios       # macOS only
```

See the [development builds guide](https://docs.expo.dev/develop/development-builds/introduction/).
Until then, **web** and **Expo Go** are fine for the app shell and UI work.

---

## 6. Project layout

```
src/
  app/            # screens (file-based routing) — index.tsx is the home route
  components/     # shared UI (themed text/view, tabs, links, etc.)
  constants/      # theme.ts
  hooks/          # use-color-scheme, use-theme
docs/             # PRD, ARCHITECTURE, Design brief, session handoff
assets/           # icons + images
app.json          # Expo app config
```

The planned target structure (Red Button home, machine scan, scoped chat, admin, MCP
tools) is described in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) §4. Feature code
is **not written yet** — see [`docs/SESSION_HANDOFF.md`](docs/SESSION_HANDOFF.md) for
current state and open decisions (notably: backend location is still TBD).

---

## 7. Troubleshooting

- **Metro / bundler acting up:** `npx expo start -c` (clears cache).
- **Dependency version mismatch warnings:** run `npx expo install --check` and let it
  align packages to SDK 57.
- **A native module errors in Expo Go:** it probably needs a Dev Client build (see §5).
- **Stale `node_modules`:** delete it and `package-lock.json`, then `npm install`.

---

## 8. Where to read next

| Doc | Purpose |
|---|---|
| [`README.md`](README.md) | Project pitch & overview |
| [`docs/PRD.md`](docs/PRD.md) | Requirements (functional + non-functional) |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | System design, MCP tools, app structure, build order |
| [`docs/Design_brief.md`](docs/Design_brief.md) | UX vision, screens, visual language |
| [`docs/SESSION_HANDOFF.md`](docs/SESSION_HANDOFF.md) | Decisions made & scope deliberately cut |
| [`AGENTS.md`](AGENTS.md) | ⚠️ Read SDK 57 versioned docs before writing Expo code |
