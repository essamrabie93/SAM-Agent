# 🚀 How to Deploy SAM to the Cloud (Vercel)

Follow these simple steps to make SAM live on the internet so your team can access it from anywhere.

### Step 1: Save your code to GitHub
1. Create a free account on [GitHub.com](https://github.com).
2. Create a new "Repository" named `sam-it-agent`.
3. Follow the instructions on GitHub to upload these files from your computer to the repository.

### Step 2: Connect to Vercel (The Hosting)
1. Go to [Vercel.com](https://vercel.com) and sign up using your GitHub account.
2. Click **"Add New"** -> **"Project"**.
3. Select your `sam-it-agent` repository from the list.

### Step 3: Add your Gemini API Key
*Before clicking "Deploy", you must add your "Secret Sauce" (The AI Key):*
1. In the Vercel setup screen, find the **"Environment Variables"** section.
2. For **Name**, type: `API_KEY`
3. For **Value**, paste your Gemini API Key (from Google AI Studio).
4. Click **"Add"**.

### Step 4: Deploy!
1. Click the **"Deploy"** button.
2. Wait about 1-2 minutes.
3. Vercel will give you a live link like `sam-it-agent.vercel.app`. **You are live!**

---

### 💡 Pro-Tip: How to update the "Permanent" Database
Since this app doesn't have a paid database server, it saves your Admin changes to your *browser's memory*. To make your new questions permanent for **everyone**:
1. Go to the **IT Admin** section in your live app.
2. Add all your questions and answers.
3. Click the **"Export for Code"** button (I added this for you!).
4. Copy the text it gives you.
5. Open the `services/storage.ts` file in your code.
6. Replace the `DEFAULT_KB` section with the text you copied.
7. Save and push to GitHub. Vercel will update the app automatically for everyone!
