import React, { useState, useEffect, useRef } from 'react';
import { getKB, saveKB, getStats, getAssets, saveAssets, clearAllData, deleteKB } from '../services/storage';
import { isFirebaseActive } from '../services/firebase';
import { KBEntry, AssetEntry } from '../types';
import { Plus, Trash2, Edit2, X, Activity, Database, Search, Download, Copy, Check, Monitor, Laptop, Headphones, Keyboard, Mouse, Hash, Mail, ClipboardPaste, Upload, FileSpreadsheet, Save, FileJson, Trash, RefreshCw, User, Code, Globe, Terminal, CheckCircle2, AlertCircle, FileUp, FolderOpen, DatabaseZap, ExternalLink } from 'lucide-react';
import { Logo } from './Logo';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'knowledge' | 'assets' | 'sync'>('knowledge');
  const [entries, setEntries] = useState<KBEntry[]>([]);
  const [assets, setAssets] = useState<AssetEntry[]>([]);
  const [stats, setStats] = useState({ accessCount: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [showImportArea, setShowImportArea] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [isCloudActive, setIsCloudActive] = useState(false);
  const [cloudError, setCloudError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newEntry, setNewEntry] = useState<Partial<KBEntry>>({ question: '', answer: '' });
  const editorRef = useRef<HTMLDivElement>(null);
  const editEditorRef = useRef<HTMLDivElement>(null);
  
  const [newAsset, setNewAsset] = useState<AssetEntry>({
    email: '', laptop: '', monitor: '', headset: '', dockingStation: '', keyboard: '', mouse: ''
  });

  useEffect(() => {
    refreshData();
    setIsCloudActive(isFirebaseActive());
  }, []);

  const refreshData = async () => {
    try {
      setCloudError(null);
      setEntries(await getKB());
      setAssets(await getAssets());
      setStats(getStats());
    } catch (err: any) {
      if (err.message?.includes('permission-denied') || err.message?.includes('disabled')) {
        setCloudError("Firestore API is disabled for this project.");
      }
    }
  };

  const parseCSV = (text: string): any[] => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (inQuotes) {
        if (char === '"' && nextChar === '"') {
          currentField += '"';
          i++;
        } else if (char === '"') inQuotes = false;
        else currentField += char;
      } else {
        if (char === '"') inQuotes = true;
        else if (char === ',') {
          currentRow.push(currentField.trim());
          currentField = '';
        } else if (char === '\n' || char === '\r') {
          if (currentField || currentRow.length > 0) {
            currentRow.push(currentField.trim());
            rows.push(currentRow);
            currentRow = [];
            currentField = '';
          }
          if (char === '\r' && nextChar === '\n') i++;
        } else {
          currentField += char;
        }
      }
    }
    if (currentField || currentRow.length > 0) {
      currentRow.push(currentField.trim());
      rows.push(currentRow);
    }

    if (rows.length < 2) return [];

    const headers = rows[0].map(h => h.toLowerCase().trim());
    return rows.slice(1).map(row => {
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || "";
      });
      return obj;
    });
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setImportError(null);
        const content = event.target?.result as string;
        const csvData = parseCSV(content);

        if (csvData.length === 0) throw new Error("File is empty or invalid format.");

        const emailMap: Record<string, AssetEntry> = {};

        csvData.forEach(row => {
          const email = (row['used by'] || '').toLowerCase().trim();
          if (!email || email === 'n/a') return;

          const serial = row['name'] || '';
          const type = (row['asset type'] || '').toLowerCase();

          if (!emailMap[email]) {
            emailMap[email] = {
              email, laptop: '', monitor: '', headset: '', dockingStation: '', keyboard: '', mouse: ''
            };
          }

          const target = emailMap[email];
          const append = (curr: string, val: string) => curr ? `${curr}, ${val}` : val;

          if (type.includes('laptop') || type.includes('notebook')) target.laptop = append(target.laptop, serial);
          else if (type.includes('monitor') || type.includes('display') || type.includes('screen')) target.monitor = append(target.monitor, serial);
          else if (type.includes('headset') || type.includes('audio')) target.headset = append(target.headset, serial);
          else if (type.includes('dock')) target.dockingStation = append(target.dockingStation, serial);
          else if (type.includes('keyboard')) target.keyboard = append(target.keyboard, serial);
          else if (type.includes('mouse')) target.mouse = append(target.mouse, serial);
        });

        const mappedAssets = Object.values(emailMap);
        if (mappedAssets.length === 0) throw new Error("No valid records found. Required columns: Name, Asset Type, Used By.");

        // Fix: Explicitly type the Map to prevent inference as Map<any, any> which leads to unknown[] from values()
        const existingMap = new Map<string, AssetEntry>(assets.map(a => [a.email.toLowerCase(), a]));
        mappedAssets.forEach(newA => existingMap.set(newA.email.toLowerCase(), newA));

        const updated = Array.from(existingMap.values());
        setAssets(updated);
        await saveAssets(updated);
        setShowImportArea(false);
        alert(`CSV Processed: Updated ${mappedAssets.length} user records!`);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err: any) {
        setImportError(err.message || "Failed to parse CSV.");
      }
    };
    reader.readAsText(file);
  };

  const handleCopyNewCode = () => {
    const kbJson = JSON.stringify(entries, null, 2);
    const assetJson = JSON.stringify(assets, null, 2);
    const fileTemplate = `// Backup Generated on ${new Date().toLocaleString()}\nimport { KBEntry, AssetEntry, AppStats } from '../types';\nconst KB_KEY = 'sam_knowledge_base';\nconst ASSETS_KEY = 'sam_asset_base';\nconst STATS_KEY = 'sam_stats';\nconst DEFAULT_KB: KBEntry[] = ${kbJson};\nconst DEFAULT_ASSETS: AssetEntry[] = ${assetJson};\n// ...`;
    navigator.clipboard.writeText(fileTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target?.result as string;
            const img = `<img src="${base64}" style="max-width: 100%; border-radius: 8px; margin: 10px 0; display: block;" />`;
            document.execCommand('insertHTML', false, img);
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  const handleAddKB = async () => {
    const answerHtml = editorRef.current?.innerHTML || '';
    if (!newEntry.question || !answerHtml || answerHtml === '<br>') return;
    const entry: KBEntry = { id: Date.now().toString(), question: newEntry.question.trim(), answer: answerHtml };
    const updated = [entry, ...entries];
    setEntries(updated);
    await saveKB(updated);
    setNewEntry({ question: '', answer: '' });
    if (editorRef.current) editorRef.current.innerHTML = '';
  };

  const handleSaveEditKB = async (id: string) => {
    const editedQuestion = (document.getElementById(`edit-q-${id}`) as HTMLInputElement)?.value;
    const editedAnswer = editEditorRef.current?.innerHTML || '';
    if (!editedQuestion || !editedAnswer) return;
    const updated = entries.map(e => e.id.toString() === id.toString() ? { ...e, question: editedQuestion.trim(), answer: editedAnswer } : e);
    setEntries(updated);
    await saveKB(updated);
    setEditingId(null);
  };

  const handleDeleteKBEntry = async (id: string) => {
    if (confirm("Delete this entry?")) {
      const updated = entries.filter(e => e.id.toString() !== id.toString());
      setEntries(updated);
      await deleteKB(id, updated);
    }
  };

  const handleAddAsset = async () => {
    if (!newAsset.email) return;
    const updated = [newAsset, ...assets];
    setAssets(updated);
    await saveAssets(updated);
    setNewAsset({ email: '', laptop: '', monitor: '', headset: '', dockingStation: '', keyboard: '', mouse: '' });
  };

  const filteredEntries = entries.filter(e => e.question.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredAssets = assets.filter(a => a.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-dark flex items-center gap-3"><Logo size="sm" />Control Center</h1>
          <div className="flex items-center gap-3 mt-1">
             <p className="text-slate-500 text-sm">System Administration Dashboard</p>
             <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-tighter ${isCloudActive ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                <DatabaseZap className="w-3 h-3" />
                {isCloudActive ? 'Firebase Active' : 'Local Only'}
             </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => { clearAllData(); window.location.reload(); }} className="bg-white text-slate-500 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
            <RefreshCw className="w-4 h-4" /> Reset Local Cache
          </button>
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3">
            <Activity className="text-brand-cyan w-5 h-5" />
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-none tracking-widest">Active Hits</p>
              <p className="text-lg font-bold text-slate-800 leading-none mt-1">{stats.accessCount}</p>
            </div>
          </div>
        </div>
      </div>

      {cloudError && (
        <div className="bg-red-50 border-2 border-red-100 p-6 rounded-3xl flex items-start gap-4 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-red-500 text-white p-2 rounded-xl"><AlertCircle className="w-6 h-6" /></div>
          <div className="space-y-1">
            <h3 className="font-black text-red-900 uppercase text-xs tracking-wider">Cloud Sync Error</h3>
            <p className="text-sm text-red-700 leading-relaxed">The Cloud Firestore API is disabled for your project <b>sam-agent-856e0</b>.</p>
            <div className="pt-2">
              <a href="https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=sam-agent-856e0" target="_blank" className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-700 transition-all shadow-md">
                Enable Firestore API <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="flex border-b border-slate-200 gap-8 overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveTab('knowledge')} className={`pb-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === 'knowledge' ? 'border-brand-cyan text-brand-cyan' : 'border-transparent text-slate-400'}`}>Knowledge Base</button>
        <button onClick={() => setActiveTab('assets')} className={`pb-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === 'assets' ? 'border-brand-cyan text-brand-cyan' : 'border-transparent text-slate-400'}`}>Asset Custody</button>
        <button onClick={() => setActiveTab('sync')} className={`pb-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${activeTab === 'sync' ? 'border-brand-cyan text-brand-cyan' : 'border-transparent text-slate-400'}`}><Globe className="w-4 h-4" /> Cloud & Deployment</button>
      </div>

      {activeTab === 'sync' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg space-y-6">
              <div className="bg-brand-cyan/10 w-16 h-16 rounded-2xl flex items-center justify-center text-brand-cyan mb-2"><DatabaseZap className="w-8 h-8" /></div>
              <h2 className="text-2xl font-black text-brand-dark">Sync Data Guide</h2>
              <p className="text-slate-600 text-sm leading-relaxed">How to populate the database properly:</p>
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <ol className="text-[11px] text-slate-500 space-y-2 list-decimal pl-4">
                   <li>Ensure <b>Firestore API</b> is enabled in your Google Console.</li>
                   <li>Go to the <b>Asset Custody</b> tab.</li>
                   <li>Click <b>Browse CSV</b> and select your file.</li>
                   <li>SAM will group your rows (Name/Serial, Asset Type, Used By) locally.</li>
                   <li>If the cloud icon is green, it will automatically attempt to save these user groups to Firebase.</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl text-white space-y-6">
              <div className="flex items-center gap-3 text-brand-yellow mb-2"><Terminal className="w-6 h-6" /><h3 className="font-bold uppercase tracking-widest text-xs">Manual Backup</h3></div>
              <button onClick={handleCopyNewCode} className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center gap-2 transition-all">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy storage.ts Source Code"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            {activeTab === 'knowledge' ? (
              <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden sticky top-24">
                <div className="p-6 border-b border-slate-50 bg-slate-50/50"><h2 className="font-bold text-slate-800 flex items-center gap-2"><Plus className="w-5 h-5 text-brand-cyan" />New Entry</h2></div>
                <div className="p-6 space-y-4">
                  <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-cyan" placeholder="The User Question..." value={newEntry.question} onChange={e => setNewEntry({ ...newEntry, question: e.target.value })} />
                  <div ref={editorRef} contentEditable onPaste={handlePaste} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl min-h-[200px] overflow-y-auto text-sm outline-none focus:ring-2 focus:ring-brand-cyan" data-placeholder="Rich answer content..." />
                  <button onClick={handleAddKB} className="w-full bg-brand-cyan text-white font-bold py-4 rounded-xl shadow-lg hover:brightness-110 transition-all">Add to Database</button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden sticky top-24">
                <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                  <h2 className="font-bold text-slate-800 flex items-center gap-2"><Plus className="w-5 h-5 text-brand-cyan" />Asset Entry</h2>
                  <button onClick={() => setShowImportArea(!showImportArea)} className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:underline ${showImportArea ? 'text-slate-400' : 'text-brand-cyan'}`}>
                    {showImportArea ? <X className="w-3 h-3" /> : <FileSpreadsheet className="w-3 h-3" />}
                    {showImportArea ? "Cancel" : "Browse CSV"}
                  </button>
                </div>
                
                <div className="p-6 space-y-4">
                  {showImportArea ? (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                      <div className="p-4 bg-brand-cyan/5 border-2 border-dashed border-brand-cyan/20 rounded-2xl flex flex-col items-center justify-center text-center gap-3 group hover:bg-brand-cyan/[0.07] hover:border-brand-cyan/40 transition-all cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="bg-white p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform"><FileUp className="w-6 h-6 text-brand-cyan" /></div>
                        <div className="space-y-1">
                          <p className="text-xs font-black text-brand-dark uppercase tracking-wide">Select Asset CSV</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">Required: Name, Asset Type, Used By</p>
                        </div>
                        <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleCSVUpload} />
                      </div>
                      
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3 text-[10px] text-blue-700 font-medium leading-relaxed">
                        <AlertCircle className="w-4 h-4 text-blue-500 shrink-0" />
                        <div>
                          <p className="font-bold mb-1">CSV Format Needed:</p>
                          <ul className="list-disc pl-3">
                            <li><b>Name</b>: Serial Number</li>
                            <li><b>Asset Type</b>: e.g. Laptop, Monitor</li>
                            <li><b>Used By</b>: User Email</li>
                          </ul>
                        </div>
                      </div>
                      {importError && <p className="text-[10px] text-red-500 font-bold bg-red-50 p-2 rounded-lg border border-red-100 animate-shake">{importError}</p>}
                    </div>
                  ) : (
                    <>
                      <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="User email" value={newAsset.email} onChange={e => setNewAsset({...newAsset, email: e.target.value})} />
                      <div className="grid grid-cols-2 gap-2">
                        <input className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Laptop S/N" value={newAsset.laptop} onChange={e => setNewAsset({...newAsset, laptop: e.target.value})} />
                        <input className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Monitor S/N" value={newAsset.monitor} onChange={e => setNewAsset({...newAsset, monitor: e.target.value})} />
                        <input className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Dock S/N" value={newAsset.dockingStation} onChange={e => setNewAsset({...newAsset, dockingStation: e.target.value})} />
                        <input className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Headset S/N" value={newAsset.headset} onChange={e => setNewAsset({...newAsset, headset: e.target.value})} />
                      </div>
                      <button onClick={handleAddAsset} className="w-full bg-brand-dark text-white font-bold py-4 rounded-xl shadow-lg">Save Asset</button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="relative group"><input type="text" placeholder="Search database..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-5 pl-14 bg-white border border-slate-200 rounded-3xl shadow-sm outline-none focus:ring-2 focus:ring-brand-cyan transition-all" /><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 transition-colors" /></div>
            <div className="space-y-4">
              {activeTab === 'knowledge' ? (
                filteredEntries.map(entry => (
                  <div key={entry.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:shadow-md transition-all">
                    {editingId === entry.id ? (
                      <div className="space-y-4">
                        <input id={`edit-q-${entry.id}`} defaultValue={entry.question} className="w-full p-4 border-2 border-brand-cyan rounded-2xl font-bold outline-none" />
                        <div ref={editEditorRef} contentEditable onPaste={handlePaste} className="w-full p-4 border-2 border-brand-cyan rounded-2xl min-h-[250px] outline-none bg-slate-50" dangerouslySetInnerHTML={{ __html: entry.answer }} />
                        <div className="flex gap-2"><button onClick={() => handleSaveEditKB(entry.id)} className="bg-brand-cyan text-white px-8 py-3 rounded-2xl font-bold">Update</button><button onClick={() => setEditingId(null)} className="bg-slate-100 px-8 py-3 rounded-2xl font-bold">Cancel</button></div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-4"><h3 className="text-xl font-bold text-brand-dark pr-12">{entry.question}</h3><div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => setEditingId(entry.id)} className="p-3 text-slate-400 hover:text-brand-cyan"><Edit2 className="w-5 h-5" /></button><button onClick={() => handleDeleteKBEntry(entry.id)} className="p-3 text-slate-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button></div></div>
                        <div className="text-slate-600 text-sm rich-answer leading-relaxed" dangerouslySetInnerHTML={{ __html: entry.answer }} />
                      </>
                    )}
                  </div>
                ))
              ) : (
                filteredAssets.map(asset => (
                  <div key={asset.email} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group flex flex-col hover:shadow-md transition-all">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-5">
                        <div className="bg-brand-cyan/10 p-4 rounded-2xl text-brand-cyan shadow-inner"><User className="w-8 h-8" /></div>
                        <div><h3 className="text-lg font-black text-brand-dark">{asset.email}</h3><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Master Record</p></div>
                      </div>
                      <button onClick={() => { if(confirm("Delete?")) { saveAssets(assets.filter(a => a.email !== asset.email)); refreshData(); } }} className="p-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-6 h-6" /></button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                       {asset.laptop && <div className="p-2 bg-slate-50 rounded-lg border border-slate-100"><p className="text-[8px] font-bold text-slate-400 uppercase">Laptop</p><p className="text-[11px] font-mono font-bold text-slate-700 whitespace-pre-wrap">{asset.laptop}</p></div>}
                       {asset.monitor && <div className="p-2 bg-slate-50 rounded-lg border border-slate-100"><p className="text-[8px] font-bold text-slate-400 uppercase">Monitor</p><p className="text-[11px] font-mono font-bold text-slate-700 whitespace-pre-wrap">{asset.monitor}</p></div>}
                       {asset.headset && <div className="p-2 bg-slate-50 rounded-lg border border-slate-100"><p className="text-[8px] font-bold text-slate-400 uppercase">Headset</p><p className="text-[11px] font-mono font-bold text-slate-700 whitespace-pre-wrap">{asset.headset}</p></div>}
                       {asset.dockingStation && <div className="p-2 bg-slate-50 rounded-lg border border-slate-100"><p className="text-[8px] font-bold text-slate-400 uppercase">Dock</p><p className="text-[11px] font-mono font-bold text-slate-700 whitespace-pre-wrap">{asset.dockingStation}</p></div>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
