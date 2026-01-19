
# 🚀 How to Deploy & Sync SAM

SAM can sync data across all your devices using **Firebase** (Free Tier).

## ☁️ Option A: Firebase Sync (Highly Recommended)
This allows real-time updates across multiple devices automatically.

1. **Create Firebase Project**: Visit [Firebase Console](https://console.firebase.google.com).
2. **Add Firestore**:
   - Click "Firestore Database" in the sidebar.
   - Click "Create Database".
   - Start in **Test Mode** (allows reads/writes without complex rules).
3. **CRITICAL: Enable Firestore API**:
   - Visit [Google Cloud API Console](https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=sam-agent-856e0).
   - Click the **ENABLE** button. If you don't do this, SAM cannot connect to the cloud.
4. **Get Config Keys**:
   - Go to Project Settings (Gear icon) > General in Firebase.
   - Under "Your apps", register a Web App.
   - Copy the `firebaseConfig` into `services/firebase.ts`.
5. **Push & Deploy**: Push to GitHub/Vercel.

---

## 💾 Option B: Git Backup (No Database)
1. Add data using Admin Panel locally.
2. Go to **Admin > Cloud & Deployment** > "Copy Source Code".
3. Paste code into `services/storage.ts` manually and push.

---

## 📊 CSV Column Format
For bulk asset imports, ensure your CSV has these exact column names:
- **Name**: (Used as Serial Number)
- **Asset Type**: (Laptop, Monitor, Headset, etc.)
- **Used By**: (User's corporate email address)

SAM will ignore the "Used By (name)" column as requested.
