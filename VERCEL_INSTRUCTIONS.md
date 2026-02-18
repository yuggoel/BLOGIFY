# Vercel: set `NEXT_PUBLIC_API_URL` and redeploy

1) Dashboard (recommended):
   - Open your Vercel Project → Settings → Environment Variables.
   - Add a new variable:
     - Name: `NEXT_PUBLIC_API_URL`
     - Value: `https://web-production-97fe.up.railway.app`
     - Environment: set for `Production` (and `Preview`/`Development` if you want).
   - Save and then trigger a redeploy (Deployments → Trigger Redeploy or push a new commit).

2) Vercel CLI (interactive):
   - Install & login if not already:
     ```bash
     npm i -g vercel
     vercel login
     ```
   - Add env var (you will be prompted to paste the value):
     ```bash
     vercel env add NEXT_PUBLIC_API_URL production
     vercel env add NEXT_PUBLIC_API_URL preview
     vercel env add NEXT_PUBLIC_API_URL development
     ```
   - Redeploy production:
     ```bash
     vercel --prod
     ```

3) Post-deploy checks:
   - Visit your frontend URL and try signup/login.
   - Inspect DevTools → Network: requests should go to `https://web-production-97fe.up.railway.app`.
   - If still failing, inspect browser console and network error details (CORS, DNS, 502/504, etc.) and paste them here.
