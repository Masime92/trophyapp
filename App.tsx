
import React, { useState, useEffect } from 'react';
import { Game, Achievement, Platform, UserSession } from './types';
import { translations, Language } from './translations';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import GameDetail from './components/GameDetail';
import Settings from './components/Settings';
import RoutePlanner from './components/RoutePlanner';
import { TrophyIcon, CpuChipIcon, ShieldExclamationIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [language, setLanguage] = useState<Language>('de');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStage, setSyncStage] = useState('');
  const [syncError, setSyncError] = useState<string | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [achievements, setAchievements] = useState<Record<string, Achievement[]>>({});
  const [session, setSession] = useState<UserSession | null>(null);

  const t = translations[language];

  useEffect(() => {
    const savedSession = localStorage.getItem('thp_session');
    if (savedSession) {
      const parsed = JSON.parse(savedSession);
      setSession(parsed);
      loadUserData(parsed);
    }
    const savedLang = localStorage.getItem('thp_lang');
    if (savedLang) setLanguage(savedLang as Language);
  }, []);

  useEffect(() => {
    localStorage.setItem('thp_lang', language);
  }, [language]);

  const loadUserData = async (currentSession: UserSession) => {
    setIsSyncing(true);
    setSyncError(null);
    
    const stages = [
      t.sync_stages.s1, 
      t.sync_stages.s2, 
      t.sync_stages.s3, 
      t.sync_stages.s4, 
      t.sync_stages.s5
    ];

    for (const stage of stages) {
      setSyncStage(stage);
      await new Promise(r => setTimeout(r, 600));
    }

    const libraryData = [
      { title: 'Counter-Strike 2', id: '730', f2p: true },
      { title: 'Warframe', id: '230410', f2p: true },
      { title: 'Hades II', id: '1145350' }, 
      { title: 'Ghost of Tsushima', id: '2215430' },
      { title: 'Elden Ring', id: '1245620' }, 
      { title: 'Cyberpunk 2077', id: '1091500' },
      { title: 'Baldur\'s Gate 3', id: '1086940' }, 
      { title: 'Stardew Valley', id: '413150' },
      { title: 'Vampire Survivors', id: '1794680' },
      { title: 'Apex Legends', id: '1172470', f2p: true },
      { title: 'Destiny 2', id: '1085660', f2p: true }
    ];

    const fetchedGames: Game[] = libraryData.map((item, idx) => {
      let rate = Math.floor(Math.random() * 100);
      if (idx === 0) rate = 92; 
      if (idx === 1) rate = 98;
      if (idx === 2) rate = 100;

      return {
        id: `steam_${item.id}`,
        title: item.title,
        platform: 'Steam' as Platform,
        coverUrl: `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${item.id}/header.jpg`,
        completionRate: rate,
        totalAchievements: 25 + Math.floor(Math.random() * 80),
        unlockedAchievements: 0,
        lastPlayed: new Date().toISOString()
      };
    }).map(g => {
       g.unlockedAchievements = Math.floor((g.completionRate / 100) * g.totalAchievements);
       return g;
    });

    const achievementsMap: Record<string, Achievement[]> = {};
    fetchedGames.forEach(game => {
      achievementsMap[game.id] = Array.from({ length: game.totalAchievements }).map((_, i) => ({
        id: `${game.id}_ach_${i}`,
        name: `Mission: ${game.title} - Phase ${i + 1}`,
        description: `Analysiere und eliminiere Target Alpha ${i + 1}.`,
        icon: `https://api.dicebear.com/7.x/identicon/svg?seed=${game.id}${i}`,
        isUnlocked: i < game.unlockedAchievements,
        isMissable: i % 12 === 0,
        isOnline: i % 18 === 0,
        isSecret: i % 7 === 0,
        rarity: Math.round(Math.random() * 30 + 0.1)
      }));
    });

    setGames(fetchedGames);
    setAchievements(achievementsMap);
    setIsSyncing(false);
  };

  const handleSync = () => session && loadUserData(session);

  const handleLogin = (platform: Platform, data: any) => {
    const newSession: UserSession = {
      platforms: { [platform]: true },
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      userId: data.steamId,
      displayName: data.displayName,
      avatarUrl: data.avatarUrl
    };
    setSession(newSession);
    localStorage.setItem('thp_session', JSON.stringify(newSession));
    loadUserData(newSession);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setSession(null);
    setGames([]);
    setAchievements({});
    setSyncError(null);
    localStorage.removeItem('thp_session');
    setActiveTab('settings');
  };

  const navigateToGame = (id: string) => {
    setSelectedGameId(id);
    setActiveTab('game-detail');
  };

  const getCompletionClass = (rate: number) => {
    if (rate === 100) return 'full-clear-glow';
    if (rate >= 95) return 'near-completion-intense';
    if (rate >= 90) return 'near-completion-subtle';
    return '';
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      isSyncing={isSyncing} 
      onSync={handleSync}
      language={language}
      setLanguage={setLanguage}
    >
      {isSyncing ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-12">
           <div className="relative">
              <div className="w-32 h-32 border-t-4 border-emerald-500 rounded-full animate-spin"></div>
              <CpuChipIcon className="w-12 h-12 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
           </div>
           <div className="text-center space-y-4">
             <h3 className="text-xl md:text-2xl font-black text-emerald-500 uppercase tracking-[0.4em] px-4">{syncStage}</h3>
             <div className="flex justify-center space-x-2">
                {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 bg-emerald-500/30 rounded-full animate-bounce" style={{animationDelay: `${i*0.2}s`}}></div>)}
             </div>
           </div>
        </div>
      ) : syncError ? (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-8 animate-in zoom-in-95 duration-500">
          <div className="p-8 bg-rose-500/10 rounded-full border border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.15)]">
            <ShieldExclamationIcon className="w-20 h-20 text-rose-500" />
          </div>
          <div className="space-y-6 max-w-xl">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-rose-500">Protocol_Access_Fault</h2>
            <p className="text-zinc-400 font-medium text-lg leading-relaxed">{syncError}</p>
          </div>
          <button onClick={() => setActiveTab('settings')} className="bg-zinc-100 text-black px-16 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white active:scale-95 transition-all shadow-2xl">
            Re-Initialize Auth
          </button>
        </div>
      ) : activeTab === 'library' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 pb-32">
          {games.map(g => (
            <div 
              key={g.id} 
              onClick={() => navigateToGame(g.id)} 
              className={`group relative aspect-[1/1.4] cursor-pointer bg-zinc-950 rounded-[2.5rem] overflow-hidden border border-zinc-900 hover:border-emerald-500 transition-all duration-700 shadow-2xl ${getCompletionClass(g.completionRate)}`}
            >
              <div className="w-full h-full overflow-hidden">
                <img src={g.coverUrl} className="w-full h-full object-cover grayscale-[0.6] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" alt={g.title} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-95 group-hover:opacity-50 transition-opacity"></div>
              
              <div className="absolute top-4 right-4 z-20">
                 <div className="bg-black/90 backdrop-blur-2xl border-2 border-emerald-500/20 w-16 h-16 rounded-2xl flex flex-col items-center justify-center shadow-2xl group-hover:border-emerald-500 transition-all scale-90 group-hover:scale-100">
                    <span className="text-2xl font-black text-emerald-400 font-mono leading-none tracking-tighter">{g.completionRate}</span>
                    <span className="text-[7px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">{t.status}</span>
                 </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 z-20 space-y-2">
                <h4 className="font-black text-sm uppercase tracking-tighter truncate text-white drop-shadow-2xl">{g.title}</h4>
                <div className="flex items-center space-x-2">
                   <div className="h-1.5 flex-1 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
                      <div className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]" style={{ width: `${g.completionRate}%` }}></div>
                   </div>
                   <span className="text-[9px] font-black text-zinc-500 font-mono tracking-tighter">{g.unlockedAchievements}/{g.totalAchievements}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === 'planning' ? (
        <RoutePlanner games={games} allAchievements={achievements} language={language} />
      ) : activeTab === 'settings' ? (
        <Settings session={session} onLogin={handleLogin} onLogout={handleLogout} language={language} />
      ) : activeTab === 'game-detail' && selectedGameId ? (
         <GameDetail game={games.find(g => g.id === selectedGameId)!} achievements={achievements[selectedGameId] || []} onBack={() => setActiveTab('library')} language={language} />
      ) : (
        <Dashboard games={games} onGameClick={navigateToGame} userSession={session} language={language} />
      )}
    </Layout>
  );
};

export default App;
