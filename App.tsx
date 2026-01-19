
import React, { useState, useEffect, useRef } from 'react';
import { AdminPanel } from './components/AdminPanel';
import { Logo } from './components/Logo';
import { getKB, incrementAccessCount, findAssetByEmail } from './services/storage';
import { askGemini } from './services/gemini';
import { Message, KBEntry, AssetEntry } from './types';
import { Send, Settings, User, ChevronLeft, ShieldCheck, ThumbsUp, ThumbsDown, Lock, Info, X, MessageSquareText, Copy, Check, Laptop, Monitor, Headphones, Hash, Keyboard, Mouse, Building2, Mail } from 'lucide-react';

const ADMIN_PASSWORD = 'AdminSAM123';

const STOP_WORDS = new Set(['how', 'do', 'i', 'the', 'a', 'to', 'for', 'in', 'on', 'with', 'at', 'by', 'is', 'am', 'are', 'can', 'help', 'you', 'my', 'me', 'please', 'tell', 'show', 'check', 'want', 'need', 'issue', 'problem', 'what', 'should', 'it', 'from', 'about', 'some', 'any', 'that', 'this', 'was', 'were', 'has', 'have', 'had']);

const TECH_WEIGHTS: Record<string, number> = {
  'vpn': 60, 'password': 50, 'reset': 35, 'outlook': 50, 'email': 35, 'wifi': 50, 'internet': 40, 
  'printer': 45, 'laptop': 35, 'monitor': 35, 'dock': 35, 'keyboard': 25, 'mouse': 25,
  'teams': 45, 'zoom': 45, 'license': 35, 'software': 25, 'install': 35, 'access': 30,
  'login': 35, 'account': 30, 'slow': 25, 'broken': 25, 'error': 35
};

