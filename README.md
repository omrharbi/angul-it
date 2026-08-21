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

# ANGUL·IT

Multi-stage CAPTCHA built with Angular. Users complete three randomized challenges:

1. Text recognition
2. Math equation
3. Image symbol selection

Progress is saved in `localStorage`, so refreshes do not lose the current session. The `/result` route is protected until all stages are complete.

## Tech Stack

Angular, TypeScript, Signals, Angular Router, SCSS, and pure SVG.

## Getting Started

```bash
npm install
ng serve
```

Open http://localhost:4200.
## 🛠️ Tech Stack
