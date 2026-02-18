## Deployment diagnostics & actions

1) Quick connectivity checks (already ran):
   - `nslookup web-production-97fe.up.railway.app` — DNS timed out for my default resolver, but host resolves to `66.33.22.211` via system resolver.
   - `ping web-production-97fe.up.railway.app` — responded (IP reachable).
   - HTTP(s) requests timed out — the host is reachable at network level but the service is not responding to HTTP requests.

2) Likely causes on Railway:
   - Service crashed on startup (missing env vars: `MONGODB_URI` or other secrets).
   - App is running but blocked (DB connection hangs) causing timeouts.
   - Firewall or platform routing issue (rare).

3) Actions to perform in Railway (recommended order):
   a. Open Railway project → Service → Logs. Look for errors during startup (stack traces, missing env vars).
   b. Confirm environment variables: `MONGODB_URI`, `MONGODB_DB`, any JWT secrets.
   c. If logs show long DB connection timeouts, verify DB network (Mongo Atlas whitelist or Supabase credentials).
   d. Trigger a redeploy and watch logs during startup.
   e. After a successful deploy, verify root endpoint:
      - `curl -v https://<railway-url>/` or use the browser.

4) If you paste Railway logs here I can analyze them and point exactly to missing envs or crash causes.

5) Once Railway backend is healthy, set `NEXT_PUBLIC_API_URL` in Vercel to the backend URL and redeploy the frontend (instructions in `VERCEL_INSTRUCTIONS.md`).
