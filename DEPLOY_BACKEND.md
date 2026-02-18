Backend redeploy checklist (Railway)

1. Verify repository has latest backend changes pushed:
   - `git fetch && git status` on your deploy machine

2. Check Railway service logs for recent crash cause:
   - Open the Railway project dashboard -> Service -> Logs
   - Look for startup exceptions (DB connection, missing env)

3. Confirm environment variables on Railway:
   - `MONGODB_URI` and `MONGODB_DB` must be set (MongoDB is the only supported database now)
   - Any JWT secret or other secrets used by the app

4. Redeploy the service:
   - Using Railway UI: click "Deploy Latest" or trigger a redeploy
   - Or using Railway CLI (if configured): `railway up` in repo root

5. Tail the logs during startup and verify health:
   - Watch for `INFO: Uvicorn running on http://0.0.0.0:PORT`
   - Verify root endpoint returns 200: `curl -I https://<your-service>.railway.app/`

6. Update Vercel environment variable if backend URL changed:
   - In Vercel dashboard -> Project -> Settings -> Environment Variables
   - Set `NEXT_PUBLIC_API_URL` to the backend base URL
   - Redeploy the frontend (Production) after updating env

7. Smoke test endpoints from a separate machine:
   - `GET /posts/` should return 200
   - `POST /register` should return 201 when sending `{name,email,password}`

If you want, I can prepare a Railway redeploy command sequence or help run these steps interactively.
