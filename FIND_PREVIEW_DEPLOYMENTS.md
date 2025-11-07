# How to Find Preview Deployments in Vercel 🔍

## Quick Answer

You're already on a preview deployment! The URL you're using:
```
https://icona-a70m7wbos-piet-maries-projects.vercel.app/
```

This **IS** a preview deployment URL. Preview URLs have this format:
- `icona-{hash}-piet-maries-projects.vercel.app`
- Or `icona-git-{branch-name}-piet-maries-projects.vercel.app`

---

## How to Find Preview Deployments

### Method 1: Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Click on your **ICONA** project

2. **Go to Deployments Tab:**
   - Click **"Deployments"** in the top navigation
   - You'll see a list of all deployments

3. **Find Preview Deployments:**
   - **Production deployments** show: `www.useicona.com` or `useicona.com`
   - **Preview deployments** show: `icona-*.vercel.app` (like the one you're using)
   - Preview deployments have a **branch name** or **PR number** next to them

4. **Click on a Preview Deployment:**
   - Click the three dots (`...`) next to a preview deployment
   - Click **"Visit"** to open the preview URL
   - Or copy the URL from the deployment card

### Method 2: From GitHub Pull Request

1. **Create a Pull Request:**
   - Push changes to a branch
   - Create a PR on GitHub

2. **Vercel Bot Comments:**
   - Vercel automatically comments on your PR
   - The comment includes a **"Preview"** link
   - Click it to visit the preview deployment

### Method 3: From Vercel CLI

If you have Vercel CLI installed:
```bash
vercel ls
```

This shows all deployments with their URLs.

---

## Understanding Preview URLs

### Preview URL Format:
```
https://icona-{hash}-{team-name}.vercel.app
```

Examples:
- `https://icona-a70m7wbos-piet-maries-projects.vercel.app` ← You're using this!
- `https://icona-git-feature-branch-piet-maries-projects.vercel.app`
- `https://icona-pr-123-piet-maries-projects.vercel.app`

### Production URL:
```
https://www.useicona.com
```

---

## Preview vs Production

| Type | URL Format | Keys Used | Test Cards Work? |
|------|------------|-----------|-------------------|
| **Preview** | `icona-*.vercel.app` | Test keys (`pk_test_...`) | ✅ Yes |
| **Production** | `www.useicona.com` | Live keys (`pk_live_...`) | ❌ No |

---

## Your Current Situation

You're using:
```
https://icona-a70m7wbos-piet-maries-projects.vercel.app/
```

This is a **preview deployment**, which means:
- ✅ Uses **test keys** automatically
- ✅ Test cards (`4242 4242 4242 4242`) will work
- ✅ Should show "Test Mode" badge
- ✅ Perfect for testing!

---

## Finding All Preview Deployments

1. **Vercel Dashboard → Deployments:**
   - Scroll through the list
   - Look for URLs ending in `.vercel.app` (not `useicona.com`)
   - Each one is a preview deployment

2. **Filter by Branch:**
   - In the Deployments tab, you can filter by branch
   - Each branch gets its own preview URL

3. **Check PR Comments:**
   - If you have open PRs, check the Vercel bot comments
   - They include preview URLs

---

## Quick Tips

- **Preview URLs are temporary** - they're deleted after the branch/PR is merged or deleted
- **Each branch/PR gets its own preview URL** - so you can test multiple features simultaneously
- **Preview URLs automatically use test keys** - perfect for testing without affecting production
- **You can share preview URLs** - great for getting feedback before merging to production

---

## If You Can't Find a Preview Deployment

1. **Create a new branch:**
   ```bash
   git checkout -b test-preview
   git push origin test-preview
   ```

2. **Vercel automatically creates a preview:**
   - Go to Vercel Dashboard → Deployments
   - You'll see a new deployment with the preview URL

3. **Or create a Pull Request:**
   - Create a PR on GitHub
   - Vercel bot will comment with the preview URL

---

## Summary

**You're already using a preview deployment!** The URL `https://icona-a70m7wbos-piet-maries-projects.vercel.app/` is a preview.

To find others:
1. Go to Vercel Dashboard → Deployments
2. Look for URLs ending in `.vercel.app` (not `useicona.com`)
3. Click "Visit" to open them

Preview deployments are perfect for testing because they automatically use test keys! 🎉

