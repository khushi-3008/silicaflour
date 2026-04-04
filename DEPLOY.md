# Deployment: GitHub Pages + Vercel

This site is static HTML/CSS/JS. You can deploy it in two ways. **Pick one host for your custom domain** (`silicaflour.in`) so DNS points to a single place; the other can stay as a free `*.github.io` or `*.vercel.app` URL for backups or previews.

---

## Part A — GitHub Pages

### A1. One-time: create the repository and push

1. On GitHub: **New repository** (e.g. `silicaflour-site`), default branch `main`, empty or with a README.
2. On your machine (from this project folder):

   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USER>/<YOUR_REPO>.git
   git push -u origin main
   ```

### A2. Choose how Pages is built

**Option 1 — Simplest (no Actions): deploy from branch**

1. **Settings → Pages → Build and deployment**
2. **Source**: *Deploy from a branch*
3. **Branch**: `main`, folder **`/ (root)`**
4. Save. Every `git push` to `main` updates the site in about a minute.

**Option 2 — Automated via GitHub Actions (this repo includes a workflow)**

The file [`.github/workflows/deploy-github-pages.yml`](.github/workflows/deploy-github-pages.yml) deploys on every push to `main`.

1. Push the repo including `.github/workflows/deploy-github-pages.yml`.
2. **Settings → Pages → Build and deployment**
3. **Source**: **GitHub Actions** (not “Deploy from branch”).
4. Open the **Actions** tab once; approve workflow permissions if GitHub asks.
5. After the first successful run, the site URL appears under **Settings → Pages**.

If you switch from “branch” to “Actions”, disable the old branch source so only one method is active.

### A3. Custom domain + HTTPS (`silicaflour.in`)

1. Keep **`CNAME`** in the repo root with:

   ```text
   silicaflour.in
   ```

2. **Settings → Pages → Custom domain**: enter `silicaflour.in`, save.
3. At your DNS host, add the records [GitHub documents for Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) (apex **A** records to GitHub IPs, or **ALIAS/ANAME** to `<user>.github.io` if your provider supports it).
4. When DNS checks pass, enable **Enforce HTTPS**.

### A4. What “automated” means on GitHub Pages

| Trigger        | Result                                      |
|----------------|---------------------------------------------|
| `git push` to `main` | New files go live (branch or Actions deploy) |

No separate build step is required for this project unless you add one later.

---

## Part B — Vercel

### B1. One-time: connect GitHub

1. Sign in at [vercel.com](https://vercel.com/) (GitHub login is fine).
2. **Add New → Project → Import** your repository.
3. **Framework Preset**: *Other* (or “Other” / no framework).
4. **Root Directory**: `.` (repository root).
5. **Build Command**: leave **empty** (static files only).
6. **Output Directory**: leave **empty** (not applicable for plain static at root).
7. **Install Command**: leave **empty** if there is no `package.json`.
8. **Deploy**. Vercel assigns a URL like `https://<project>-<team>.vercel.app`.

### B2. Automated deploys on Vercel

| Trigger | Result |
|--------|--------|
| Push to the **production branch** (usually `main`) | New **production** deployment |
| Pull request | **Preview** deployment (unique preview URL) |

No extra YAML is required in the repo for basic static hosting; Vercel runs automatically after import.

### B3. Custom domain on Vercel (only if this is your primary host)

If **`silicaflour.in` is already on GitHub Pages**, do **not** point the same apex to Vercel unless you remove it from GitHub first—one hostname should resolve to one service.

1. Project **Settings → Domains → Add** `silicaflour.in` (and `www` if you use it).
2. Apply the **DNS records** Vercel shows (often **A** for apex and **CNAME** for `www`).
3. Wait for verification; Vercel provisions HTTPS automatically.

### B4. Contact form on either host

The form posts to **Formspree** (see below). It works the same on GitHub Pages and Vercel. Optional: add a serverless `/api/contact` on Vercel only if you drop Formspree (extra code and env vars).

---

## Part C — Formspree (both hosts)

1. Create a form at [Formspree](https://formspree.io/).
2. In **`contact.html`**, set `action` to `https://formspree.io/f/<your-id>`.
3. **`_next`** should match your **live** site URL (e.g. `https://silicaflour.in/contact.html?thanks=1`).

---

## Summary: GitHub Pages vs Vercel

| | GitHub Pages | Vercel |
|---|--------------|--------|
| **Auto deploy** | On push to `main` (branch or Actions) | On push to `main`; PR previews |
| **Setup** | Enable Pages + optional Actions workflow | Import repo once |
| **Custom domain** | CNAME file + DNS to GitHub | Add domain in dashboard + DNS to Vercel |
| **Good for** | Simple static sites tied to GitHub | Previews, teams, future serverless APIs |

Use **one** primary domain target for `silicaflour.in`; use the other platform without a custom domain if you want a mirror or staging URL.

---

## Troubleshooting

- **Pages Actions fail**: **Settings → Actions → General** → allow workflows; **Pages** source must be **GitHub Actions** when using the included workflow.
- **404 on deep links**: This site uses `*.html` URLs; both hosts serve them as static files—no extra rewrite needed.
- **Form redirect after submit**: `contact.html` `_next` must use the exact URL visitors use (custom domain vs `github.io` vs `vercel.app`).

DNS details change over time; follow current [GitHub Pages custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) and [Vercel domains](https://vercel.com/docs/domains/working-with-domains) documentation.
