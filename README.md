# SR-ONE Consultancy — Website

A complete, responsive marketing site for SR-ONE Consultancy, built with plain
HTML, CSS and vanilla JavaScript (no framework, no build step) so it's easy
to edit yourself later.

```
srone-website/
├── index.html                 ← all page content and structure
├── style.css                  ← all styling (colors are CSS variables at the top)
├── script.js                  ← all interactivity + the CONFIG block
├── assets/
│   ├── srone-icon.svg         ← icon-only mark (used as favicon)
│   ├── srone-logo.svg         ← horizontal logo, light-background version (navbar)
│   ├── srone-logo-dark.svg    ← horizontal logo, dark-background version (footer)
│   ├── images/                ← empty folder, ready for any photos you add later
│   └── icons/                 ← empty folder, ready for any extra icons you add later
├── google-apps-script/
│   └── Code.gs                ← backend script: saves leads to Sheets + emails you
└── README.md                  ← this file
```

---

## 1. Where to edit things

Everything is commented. In short:

| I want to change...            | Edit this file        | Look for...                          |
|---------------------------------|------------------------|----------------------------------------|
| Company name, hero text, sections | `index.html`         | `EDIT ... HERE` comments             |
| Colors, fonts, spacing          | `style.css`            | The `:root { ... }` block at the top |
| Google Apps Script URL, social links | `script.js`      | The `CONFIG` block at the top        |
| Notification email, sheet ID    | `google-apps-script/Code.gs` | The `CONFIG` block at the top  |

---

## 2. Preview the site locally

Since it's plain HTML/CSS/JS, you don't need a server for basic editing —
just double-click `index.html` to open it in a browser. For form testing,
it's better to run a tiny local server (browsers sometimes restrict
`fetch()` from `file://` URLs):

```bash
cd srone-website
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## 3. Set up the contact form backend (Google Apps Script)

The site cannot send email directly from the browser — that's not
something a static website can do securely. Instead, form submissions go
to a small Google Apps Script "Web App," which emails you and logs every
submission to a Google Sheet.

### Step 1 — Create the Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com) and create a new,
   blank spreadsheet.
2. Rename it something like **SR-ONE Leads**.
3. Rename the first tab (bottom-left) to **Leads** — this must match
   `SHEET_NAME` in `Code.gs`.
4. Copy the **Sheet ID** from the browser address bar. It's the long string
   between `/d/` and `/edit`:
   `https://docs.google.com/spreadsheets/d/`**`THIS_PART_IS_THE_SHEET_ID`**`/edit`

### Step 2 — Add the script
1. In the Sheet, go to **Extensions → Apps Script**.
2. Delete any starter code in the editor.
3. Paste in the entire contents of `google-apps-script/Code.gs`.
4. At the top of the pasted script, update the `CONFIG` block:
   ```javascript
   const CONFIG = {
     SHEET_ID: "PASTE_YOUR_SHEET_ID_HERE",   // paste the ID from Step 1.4
     SHEET_NAME: "Leads",
     NOTIFICATION_EMAIL: "sharvanpandey81@gmail.com",
   };
   ```
5. Click the **Save** icon (or Ctrl/Cmd+S).

### Step 3 — Deploy as a Web App
1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**.
5. The first time you deploy, Google will ask you to **authorize** the
   script — click through the prompts (it will show an "unverified app"
   warning because it's your own personal script; click **Advanced → Go to
   [project name] (unsafe)** to proceed, this is expected and safe since
   it's your own code).
6. After deploying, copy the **Web app URL** shown — it looks like:
   `https://script.google.com/macros/s/XXXXXXXXXXXXXXXXXXXX/exec`

### Step 4 — Connect the website to the script
1. Open `script.js` in the website project.
2. Find the `CONFIG` block near the top and paste your URL in:
   ```javascript
   const CONFIG = {
     ...
     googleScriptUrl: "https://script.google.com/macros/s/XXXXXXXXXXXXXXXXXXXX/exec",
     ...
   };
   ```
3. Save the file.

### Step 5 — Test it
1. Open the website (locally or once deployed — see Section 4 below).
2. Fill out and submit the contact form.
3. Check that:
   - The green "Thank you for reaching out" message appears.
   - A new row appears in the **Leads** tab of your Google Sheet.
   - An email notification arrives at `sharvanpandey81@gmail.com`.

If something goes wrong, open the Apps Script editor, go to
**Executions** (left sidebar) to see error logs for the failed run.

> **Important:** whenever you edit `Code.gs` after the first deployment,
> you need to create a **new deployment version** (Deploy → Manage
> deployments → edit (pencil) → Version: New version → Deploy) for the
> changes to take effect on the live Web App URL.

---

## 4. Put it on GitHub and deploy it live

You can host this site for free using **GitHub Pages**. These are the
commands to run from your own computer's terminal (Claude cannot push to
GitHub on your behalf, since this environment doesn't have network
access to create the repository for you):

### Step 1 — Create the repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Name it, e.g., `srone-website`.
3. Leave it public (GitHub Pages' free tier requires a public repo, unless
   you have GitHub Pro/Team/Enterprise).
4. Don't initialize with a README (you already have one) — click **Create repository**.

### Step 2 — Push this project to it
From inside the `srone-website` folder on your computer:
```bash
git init
git add .
git commit -m "Initial SR-ONE Consultancy website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/srone-website.git
git push -u origin main
```

### Step 3 — Turn on GitHub Pages
1. On your repo's GitHub page, go to **Settings → Pages**.
2. Under "Build and deployment," set **Source** to **Deploy from a branch**.
3. Set **Branch** to `main` and folder to `/ (root)`.
4. Click **Save**.
5. After a minute or two, GitHub will show your live URL, typically:
   `https://YOUR-USERNAME.github.io/srone-website/`

That's it — the site is now live and free to host. Every time you `git
push` a change, GitHub Pages redeploys automatically within a minute or
two.

---

## 5. Content checklist before going live

- [ ] Replace the 3 demo case studies in `index.html` (search for `DEMO CASE STUDY`) with real results
- [ ] Replace the 4 demo testimonials (search for `EDIT TESTIMONIALS HERE`) with real, permissioned quotes
- [ ] Replace the 3 placeholder Insights articles with real content or link them to real blog posts
- [ ] Update social links in `script.js` (`CONFIG.socialLinks`)
- [ ] Set your real Google Apps Script URL in `script.js` (`CONFIG.googleScriptUrl`)
- [ ] Set your Sheet ID in `google-apps-script/Code.gs`
- [ ] Replace placeholder Privacy Policy / Terms of Service text in `index.html`
- [ ] Update the footer copyright year if needed

---

## 6. What was already tested

- Navigation scrolls to each section and highlights the active link
- Mobile hamburger menu opens/closes and locks background scroll
- All service, industry, case study, testimonial, insight, and FAQ cards render and are keyboard-navigable
- Contact form: required-field validation, email format validation, at-least-one-service validation, consent checkbox validation, loading state, success state, error state
- No console errors, no broken internal links, no missing assets (all icons are inline SVG or local files — nothing depends on an external image host)
- Responsive layout checked at desktop, tablet, and mobile breakpoints (see `style.css` media queries)
