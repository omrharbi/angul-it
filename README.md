# ANGUL·IT — Multi-Stage CAPTCHA System

A multi-stage CAPTCHA web application built from scratch with **Angular 17**, designed to distinguish real users from automated bots through visual and logical challenges.

---

## 🧠 What It Does

ANGUL·IT presents users with **3 sequential challenge stages**. Each stage tests a different human ability that bots struggle to replicate. The user must pass the challenges to be verified as human.

The challenge order is **randomized every session**, and progress is **saved in localStorage** so refreshing the page never loses your progress.

---

## 🚀 Live Challenge Stages

### Stage 1 — Text Recognition
A distorted text code is rendered using **pure SVG** (no canvas, no external libraries). Random rotation, font size, color, noise lines, and dots are applied to each character to make OCR difficult for bots. The user reads and types the code.

### Stage 2 — Math Challenge
A random arithmetic equation is generated (`+`, `-`, `×`). The user solves it and types the answer. Difficulty scales randomly per session.

### Stage 3 — Image Selection
A 3×3 grid of symbols is displayed. The user must identify and select **all cells matching the target symbol**. The grid is randomized with 2–4 correct cells per challenge.

---

## ⚙️ How It Works

```
Home Page
  ↓ user clicks BEGIN CHALLENGE
Captcha Page
  ↓ Stage 1 → Stage 2 → Stage 3
  ↓ each stage validated before moving forward
Result Page
  ↓ score displayed + challenge breakdown
  ↓ user can restart or go home
```

Progress is tracked using a **service + localStorage** combination. If the user refreshes mid-challenge, they resume exactly where they left off. The result page is **route-guarded** — direct access without completing the challenge redirects back to the captcha page.

---

## 🛠️ Tech Stack

| Tool | Usage |
|---|---|
| Angular 17 | Framework |
| TypeScript | Language |
| Angular Signals | Reactive state management |
| Angular Router | Navigation + route guards |
| localStorage | Progress persistence |
| Pure SVG | Text CAPTCHA rendering |
| SCSS | Styling |

> No external CAPTCHA libraries used. Everything is built from scratch.

---

## 📁 Project Structure

```
src/app/
├── core/
│   ├── services/
│   │   └── captcha-state.ts     ← shared state + localStorage
│   └── guards/
│       └── captcha-guard.ts     ← protects /result route
├── pages/
│   ├── home/                    ← landing page
│   ├── captcha/                 ← stage manager
│   └── result/                  ← score summary
└── challenge/
    ├── text-captcha/            ← SVG text challenge
    ├── math-captcha/            ← equation challenge
    └── image-captcha/           ← symbol grid challenge
```

---

## 🔒 Security Features

- Route guard blocks direct access to `/result`
- Session resets on returning to home page
- Challenge order randomized per session
- Wrong answers regenerate a new challenge automatically

---

## 🏁 Getting Started

```bash
# Install dependencies
npm install

# Run development server
ng serve

# Open in browser
http://localhost:4200
```

---

## 📖 Learning Objectives Covered

- Angular standalone components
- Signals and computed values
- `@Input()` / `@Output()` between components
- Reactive Forms and input validation
- Route guards with `CanActivateFn`
- State persistence with localStorage
- Pure SVG generation from TypeScript
- Responsive SCSS design system

---

## 👤 Author

Built as a learning project to master Angular 17 fundamentals through a real-world CAPTCHA implementation.