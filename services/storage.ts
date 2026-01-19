
import { KBEntry, AssetEntry, AppStats } from '../types';

const KB_KEY = 'sam_knowledge_base';
const ASSETS_KEY = 'sam_asset_base';
const STATS_KEY = 'sam_stats';

/**
 * 🚀 PERMANENT DATABASE (FOR VERCEL DEPLOYMENT)
 * -------------------------------------------
 * To make your data permanent for everyone:
 * 1. Go to IT Admin in your live app.
 * 2. Add your questions/assets.
 * 3. Click "Export for Code".
 * 4. Paste the JSON arrays below.
 */

const DEFAULT_KB: KBEntry[] = [
  // Example: { "id": "1", "question": "How to reset VPN?", "answer": "Contact helpdesk..." }
  // PASTE YOUR KB JSON HERE:
Thanks for reporting this.  Your laptop might need an update to fix this issue.
Can you please follow these steps below to run updates on your laptop? 
 
1. Search for "Dell Command | Update" from the Start menu., or locate it under the 'All Apps' list:



2. Click the 'Check' button.



3. After performing a search, Command | Update will tell you if you have any updates available. If you want, you can review them by clicking 'View Details'. You can also select which updates you want to install, but just leave everything checked unless you have a reason not to.

I recommend keeping the 'Automatically restart system' box unchecked. When you're ready, go ahead and click the 'Install' button.




6. Command | Update will download and install your updates. 
 



7. If the updates need a restart, you'll be prompted for a restart. Remember: make sure your computer is plugged into power, then click 'Restart'.
​


After installation, your computer will restart and you can get back to work. Most system updates like this take less than 10 minutes to complete.

I'll throw in one last warning about keeping your computer plugged in while it's installing and restarting. If your computer loses power while installing critical system components (like the BIOS), this can corrupt the BIOS and turn your computer into a paperweight. Seriously, a bad BIOS update can irreparably and permanently break your computer, so keep it plugged in.

Please, let me know if this works for you.

];

const DEFAULT_ASSETS: AssetEntry[] = [
  // Example: { "email": "user@company.com", "laptop": "SN123", ... }
  // PASTE YOUR ASSETS JSON HERE:
];

export const getKB = (): KBEntry[] => {
  const localData = localStorage.getItem(KB_KEY);
  const localKB: KBEntry[] = localData ? JSON.parse(localData) : [];
  
  // Merge: Prioritize local storage but include defaults from code if not already present
  const merged = [...localKB];
  DEFAULT_KB.forEach(defEntry => {
    if (!merged.find(e => e.question.toLowerCase().trim() === defEntry.question.toLowerCase().trim())) {
      merged.push(defEntry);
    }
  });
  
  return merged;
};

export const saveKB = (entries: KBEntry[]) => {
  localStorage.setItem(KB_KEY, JSON.stringify(entries));
};

export const getAssets = (): AssetEntry[] => {
  const localData = localStorage.getItem(ASSETS_KEY);
  const localAssets: AssetEntry[] = localData ? JSON.parse(localData) : [];
  
  // Merge: Ensure code-based defaults are available
  const merged = [...localAssets];
  DEFAULT_ASSETS.forEach(defAsset => {
    if (!merged.find(a => a.email.toLowerCase().trim() === defAsset.email.toLowerCase().trim())) {
      merged.push(defAsset);
    }
  });
  
  return merged;
};

export const saveAssets = (entries: AssetEntry[]) => {
  localStorage.setItem(ASSETS_KEY, JSON.stringify(entries));
};

export const findAssetByEmail = (email: string): AssetEntry | undefined => {
  const assets = getAssets();
  return assets.find(a => a.email.toLowerCase() === email.toLowerCase().trim());
};

export const getStats = (): AppStats => {
  const data = localStorage.getItem(STATS_KEY);
  return data ? JSON.parse(data) : { accessCount: 0 };
};

export const incrementAccessCount = () => {
  const stats = getStats();
  const newStats = { ...stats, accessCount: stats.accessCount + 1 };
  localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
  return newStats.accessCount;
};

export const clearAllData = () => {
  localStorage.removeItem(KB_KEY);
  localStorage.removeItem(ASSETS_KEY);
  // We keep stats so the count doesn't reset to 0 unless desired
};
