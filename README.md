# FocusGuard 🛡️

**FocusGuard** is a high-stakes, military-HUD-inspired task management desktop application built with Electron, React, and TypeScript. Designed for power users who need strict productivity enforcement, FocusGuard features a mandatory startup-blocking overlay, persistent local storage, and a striking, animation-rich "Command Center" aesthetic.

## ✨ Features

- **Mandatory Boot Overlay:** Launches automatically on Windows startup. A fullscreen, un-bypassable (no Alt-F4) splash screen forces you to review overdue and today's tasks before unlocking your computer.
- **Terminal/HUD Aesthetic:** Dark-mode first design utilizing custom CSS variables, scanline animations, typewriter effects, and `JetBrains Mono` typography.
- **Offline-First Persistence:** 100% local data storage using `electron-store`. No cloud syncing required; your data stays on your machine.
- **Advanced Task Management:** 
  - Full CRUD operations with categorized priority levels (Critical, High, Medium, Low).
  - Markdown Support in task descriptions, featuring GitHub Flavored Markdown (GFM) and syntax-highlighted code blocks for developers.
  - Recurring tasks (`daily`, `weekly`, `monthly`) that auto-spawn upon completion.
  - "In Progress" tracking and visual status toggling.
  - Custom Category Management.
- **Power User Features:**
  - **Global Quick Capture (Omnibar):** Press `Ctrl+Shift+Space` (or `Cmd+Shift+Space`) anywhere in your OS to instantly open a floating, Spotlight-style task capture bar. Type your task and hit Enter to add it without breaking your flow.
  - **Command Palette:** Press `Ctrl+K` inside the app to summon a sleek, searchable command palette. Navigate between pages, create tasks, and toggle themes entirely via the keyboard.
  - **Persona-Based Onboarding:** First-time setup tailors your initial categories and experience based on your role (Developer, Student, Executive, General).
- **Insights & Analytics:** Features a GitHub-style Heatmap Calendar for tracking completion streaks and Recharts-powered sparklines.
- **Background Operation:** Runs silently in the system tray, providing daily reminder notifications.

## 🛠️ Tech Stack

- **Framework:** [Electron](https://www.electronjs.org/) + [React 18](https://reactjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [electron-vite](https://electron-vite.org/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Styling:** Vanilla CSS + Custom Property System (HUD Theme)
- **Icons & Animations:** [lucide-react](https://lucide.dev/), [framer-motion](https://www.framer.com/motion/)
- **Storage:** `electron-store`

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- `npm` or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/FocusGuard.git
   cd FocusGuard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run in development mode:**
   ```bash
   npm run dev
   ```
   *This starts the Vite dev server and opens the Electron application with Hot Module Replacement (HMR).*

### Building for Production

To package the application into a standalone Windows `.exe` installer (using NSIS):

```bash
npm run build:win
```
The compiled installer will be available in the `dist/` directory (e.g., `dist/focusguard-1.0.0-setup.exe`).

## ⚙️ Architecture Highlights

- **Preload Bridge (`preload/index.ts`):** Secure IPC communication between the Node.js Main Process and React Renderer, exposing an isolated `window.api`.
- **Zustand Synchronization:** The frontend state seamlessly hydrates from the Electron IPC backend on startup via `useAppInit`.
- **Multi-Window Lifecycle:** The Main Process orchestrates a strict dual-window system, deliberately hiding the main dashboard until the `OverlayWindow` requirements are fulfilled.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.


