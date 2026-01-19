
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
  // PASTE YOUR KB JSON HERE:
];

const DEFAULT_ASSETS: AssetEntry[] = [
  // PASTE YOUR ASSETS JSON HERE:
];

export const getKB = (): KBEntry[] => {
  const localData = localStorage.getItem(KB_KEY);
  const localKB: KBEntry[] = localData ? JSON.parse(localData) : [];
  
  // Create a map for easy lookups
  const kbMap = new Map<string, KBEntry>();
  
  // 1. Load defaults from code (The "Official" version)
  DEFAULT_KB.forEach(entry => kbMap.set(entry.question.toLowerCase().trim(), entry));
  
  // 2. Overlay local storage (Your recent unsaved UI edits)
  localKB.forEach(entry => kbMap.set(entry.question.toLowerCase().trim(), entry));
  
  return Array.from(kbMap.values());
};

export const saveKB = (entries: KBEntry[]) => {
  localStorage.setItem(KB_KEY, JSON.stringify(entries));
};

export const getAssets = (): AssetEntry[] => {
  const localData = localStorage.getItem(ASSETS_KEY);
  const localAssets: AssetEntry[] = localData ? JSON.parse(localData) : [];
  
  const assetMap = new Map<string, AssetEntry>();
  
  // 1. Load defaults from code
  DEFAULT_ASSETS.forEach(asset => assetMap.set(asset.email.toLowerCase().trim(), asset));
  
  // 2. Overlay local storage
  localAssets.forEach(asset => assetMap.set(asset.email.toLowerCase().trim(), asset));
  
  return Array.from(assetMap.values());
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
};
