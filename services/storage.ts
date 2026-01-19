
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
