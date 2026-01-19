
import { KBEntry, AssetEntry, AppStats } from '../types';
import * as cloud from './firebase';

const KB_KEY = 'sam_knowledge_base';
const ASSETS_KEY = 'sam_asset_base';
const STATS_KEY = 'sam_stats';

const DEFAULT_KB: KBEntry[] = [
  {
    "id": "1768813226609",
    "question": "Slowness issue",
    "answer": "<div style=\"font-family: courier new, monospace;\">Thanks for reporting this. Your laptop might need updates.</div><div>1. Search for 'Dell Command | Update' from the Start menu.</div>"
  }
];

const DEFAULT_ASSETS: AssetEntry[] = [];

/**
 * 🔄 HYBRID STORAGE LOGIC
 * 1. Try to fetch from Firebase (Cloud)
 * 2. If unavailable, use LocalStorage (Recent Edits)
 * 3. Fallback to hardcoded defaults
 */

export const getKB = async (): Promise<KBEntry[]> => {
  const localData = localStorage.getItem(KB_KEY);
  const localKB: KBEntry[] = localData ? JSON.parse(localData) : [];
  
  if (cloud.isFirebaseActive()) {
    try {
      const cloudData = await cloud.fetchCloudKB();
      if (cloudData.length > 0) return cloudData;
    } catch (e) {
      console.error("Failed to fetch from cloud:", e);
    }
  }
  
  const kbMap = new Map<string, KBEntry>();
  DEFAULT_KB.forEach(entry => { if (entry?.question) kbMap.set(entry.question.toLowerCase().trim(), entry); });
  localKB.forEach(entry => { if (entry?.question) kbMap.set(entry.question.toLowerCase().trim(), entry); });
  return Array.from(kbMap.values());
};

export const saveKB = async (entries: KBEntry[]) => {
  localStorage.setItem(KB_KEY, JSON.stringify(entries));
  if (cloud.isFirebaseActive()) {
    // Sync the most recent change
    if (entries.length > 0) await cloud.saveCloudKBEntry(entries[0]);
  }
};

export const deleteKB = async (id: string, updatedList: KBEntry[]) => {
  localStorage.setItem(KB_KEY, JSON.stringify(updatedList));
  if (cloud.isFirebaseActive()) await cloud.deleteCloudKBEntry(id);
};

export const getAssets = async (): Promise<AssetEntry[]> => {
  const localData = localStorage.getItem(ASSETS_KEY);
  const localAssets: AssetEntry[] = localData ? JSON.parse(localData) : [];

  if (cloud.isFirebaseActive()) {
    try {
      const cloudData = await cloud.fetchCloudAssets();
      if (cloudData.length > 0) return cloudData;
    } catch (e) {
      console.error("Cloud fetch failed:", e);
    }
  }

  const assetMap = new Map<string, AssetEntry>();
  DEFAULT_ASSETS.forEach(asset => { if (asset?.email) assetMap.set(asset.email.toLowerCase().trim(), asset); });
  localAssets.forEach(asset => { if (asset?.email) assetMap.set(asset.email.toLowerCase().trim(), asset); });
  return Array.from(assetMap.values());
};

export const saveAssets = async (entries: AssetEntry[]) => {
  localStorage.setItem(ASSETS_KEY, JSON.stringify(entries));
  // In a real app, you'd sync only the delta, but for simplicity we save the whole batch if needed
  if (cloud.isFirebaseActive()) {
    for (const entry of entries) {
      await cloud.saveCloudAsset(entry);
    }
  }
};

export const findAssetByEmail = async (email: string): Promise<AssetEntry | undefined> => {
  if (!email) return undefined;
  const assets = await getAssets();
  const search = email.toLowerCase().trim();
  return assets.find(a => a.email && a.email.toLowerCase().trim() === search);
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
