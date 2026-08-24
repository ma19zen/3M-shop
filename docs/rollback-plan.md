# Incident Response & Rollback Plan

## Detection

1. **UptimeRobot** alerts via email/Slack when `/api/health` returns non-200 status or is unreachable for 2+ consecutive checks
2. **Vercel Dashboard** shows build failures, function errors, or elevated error rates in real-time logs
3. **User reports** of application malfunction

## Rollback Steps

### Step 1: Identify the Failed Release
- Open Vercel Dashboard → Select the affected project (Backend, Frontend, or Review Service)
- Navigate to **Deployments** tab to see deployment history
- Identify the most recent deployment that correlates with the incident timestamp

### Step 2: Promote the Previous Deployment
- In the Deployments tab, locate the last known working deployment (the one before the failed release)
- Click the **"..."** menu on that deployment → Select **"Promote to Production"**
- Confirm the promotion — Vercel will instantly route all traffic to the previous version
- This takes effect immediately with zero downtime

### Step 3: Verify Recovery
- Confirm UptimeRobot shows the health endpoint returning OK
- Test critical user flows: login, product browsing, cart, checkout, reviews
- Check Vercel function logs for any remaining errors

### Step 4: Investigate and Fix
- Pull the failed commit locally, reproduce the issue
- Fix the bug on a new branch, open a PR
- CI/CD pipeline runs tests automatically
- Merge to `main` only after tests pass and the fix is verified in preview deployment

### Step 5: Communicate
- If customer-facing impact occurred, send a status update
- Document the incident: root cause, time to detect, time to resolve, preventive measures
