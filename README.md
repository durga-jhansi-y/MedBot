MedBot
======

This repository contains the MedBot project. It includes a frontend built with Vite and React.

Frontend
--------

Prerequisites
- Node.js 18+ (includes `npm`).

Quick start (npm)
1. Open a terminal in the repo root and change to the frontend folder:

```powershell
cd frontend
```

2. Install dependencies (use the legacy-peer-deps flag if you hit peer dependency errors) and start the dev server:

```powershell
npm install --legacy-peer-deps
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
- If PowerShell reports that running scripts is disabled when invoking `npm`, run:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

- Alternatively, invoke the npm wrapper directly (no policy change required):

```powershell
& 'C:\Program Files\nodejs\npm.cmd' install --legacy-peer-deps
& 'C:\Program Files\nodejs\npm.cmd' run dev
```

- The dev script is defined in `frontend/package.json` (`"dev": "vite"`).
