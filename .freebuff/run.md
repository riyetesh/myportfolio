# Run doc — myportfolio (Next.js 16)

## Reproduce the artifacts a fresh checkout needs

1. Install dependencies with npm (the repo uses `package-lock.json`):

   ```
   npm install
   ```

2. No environment files are needed — the site is a static-content portfolio with no backend and no `.env*` files in the repo. Nothing to copy from the main checkout.

3. No build step is required for preview; `next dev` compiles on demand.

## Run the server

1. Default port is 3000 (`next dev`). **Important:** this environment exports `PORT=0`, which Next.js interprets as "assign a random ephemeral port" (e.g. 53084) with no warning. Always pin the port explicitly: `npm run dev -- -p 3000`. If 3000 is busy, pick a free one and pass it instead.

2. Start the server detached (Windows, PowerShell; stdout and stderr must go to different files):

   ```
   powershell -NoProfile -Command "(Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev','--','-p','3000' -RedirectStandardOutput '<workspace>\ .freebuff\preview.log'.Replace(' ','') -RedirectStandardError '<workspace>\ .freebuff\preview.log.err'.Replace(' ','') -WindowStyle Hidden -PassThru).Id"
   ```

   Run from the project root so Next.js picks up the app. It prints the pid.

3. Confirm the process survived: `powershell -NoProfile -Command "Get-Process -Id <pid>"`.

4. Wait until `http://localhost:3000` answers HTTP 200, then register the preview with that URL and the pid.
