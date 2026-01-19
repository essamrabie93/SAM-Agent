
# 🚀 How to Deploy & Update SAM

SAM is designed to be hosted on Vercel. Because there is no external database, follow these steps to manage your data.

## 📦 Initial Deployment
1. **GitHub**: Create a repo and push this code.
2. **Vercel**: Create a project from that repo.
3. **Environment Variable**: Add `API_KEY` with your Gemini Key in Vercel settings.
4. **Deploy**: Your app is now live at `your-app.vercel.app`.

---

## 🔄 How to Update Data (Knowledge Base & Assets)
Since SAM stores data in the browser locally first, you must "Sync" your changes to the code to make them permanent for all users.

### 1. Add Data via UI
Open your live Vercel website, log into **IT Admin**, and add your questions or asset records.

### 2. Export to Clipboard
*   In the **Knowledge Base** tab, click **"Export for Code"**.
*   In the **Asset Custody** tab, click **"Export Assets for Code"**.
*   This copies a JSON block to your clipboard.

### 3. Update the Source Code
Open `services/storage.ts` in your code editor (VS Code, etc.):
*   Find `const DEFAULT_KB: KBEntry[] = [];` and paste your copied JSON inside the brackets.
*   Find `const DEFAULT_ASSETS: AssetEntry[] = [];` and do the same for assets.

### 4. Push to GitHub
```bash
git add .
git commit -m "Updated knowledge base"
git push origin main
```

### 5. Final Result
Vercel will detect the push and automatically update. Now, **every user** who visits your site will see the new information you added.

---

## 🛠️ Troubleshooting
If you've updated the code but your browser still shows "old" data from a previous session:
1. Go to **IT Admin**.
2. Click the **"Reset to Code"** button at the top right.
3. This wipes your browser's local cache and forces it to reload the "Official" version from your GitHub code.
