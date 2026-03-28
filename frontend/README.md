Frontend README
===============

Prerequisites
- Node.js 18+ (includes `npm`).

Quick start (npm)
1. Open a terminal in the repo root and change to the frontend folder:

```powershell
cd frontend
```

2. Install dependencies and start the dev server:

```powershell
npm install
npm run dev
```

Alternatives
- Using pnpm:

```powershell
pnpm install
pnpm dev
```

- Using yarn:

```powershell
yarn
yarn dev
```

Open: http://localhost:5173/ (Vite default)

Notes
- If `npm` is not on your PATH after installing Node, you can run it directly:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' install
& 'C:\Program Files\nodejs\npm.cmd' run dev
```

- The dev script is defined in package.json (`"dev": "vite"`).

  # Welcome screen design

  This is a Vite + React (TypeScript) frontend exported from the welcome-screen design bundle.
  ## Prerequisites

  - Node.js 18+ (or compatible LTS)
  - npm (or yarn/pnpm)

  ## Install

  From the repository root or the `frontend` folder, install dependencies:

  ```powershell
  cd frontend
  npm install
  ```

  ## Development

  Start the dev server (hot reload):

  ```powershell
  npm run dev -- --host
  ```

  Open the URL printed by Vite (usually http://localhost:5173).

  ## Build

  Create an optimized production build:

  ```powershell
  npm run build
  ```

  Preview the production build locally:

  ```powershell
  npm run preview
  ```

  ## Notes

  - If you use `yarn` or `pnpm`, replace `npm` commands accordingly.
  - The app entry is `src/main.tsx` and the app root is `src/app/App.tsx`.
  - To wire this frontend to a backend, set the API base URL via environment variables in a `.env` file (e.g., `VITE_API_BASE_URL`).

  ## Troubleshooting

  - If `npm` isn't available, install Node.js from https://nodejs.org/ or use a package manager.
  - For dependency issues, try removing `node_modules` and reinstalling:

  ```powershell
  rm -r node_modules package-lock.json
  npm install
  ```

  ## License

  See `ATTRIBUTIONS.md` for third-party attributions included with this bundle.
  