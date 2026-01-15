
import { KBEntry, AssetEntry, AppStats } from '../types';

const KB_KEY = 'sam_knowledge_base';
const ASSETS_KEY = 'sam_asset_base';
const STATS_KEY = 'sam_stats';

const DEFAULT_KB: KBEntry[] = [];
const DEFAULT_ASSETS: AssetEntry[] = [];

export const getKB = (): KBEntry[] => {
  const data = localStorage.getItem(KB_KEY);
  return data ? JSON.parse(data) : DEFAULT_KB;
};

export const saveKB = (entries: KBEntry[]) => {
  localStorage.setItem(KB_KEY, JSON.stringify(entries));
};

export const getAssets = (): AssetEntry[] => {
  const data = localStorage.getItem(ASSETS_KEY);
  return data ? JSON.parse(data) : DEFAULT_ASSETS;
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
  localStorage.removeItem(STATS_KEY);
};
