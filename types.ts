
export interface KBEntry {
  id: string;
  question: string;
  answer: string; // Now supports HTML for inline images/steps
  imageUrls?: string[];
}

export interface AssetEntry {
  email: string;
  laptop: string;
  monitor: string;
  headset: string;
  dockingStation: string;
  keyboard: string;
  mouse: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrls?: string[];
  isKBMatch?: boolean;
  choices?: string[];
  assetData?: AssetEntry; // For displaying custody data
}

export interface AppStats {
  accessCount: number;
}