const AssetDisplay: React.FC<{ assets: AssetEntry }> = ({ assets }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const copy = (val: string, field: string) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const AssetRow = ({ icon: Icon, label, value, field }: { icon: any, label: string, value: string, field: string }) => (
    <div className="flex items-start justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group transition-all hover:bg-white hover:shadow-sm">
      <div className="flex items-start gap-3 flex-1 pr-4">
        <div className="bg-brand-cyan/10 p-2 rounded-lg shrink-0 mt-0.5"><Icon className="w-4 h-4 text-brand-cyan" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">{label}</p>
          <p className="text-sm font-mono font-bold text-slate-800 mt-1 break-words">{value || 'N/A'}</p>
        </div>
      </div>
      {value && (
        <button onClick={() => copy(value, field)} className="p-2 text-slate-300 hover:text-brand-cyan shrink-0">
          {copiedField === field ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      )}
    </div>
  );

  return (
    <div className="mt-4 bg-white border-2 border-slate-100 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-brand-dark p-3 flex items-center justify-between">
        <h4 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-brand-yellow" />Asset Custody Report</h4>
        <span className="text-[9px] text-slate-400 font-bold">{assets.email}</span>
      </div>
      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white">
        <AssetRow icon={Laptop} label="Laptop" value={assets.laptop} field="laptop" />
        <AssetRow icon={Monitor} label="Monitor(s)" value={assets.monitor} field="monitor" />
        <AssetRow icon={Headphones} label="Headset" value={assets.headset} field="headset" />
        <AssetRow icon={Hash} label="Docking Station" value={assets.dockingStation} field="docking" />
        <AssetRow icon={Keyboard} label="Keyboard" value={assets.keyboard} field="kb" />
        <AssetRow icon={Mouse} label="Mouse" value={assets.mouse} field="mouse" />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [adminLoginError, setAdminLoginError] = useState(false);
  
  const [agency, setAgency] = useState<string>('');
  const [awaitingAgencyName, setAwaitingAgencyName] = useState(false);
  const [awaitingEmailForCustody, setAwaitingEmailForCustody] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userAssets, setUserAssets] = useState<AssetEntry | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    incrementAccessCount();
    setMessages([
      { id: '1', role: 'assistant', content: "Hi there! I'm SAM, your dedicated IT Support Agent. Ask me about software, hardware, or your office equipment custody!" },
      { id: '2', role: 'assistant', content: "Before we begin, what is your agency?", choices: ['Assembly global', 'Stagwell', 'Other'] }
    ]);
  }, []);

  useEffect(() => { if (!isAdmin) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping, isAdmin]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassInput === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setAdminPassInput('');
      setAdminLoginError(false);
    } else {
      setAdminLoginError(true);
      setAdminPassInput('');
    }
  };

  const handleChoiceClick = (choice: string) => {
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: choice };
    setMessages(prev => [...prev, userMsg]);
    if (choice === 'Other') {
      setAwaitingAgencyName(true);
      setTimeout(() => setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: "Please enter your agency name:" }]), 600);
    } else {
      setAgency(choice);
      setTimeout(() => setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: `How can I assist you at ${choice} today?` }]), 600);
    }
  };

  const findBestKBMatch = async (input: string): Promise<KBEntry | null> => {
    const kb = await getKB();
    const cleanInput = input.toLowerCase().trim().replace(/[?!.]/g, '');
    const queryTokens = cleanInput.split(/\s+/).filter(t => t.length > 2 && !STOP_WORDS.has(t));
    if (queryTokens.length === 0) return null;

    let bestEntry: KBEntry | null = null;
    let maxScore = 0;

    kb.forEach(entry => {
      const q = entry.question.toLowerCase().trim().replace(/[?!.]/g, '');
      const qTokens = q.split(/\s+/).filter(t => t.length > 2 && !STOP_WORDS.has(t));
      let score = 0;
      let matchedSignificantTokens = 0;
      if (q === cleanInput) score += 300;
      queryTokens.forEach(token => {
        if (q.includes(token)) {
          score += TECH_WEIGHTS[token] || 15;
          matchedSignificantTokens++;
        } else if (TECH_WEIGHTS[token]) score -= 25; 
      });
      const lengthRatio = Math.min(qTokens.length, queryTokens.length) / Math.max(qTokens.length, queryTokens.length);
      score = score * (0.5 + 0.5 * lengthRatio);
      const threshold = Math.max(35, queryTokens.length * 10);
      if (score > maxScore && score >= threshold && matchedSignificantTokens >= (queryTokens.length > 1 ? 2 : 1)) {
        maxScore = score;
        bestEntry = entry;
      }
    });
    return bestEntry;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const currentInput = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: currentInput }]);

    if (awaitingAgencyName) {
      setAgency(currentInput);
      setAwaitingAgencyName(false);
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: `How can I assist you at ${currentInput} today?` }]);
        setIsTyping(false);
      }, 800);
      return;
    }

    if (awaitingEmailForCustody) {
      setIsTyping(true);
      setAwaitingEmailForCustody(false);
      const asset = await findAssetByEmail(currentInput);
      setTimeout(() => {
        if (asset) {
          setUserAssets(asset);
          setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: `I've found equipment records for ${currentInput}:`, assetData: asset }]);
        } else {
          setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: `I couldn't find any equipment records for **${currentInput}**. Please verify the email or contact IT.` }]);
        }
        setIsTyping(false);
        setShowFeedback(true);
      }, 800);
      return;
    }

    setIsTyping(true);
    setShowFeedback(false);
    const inputLower = currentInput.toLowerCase();
    const troubleWords = ['slow', 'broken', 'fix', 'problem', 'issue', 'not working', 'error', 'failed', 'repair', 'crash'];
    const infoWords = ['serial', 'sn', 'tag', 'asset', 'custody', 'assigned', 'inventory', 'my equipment', 'what gear'];
    if (!troubleWords.some(w => inputLower.includes(w)) && (infoWords.some(w => inputLower.includes(w)) || (['laptop', 'monitor', 'pc', 'dock'].some(h => inputLower.includes(h)) && ['check', 'show', 'what'].some(a => inputLower.includes(a))))) {
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: "I can look up your assigned equipment. Please provide your corporate email address:" }]);
        setAwaitingEmailForCustody(true);
        setIsTyping(false);
      }, 600);
      return;
    }

    const match = await findBestKBMatch(currentInput);
    if (match) {
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: match.answer, isKBMatch: true }]);
        setIsTyping(false);
        setShowFeedback(true);
      }, 800);
    } else {
      const aiResponse = await askGemini(currentInput, messages.filter(m => !m.choices));
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: aiResponse, isKBMatch: false }]);
      setIsTyping(false);
      setShowFeedback(true);
    }
  };

  const generateEmailBody = (status: 'RESOLVED' | 'UNRESOLVED') => {
    let body = `--- SAM IT Support Report (${status}) ---\n\nAgency: ${agency || 'Unknown'}\n\nHistory:\n`;
    messages.forEach(m => { if (!m.choices) body += `${m.role === 'user' ? 'User' : 'SAM'}: ${m.content.replace(/<[^>]*>?/gm, '')}\n\n`; });
    return body;
  };

  const sendSupportEmail = () => window.location.href = `mailto:itsupport@assemblyglobal.com?subject=IT Help [UNRESOLVED]&body=${encodeURIComponent(generateEmailBody('UNRESOLVED'))}`;
  const sendResolvedEmail = () => {
    window.location.href = `mailto:itsupport@assemblyglobal.com?cc=essam.rabie@stagwellgtg.com&subject=IT Resolved&body=${encodeURIComponent(generateEmailBody('RESOLVED'))}`;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: "Excellent! Session logged as resolved. Have a great day!" }]);
    setShowFeedback(false);
  };

  return (
    <div className="flex flex-col h-dvh bg-[#f8fafc] overflow-hidden">
      <header className="glass-header border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3"><Logo size="sm" /><h1 className="font-extrabold text-brand-dark text-lg hidden sm:block">SAM Agent</h1></div>
        <div className="flex items-center gap-2">
          {agency && <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200"><Building2 className="w-3.5 h-3.5 text-slate-500" /><span className="text-[11px] font-bold text-slate-700">{agency}</span></div>}
          <button onClick={() => setShowAbout(true)} className="p-2 text-slate-400 hover:text-brand-cyan"><Info className="w-5 h-5" /></button>
          <button onClick={() => setIsAdmin(!isAdmin)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${isAdmin ? 'bg-brand-dark text-white' : 'bg-white border border-slate-200'}`}>
            {isAdmin ? <><ChevronLeft className="w-4 h-4" /> Exit Admin</> : <><Settings className="w-4 h-4" /> IT Admin</>}
          </button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto relative">
        {showAbout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative text-center">
              <button onClick={() => setShowAbout(false)} className="absolute top-4 right-4 p-2 text-slate-400"><X className="w-5 h-5" /></button>
              <Logo size="md" /><h3 className="text-xl font-black text-brand-dark mt-4">About SAM Agent</h3>
              <p className="text-sm text-slate-600 mt-2">Professional IT Support Agent for corporate inventory and troubleshooting.</p>
              <button onClick={() => setShowAbout(false)} className="w-full mt-6 bg-brand-dark text-white py-4 rounded-xl font-bold">Close</button>
            </div>
          </div>
        )}
        {isAdmin ? (isAdminAuthenticated ? <AdminPanel /> : (
            <div className="flex items-center justify-center min-h-[60vh] p-6 animate-in zoom-in-95">
              <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl text-center space-y-6">
                <Lock className="w-10 h-10 text-brand-cyan mx-auto" /><h2 className="text-2xl font-black text-brand-dark">Admin Access</h2>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <input autoFocus type="password" value={adminPassInput} onChange={(e) => {setAdminPassInput(e.target.value); setAdminLoginError(false);}} placeholder="••••••••" className={`w-full p-4 bg-slate-50 border-2 rounded-2xl text-center text-lg outline-none focus:border-brand-cyan ${adminLoginError ? 'border-red-500 animate-shake' : 'border-slate-100'}`} />
                  <button type="submit" className="w-full bg-brand-dark text-white py-4 rounded-2xl font-bold">Unlock</button>
                </form>
              </div>
            </div>
          )) : (
          <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2`}>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-brand-dark text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'}`}>
                  {msg.role === 'assistant' && msg.isKBMatch && <div className="flex items-center gap-1.5 mb-2 text-brand-cyan font-bold text-[10px] uppercase border-b pb-1.5">Database Match</div>}
                  <div className="rich-answer" dangerouslySetInnerHTML={{ __html: msg.content }} />
                  {msg.choices && <div className="flex flex-wrap gap-2 mt-4">{msg.choices.map(c => <button key={c} onClick={() => handleChoiceClick(c)} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold text-brand-cyan">{c}</button>)}</div>}
                  {msg.assetData && <AssetDisplay assets={msg.assetData} />}
                </div>
              </div>
            ))}
            {isTyping && <div className="flex items-start gap-3"><div className="bg-white border p-4 rounded-2xl flex gap-1.5"><div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-100"></div><div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-200"></div></div></div>}
            {showFeedback && !isTyping && (
              <div className="bg-brand-cyan/5 border border-brand-cyan/10 rounded-3xl p-6 max-w-2xl mx-auto text-center space-y-6 animate-in fade-in duration-500">
                <h3 className="text-lg font-extrabold">Helpful response?</h3>
                <div className="flex flex-col gap-3 max-w-lg mx-auto">
                  <button onClick={() => setShowFeedback(false)} className="w-full bg-white border px-4 py-3 rounded-2xl font-bold flex items-center justify-center gap-2"><MessageSquareText className="w-5 h-5" /> Ask something else</button>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={sendResolvedEmail} className="bg-white border-2 border-brand-cyan text-brand-cyan py-3 rounded-2xl font-bold flex items-center justify-center gap-2"><ThumbsUp className="w-5 h-5" /> Yes</button>
                    <button onClick={sendSupportEmail} className="bg-brand-dark text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg"><ThumbsDown className="w-5 h-5" /> No</button>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} className="h-24" />
          </div>
        )}
      </main>
      {!isAdmin && (
        <footer className="bg-white border-t border-slate-200 px-4 py-6 shadow-2xl relative z-30">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder={awaitingAgencyName ? "Enter agency name..." : awaitingEmailForCustody ? "Enter corporate email..." : "Ask SAM about IT issues..."} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:border-brand-cyan" />
              <button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping} className="absolute right-2 top-2 bg-brand-cyan text-white p-3 rounded-xl"><Send className="w-6 h-6" /></button>
            </div>
            <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-3">Assembly Global IT Agent</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
