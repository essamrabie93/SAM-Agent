
import React, { useState, useEffect, useRef } from 'react';
import { getKB, saveKB, getStats, getAssets, saveAssets, clearAllData } from '../services/storage';
import { KBEntry, AssetEntry } from '../types';
import { Plus, Trash2, Edit2, X, Activity, Database, Search, Download, Copy, Check, Monitor, Laptop, Headphones, Keyboard, Mouse, Hash, Mail, ClipboardPaste, Upload, FileSpreadsheet, Save, FileJson, Trash, RefreshCw, User, Code } from 'lucide-react';
import { Logo } from './Logo';

const ADMIN_PASSWORD = 'AdminSAM123';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'knowledge' | 'assets'>('knowledge');
  const [entries, setEntries] = useState<KBEntry[]>([]);
  const [assets, setAssets] = useState<AssetEntry[]>([]);
  const [stats, setStats] = useState({ accessCount: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newEntry, setNewEntry] = useState<Partial<KBEntry>>({ question: '', answer: '' });
  const editorRef = useRef<HTMLDivElement>(null);
  const editEditorRef = useRef<HTMLDivElement>(null);
  
  const [newAsset, setNewAsset] = useState<AssetEntry>({
    email: '', laptop: '', monitor: '', headset: '', dockingStation: '', keyboard: '', mouse: ''
  });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setEntries(getKB());
    setAssets(getAssets());
    setStats(getStats());
  };

  const filteredEntries = entries.filter(e => 
    e.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAssets = assets.filter(a => 
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const exportKB = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sam_kb_export_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportForCode = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    navigator.clipboard.writeText(dataStr);
    alert("JSON Copied to Clipboard! Paste this into 'DEFAULT_KB' in services/storage.ts for permanent deployment.");
  };

  const importKB = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          const currentKB = getKB();
          const merged = [...imported, ...currentKB].filter((v, i, a) => 
            a.findIndex(t => t.question.toLowerCase().trim() === v.question.toLowerCase().trim()) === i
          );
          setEntries(merged);
          saveKB(merged);
          alert(`Success! Imported and merged ${imported.length} items.`);
        }
      } catch (err) { alert("Invalid JSON file format."); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearDatabase = () => {
    const pass = prompt("DANGER: Enter Admin Password to WIPE ALL DATA:");
    if (pass === ADMIN_PASSWORD) {
      if (confirm("THIS ACTION IS PERMANENT. Delete all KB entries, Assets, and Stats?")) {
        clearAllData();
        setEntries([]);
        setAssets([]);
        setStats({ accessCount: 0 });
        alert("System database has been cleared.");
        window.location.reload();
      }
    } else if (pass !== null) {
      alert("Incorrect password.");
    }
  };

  const handleAddKB = () => {
    const answerHtml = editorRef.current?.innerHTML || '';
    if (!newEntry.question || !answerHtml || answerHtml === '<br>') {
      alert("Please enter both question and answer.");
      return;
    }
    const entry: KBEntry = { id: Date.now().toString(), question: newEntry.question.trim(), answer: answerHtml };
    const updated = [entry, ...entries];
    setEntries(updated);
    saveKB(updated);
    setNewEntry({ question: '', answer: '' });
    if (editorRef.current) editorRef.current.innerHTML = '';
  };

  const handleSaveEditKB = (id: string) => {
    const editedQuestion = (document.getElementById(`edit-q-${id}`) as HTMLInputElement)?.value;
    const editedAnswer = editEditorRef.current?.innerHTML || '';
    if (!editedQuestion || !editedAnswer) return;
    const updated = entries.map(e => e.id.toString() === id.toString() ? { ...e, question: editedQuestion.trim(), answer: editedAnswer } : e);
    setEntries(updated);
    saveKB(updated);
    setEditingId(null);
  };

  const handleDeleteKB = (id: string) => {
    if (confirm("Are you sure you want to delete this knowledge entry?")) {
      const updated = entries.filter(e => e.id.toString() !== id.toString());
      setEntries(updated);
      saveKB(updated);
    }
  };

  const handleAddAsset = () => {
    if (!newAsset.email) {
      alert("Email is required.");
      return;
    }
    const updated = [newAsset, ...assets];
    setAssets(updated);
    saveAssets(updated);
    setNewAsset({ email: '', laptop: '', monitor: '', headset: '', dockingStation: '', keyboard: '', mouse: '' });
    alert("User assets added.");
  };

  const handleDeleteAsset = (email: string) => {
    if (confirm(`Delete records for ${email}?`)) {
      const updated = assets.filter(a => a.email.toLowerCase() !== email.toLowerCase());
      setAssets(updated);
      saveAssets(updated);
    }
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        const lines = content.split('\n');
        const updatedAssets = [...assets];
        lines.slice(1).forEach(line => {
          if (!line.trim()) return;
          const parts = line.split(',').map(s => s.trim().replace(/"/g, ''));
          if (parts.length < 3) return;
          const [serial, type, email] = parts;
          if (!email) return;
          
          let asset = updatedAssets.find(a => a.email.toLowerCase() === email.toLowerCase());
          if (!asset) {
            asset = { email, laptop: '', monitor: '', headset: '', dockingStation: '', keyboard: '', mouse: '' };
            updatedAssets.push(asset);
          }
          
          const lowerType = type.toLowerCase();
          if (lowerType.includes('laptop')) asset.laptop = serial;
          else if (lowerType.includes('monitor')) asset.monitor = serial;
          else if (lowerType.includes('dock')) asset.dockingStation = serial;
          else if (lowerType.includes('headset')) asset.headset = serial;
          else if (lowerType.includes('keyboard')) asset.keyboard = serial;
          else if (lowerType.includes('mouse')) asset.mouse = serial;
        });
        setAssets(updatedAssets);
        saveAssets(updatedAssets);
        alert("Assets imported from CSV.");
      } catch (err) { alert("Error parsing CSV."); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-dark flex items-center gap-3"><Logo size="sm" />Control Center</h1>
          <p className="text-slate-500 mt-1 text-sm">System Administration Dashboard</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleClearDatabase} className="bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all shadow-sm">
            <Trash className="w-4 h-4" /> Reset Database
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

      <div className="flex border-b border-slate-200 gap-8">
        <button onClick={() => setActiveTab('knowledge')} className={`pb-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'knowledge' ? 'border-brand-cyan text-brand-cyan' : 'border-transparent text-slate-400'}`}>Knowledge Base</button>
        <button onClick={() => setActiveTab('assets')} className={`pb-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'assets' ? 'border-brand-cyan text-brand-cyan' : 'border-transparent text-slate-400'}`}>Asset Custody</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          {activeTab === 'knowledge' ? (
            <>
              <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden sticky top-24">
                <div className="p-6 border-b border-slate-50 bg-slate-50/50"><h2 className="font-bold text-slate-800 flex items-center gap-2"><Plus className="w-5 h-5 text-brand-cyan" />New Entry</h2></div>
                <div className="p-6 space-y-4">
                  <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-cyan" placeholder="The User Question..." value={newEntry.question} onChange={e => setNewEntry({ ...newEntry, question: e.target.value })} />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Rich Answer Content</p>
                    <div ref={editorRef} contentEditable onPaste={handlePaste} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl min-h-[200px] overflow-y-auto text-sm outline-none focus:ring-2 focus:ring-brand-cyan" data-placeholder="Step-by-step instructions..." />
                  </div>
                  <button onClick={handleAddKB} className="w-full bg-brand-cyan text-white font-bold py-4 rounded-xl shadow-lg hover:brightness-110 transition-all">Add to Database</button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={exportKB} className="bg-white border border-slate-200 py-3 rounded-2xl text-[10px] font-bold flex flex-col items-center gap-1 hover:border-brand-cyan shadow-sm transition-all"><Download className="w-4 h-4 text-brand-cyan" /> Export JSON</button>
                  <label className="bg-white border border-slate-200 py-3 rounded-2xl text-[10px] font-bold flex flex-col items-center gap-1 hover:border-brand-cyan cursor-pointer shadow-sm transition-all"><Upload className="w-4 h-4 text-brand-cyan" /> Import JSON<input type="file" className="hidden" accept=".json" onChange={importKB} /></label>
                </div>
                <button onClick={exportForCode} className="w-full bg-slate-800 text-white border border-slate-700 py-3 rounded-2xl text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-black shadow-md transition-all">
                  <Code className="w-4 h-4 text-brand-yellow" /> Export for Cloud Deployment
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden sticky top-24">
                <div className="p-6 border-b border-slate-50 bg-slate-50/50"><h2 className="font-bold text-slate-800 flex items-center gap-2"><Plus className="w-5 h-5 text-brand-cyan" />Asset Entry</h2></div>
                <div className="p-6 space-y-4">
                  <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="User email" value={newAsset.email} onChange={e => setNewAsset({...newAsset, email: e.target.value})} />
                  <div className="grid grid-cols-2 gap-2">
                    <input className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Laptop S/N" value={newAsset.laptop} onChange={e => setNewAsset({...newAsset, laptop: e.target.value})} />
                    <input className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Monitor S/N" value={newAsset.monitor} onChange={e => setNewAsset({...newAsset, monitor: e.target.value})} />
                    <input className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Dock S/N" value={newAsset.dockingStation} onChange={e => setNewAsset({...newAsset, dockingStation: e.target.value})} />
                    <input className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Headset S/N" value={newAsset.headset} onChange={e => setNewAsset({...newAsset, headset: e.target.value})} />
                    <input className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Keyboard S/N" value={newAsset.keyboard} onChange={e => setNewAsset({...newAsset, keyboard: e.target.value})} />
                    <input className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Mouse S/N" value={newAsset.mouse} onChange={e => setNewAsset({...newAsset, mouse: e.target.value})} />
                  </div>
                  <button onClick={handleAddAsset} className="w-full bg-brand-dark text-white font-bold py-4 rounded-xl shadow-lg hover:brightness-110 transition-all">Save Asset</button>
                </div>
              </div>
              <div className="bg-brand-cyan/5 rounded-3xl p-6 border-2 border-dashed border-brand-cyan/20 text-center">
                <FileSpreadsheet className="w-8 h-8 text-brand-cyan mx-auto mb-2 opacity-50" />
                <h3 className="font-bold text-brand-cyan text-sm mb-3">Bulk Serial Upload</h3>
                <label className="inline-flex items-center gap-2 bg-white border border-brand-cyan/30 text-brand-cyan px-6 py-3 rounded-2xl font-bold text-xs cursor-pointer hover:bg-white/50 transition-all shadow-sm"><Upload className="w-4 h-4" /> Upload CSV File<input type="file" className="hidden" accept=".csv" onChange={handleCSVUpload} /></label>
                <p className="text-[9px] text-slate-400 mt-3 uppercase tracking-widest font-bold">Format: Serial, Type, Email</p>
              </div>
            </>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="relative group"><input type="text" placeholder="Search database..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-5 pl-14 bg-white border border-slate-200 rounded-3xl shadow-sm outline-none focus:ring-2 focus:ring-brand-cyan transition-all" /><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-brand-cyan transition-colors" /></div>
          <div className="space-y-4">
            {activeTab === 'knowledge' ? (
              filteredEntries.length > 0 ? filteredEntries.map(entry => (
                <div key={entry.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:shadow-md transition-all">
                  {editingId === entry.id ? (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <input id={`edit-q-${entry.id}`} defaultValue={entry.question} className="w-full p-4 border-2 border-brand-cyan rounded-2xl font-bold outline-none" />
                      <div ref={editEditorRef} contentEditable onPaste={handlePaste} className="w-full p-4 border-2 border-brand-cyan rounded-2xl min-h-[250px] outline-none bg-slate-50" dangerouslySetInnerHTML={{ __html: entry.answer }} />
                      <div className="flex gap-2"><button onClick={() => handleSaveEditKB(entry.id)} className="bg-brand-cyan text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:brightness-110 transition-all"><Save className="w-5 h-5" /> Update Solution</button><button onClick={() => setEditingId(null)} className="bg-slate-100 text-slate-600 px-8 py-3 rounded-2xl font-bold">Cancel</button></div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-4"><h3 className="text-xl font-bold text-brand-dark pr-12">{entry.question}</h3><div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => setEditingId(entry.id)} className="p-3 text-slate-400 hover:text-brand-cyan transition-colors"><Edit2 className="w-5 h-5" /></button><button onClick={() => handleDeleteKB(entry.id)} className="p-3 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button></div></div>
                      <div className="text-slate-600 text-sm rich-answer leading-relaxed" dangerouslySetInnerHTML={{ __html: entry.answer }} />
                    </>
                  )}
                </div>
              )) : <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200"><Database className="w-16 h-16 text-slate-200 mx-auto mb-4" /><p className="text-slate-400 font-bold">No results found in your Knowledge Base.</p></div>
            ) : filteredAssets.length > 0 ? filteredAssets.map(asset => (
                <div key={asset.email} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group flex flex-col hover:shadow-md transition-all">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-5">
                      <div className="bg-brand-cyan/10 p-4 rounded-2xl text-brand-cyan shadow-inner"><User className="w-8 h-8" /></div>
                      <div><h3 className="text-lg font-black text-brand-dark">{asset.email}</h3><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Asset Custody</p></div>
                    </div>
                    <button onClick={() => handleDeleteAsset(asset.email)} className="p-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-6 h-6" /></button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(asset).map(([key, value]) => key !== 'email' && value && (
                      <div key={key} className="text-[11px] bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col">
                        <span className="text-slate-400 uppercase font-black text-[9px] mb-1">{key}</span>
                        <span className="font-mono text-slate-800 font-bold break-all">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )) : <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200"><User className="w-16 h-16 text-slate-200 mx-auto mb-4" /><p className="text-slate-400 font-bold">No equipment records matching your search.</p></div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};
