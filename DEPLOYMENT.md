
# 🚀 How to Deploy & Sync SAM

SAM can sync data across all your devices using **Firebase** (Free Tier).

## ☁️ Option A: Firebase Sync (Highly Recommended)
This allows real-time updates across multiple devices automatically.

1. **Create Firebase Project**: Visit [Firebase Console](https://console.firebase.google.com).
2. **Add Firestore**:
   - Click "Firestore Database" in the sidebar.
   - Click "Create Database".
   - Start in **Test Mode** (allows reads/writes without complex rules).
3. **Get Config Keys**:
   - Go to Project Settings (Gear icon) > General.
   - Under "Your apps", click the `</>` (Web) icon to register an app.
   - Copy the `firebaseConfig` object.
4. **Update Code**:
   - Open `services/firebase.ts` and paste your keys into the `firebaseConfig` object.
5. **Push & Deploy**:
   - Push your changes to GitHub. Vercel will rebuild.
   - **SAM is now connected to the cloud!** Any changes you make in the Admin panel will instantly appear on all user devices.

---

## 💾 Option B: Git Backup (No Database)
If you don't want to use Firebase, use the manual sync method.

1. **Add Data**: Use the Admin Panel locally.
2. **Copy Backup**: Go to **Admin > Cloud & Deployment** and click "Copy Backup Code".
3. **Paste**: Replace the contents of `services/storage.ts` with your clipboard.
4. **Push**: Commit and push to GitHub.

---

## 📊 Importing Assets via CSV
You can now bulk-import your equipment spreadsheet:
1. Ensure your CSV has a column named **email** or **User Email**.
2. Go to **Admin > Asset Custody > Browse CSV**.
3. Select your `.csv` file.
4. SAM will automatically map columns like "Laptop SN", "Monitor", etc.
5. If Firebase is active, these will sync to the cloud immediately.
