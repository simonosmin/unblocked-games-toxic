import React, { useState, useEffect } from 'react';
import { GamesCatalog } from './components/GamesCatalog';
import { GameRunner } from './components/GameRunner';
import { Toxify } from './components/Toxify';
import { SearchEngine } from './components/SearchEngine';
import { DesktopClock } from './components/DesktopClock';
import { Taskbar } from './components/Taskbar';
import { TabCloakerModal, TabCloakProfile, CLOAK_PROFILES } from './components/TabCloakerModal';
import { SettingsModal, WALLPAPER_PRESETS } from './components/SettingsModal';
import { MatrixBackground } from './components/MatrixBackground';
import { GameItem, GAMES_CATALOG } from './data/games';
import { toxifySynth } from './utils/audioSynth';
import { Gamepad2, Radio, Search, Shield, Settings, Sparkles, FolderCode } from 'lucide-react';

export default function App() {
  // Desktop state
  const [activeWindow, setActiveWindow] = useState<'games' | 'toxify' | 'search' | null>('games');
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('toxic_favs');
      return saved ? JSON.parse(saved) : { 'game-1': true, 'game-2': true, 'game-3': true };
    } catch {
      return {};
    }
  });

  // Settings state
  const [wallpaperId, setWallpaperId] = useState<string>('toxic-neon');
  const [customWallpaper, setCustomWallpaper] = useState<string>('');
  const [showSeconds, setShowSeconds] = useState(true);
  const [timeFormat24, setTimeFormat24] = useState(false);
  const [locationId, setLocationId] = useState<string>(() => {
    try {
      return localStorage.getItem('toxic_location') || 'auto';
    } catch {
      return 'auto';
    }
  });
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCloakerModal, setShowCloakerModal] = useState(false);

  const handleSetLocationId = (id: string) => {
    setLocationId(id);
    try {
      localStorage.setItem('toxic_location', id);
    } catch {}
  };

  // Tab cloaker state
  const [cloakProfile, setCloakProfile] = useState<string>('default');
  const [panicKey, setPanicKey] = useState<string>('`');
  const [panicUrl, setPanicUrl] = useState<string>('https://classroom.google.com');

  // Favorites persistence
  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = { ...prev, [id]: !prev[id] };
      if (!next[id]) delete next[id];
      try {
        localStorage.setItem('toxic_favs', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Apply tab cloak title and favicon dynamically
  const applyCloak = (profile: TabCloakProfile) => {
    setCloakProfile(profile.id);
    document.title = profile.title;
    const faviconLink = document.getElementById('dynamic-favicon') as HTMLLinkElement | null;
    if (faviconLink) {
      faviconLink.href = profile.favicon;
    }
  };

  // Listen for panic key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is actively typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      if (e.key === panicKey) {
        e.preventDefault();
        window.location.href = panicUrl;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panicKey, panicUrl]);

  // Determine wallpaper style
  const currentPreset = WALLPAPER_PRESETS.find(w => w.id === wallpaperId) || WALLPAPER_PRESETS[0];

  const getWallpaperBackgroundStyle = () => {
    if (wallpaperId === 'custom' && customWallpaper) {
      return {
        backgroundImage: `url(${customWallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    if (currentPreset.type === 'image' && currentPreset.url) {
      return {
        backgroundImage: `url(${currentPreset.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    if (currentPreset.previewColor) {
      return {
        background: currentPreset.previewColor
      };
    }
    return {
      backgroundColor: '#070b0e'
    };
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col font-sans select-none bg-[#070b0e]">
      {/* Background Wallpaper Layer */}
      <div
        className="absolute inset-0 transition-all duration-700 pointer-events-none"
        style={getWallpaperBackgroundStyle()}
      >
        {/* If Matrix Canvas is selected */}
        {wallpaperId === 'matrix-canvas' && <MatrixBackground />}

        {/* Ambient Dark Overlay */}
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"></div>
      </div>

      {/* Desktop Main Stage */}
      <div className="relative flex-1 p-4 md:p-6 flex flex-col overflow-hidden z-10">
        {/* Prominent Desktop Clock & Brand Header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          {/* Brand Wordmark in Cursive */}
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-cursive font-bold text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]">
              toxic
            </h1>
            <div className="hidden sm:block text-xs text-slate-400 font-medium pl-2 border-l border-slate-700/60">
              Desktop Arcade & Media
            </div>
          </div>

          {/* Large Center Desktop Clock Widget */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-4">
            <DesktopClock
              showSeconds={showSeconds}
              timeFormat24={timeFormat24}
              locationId={locationId}
              onOpenSettings={() => setShowSettingsModal(true)}
            />
          </div>

          {/* Desktop Quick Shortcuts */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCloakerModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0e1622]/80 hover:bg-slate-800 text-xs font-medium text-slate-300 border border-slate-800 transition-colors shadow-sm"
              title="Configure Tab Cloak (Classroom, Drive, Docs)"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Tab Cloak</span>
            </button>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0e1622]/80 hover:bg-slate-800 text-xs font-medium text-slate-300 border border-slate-800 transition-colors shadow-sm"
              title="Wallpaper & Settings"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>

        {/* Mobile Clock when screen is small */}
        <div className="block lg:hidden my-2 text-center shrink-0">
          <DesktopClock
            showSeconds={showSeconds}
            timeFormat24={timeFormat24}
            locationId={locationId}
            onOpenSettings={() => setShowSettingsModal(true)}
          />
        </div>

        {/* Center Desktop Windows Container */}
        <div className="flex-1 w-full h-full overflow-hidden relative">
          {/* Toxic Arcade Games Window */}
          {activeWindow === 'games' && (
            <div className="w-full h-full">
              <GamesCatalog
                onPlayGame={game => setSelectedGame(game)}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          )}

          {/* Toxify Music Window */}
          {activeWindow === 'toxify' && (
            <div className="w-full h-full max-w-6xl mx-auto">
              <Toxify />
            </div>
          )}

          {/* Search Engine & Code Sandbox Window */}
          {activeWindow === 'search' && (
            <div className="w-full h-full max-w-6xl mx-auto">
              <SearchEngine />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Taskbar */}
      <Taskbar
        activeWindow={activeWindow}
        onOpenWindow={win => setActiveWindow(win)}
        onToggleSettings={() => setShowSettingsModal(true)}
        onToggleCloaker={() => setShowCloakerModal(true)}
        onTriggerPanic={() => (window.location.href = panicUrl)}
        timeFormat24={timeFormat24}
        locationId={locationId}
        isPlayingMusic={toxifySynth.getIsPlaying()}
      />

      {/* Fullscreen / Modal Game Runner */}
      {selectedGame && (
        <GameRunner
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
          isFavorite={!!favorites[selectedGame.id]}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
          currentWallpaper={wallpaperId}
          onSetWallpaper={(id, customUrl) => {
            setWallpaperId(id);
            if (customUrl) setCustomWallpaper(customUrl);
          }}
          showSeconds={showSeconds}
          onToggleShowSeconds={setShowSeconds}
          timeFormat24={timeFormat24}
          onToggleTimeFormat24={setTimeFormat24}
          locationId={locationId}
          onSetLocationId={handleSetLocationId}
          onOpenCloaker={() => {
            setShowSettingsModal(false);
            setShowCloakerModal(true);
          }}
        />
      )}

      {/* Tab Cloaker Modal */}
      {showCloakerModal && (
        <TabCloakerModal
          onClose={() => setShowCloakerModal(false)}
          activeProfile={cloakProfile}
          onSelectProfile={applyCloak}
          panicKey={panicKey}
          onSetPanicKey={setPanicKey}
          panicUrl={panicUrl}
          onSetPanicUrl={setPanicUrl}
        />
      )}
    </div>
  );
}
