# Deployment: GitHub Pages + Vercel

This site is a **single-page** static app: all content lives in **`index.html`** (anchor sections). There is no build step—only **`assets/css/styles.css`**, **`assets/js/main.js`**, and optional images.

You can deploy in two ways. **Pick one host for your custom domain** (`silicaflour.in`) so DNS points to a single place; the other can stay as a free `*.github.io` or `*.vercel.app` URL for backups or previews.

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
2. In **`index.html`** (contact section form), set `action` to `https://formspree.io/f/<your-id>` (replace `YOUR_FORMSPREE_ID`).
3. **`_next`** should match your **live** home URL with the thank-you query string, e.g. **`https://silicaflour.in/?thanks=1`**. That shows the success message in the **Contact** section after redirect.
4. If you test on `*.github.io` or `*.vercel.app` before the custom domain is live, temporarily set `_next` to that origin with `/?thanks=1`.

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
- **404 on old URLs**: Older deployments may have linked to `about.html`, `contact.html`, etc. Those files were removed; use **`/`** only. Optionally add static redirects on the host if you need legacy URLs.
- **Form redirect after submit**: The form’s `_next` must use the exact origin visitors use (custom domain vs `github.io` vs `vercel.app`), always ending with **`/?thanks=1`**.
- **Vercel / “main.py” / Python runtime**: This project has **no** Python files. If a platform tries to run Python, set the project to **Other** / static and remove any accidental `main.py` or `requirements.txt` from the repo.

DNS details change over time; follow current [GitHub Pages custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) and [Vercel domains](https://vercel.com/docs/domains/working-with-domains) documentation.
