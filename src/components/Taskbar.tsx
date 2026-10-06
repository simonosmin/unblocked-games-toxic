import React, { useState } from 'react';
import { Gamepad2, Radio, Search, Settings, Shield, AlertOctagon } from 'lucide-react';
import { formatTimeInLocation, getEffectiveTimezone } from '../utils/locationTime';

interface TaskbarProps {
  activeWindow: 'games' | 'toxify' | 'search' | null;
  onOpenWindow: (win: 'games' | 'toxify' | 'search') => void;
  onToggleSettings: () => void;
  onToggleCloaker: () => void;
  onTriggerPanic: () => void;
  timeFormat24: boolean;
  locationId: string;
  isPlayingMusic: boolean;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  activeWindow,
  onOpenWindow,
  onToggleSettings,
  onToggleCloaker,
  onTriggerPanic,
  timeFormat24,
  locationId,
  isPlayingMusic
}) => {
  const [startOpen, setStartOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const tz = getEffectiveTimezone(locationId);
  const timeInfo = formatTimeInLocation(time, tz, timeFormat24);

  return (
    <>
      {/* Start Menu Drawer */}
      {startOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setStartOpen(false)}
        >
          <div
            className="absolute bottom-14 left-3 w-72 bg-[#0c1219] border border-emerald-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl space-y-2 select-none"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="text-2xl font-cursive text-emerald-400 font-bold px-1">toxic</div>
              <div className="text-[11px] text-slate-400">Desktop Web Environment</div>
            </div>

            <div className="space-y-1 py-1">
              <button
                onClick={() => {
                  onOpenWindow('games');
                  setStartOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors"
              >
                <Gamepad2 className="w-4 h-4 text-emerald-400" />
                <span>Toxic Games (1,129)</span>
              </button>
              <button
                onClick={() => {
                  onOpenWindow('toxify');
                  setStartOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors"
              >
                <Radio className="w-4 h-4 text-emerald-400" />
                <span>Toxify Music</span>
              </button>
              <button
                onClick={() => {
                  onOpenWindow('search');
                  setStartOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors"
              >
                <Search className="w-4 h-4 text-emerald-400" />
                <span>Search & Code Sandbox</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-1">
              <button
                onClick={() => {
                  onToggleCloaker();
                  setStartOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Tab Cloaker & Privacy</span>
              </button>
              <button
                onClick={() => {
                  onToggleSettings();
                  setStartOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Wallpaper & Settings</span>
              </button>
              <button
                onClick={() => {
                  onTriggerPanic();
                  setStartOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors font-medium"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>Trigger Panic Decoy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Taskbar Container */}
      <div className="h-12 bg-[#080c11]/90 backdrop-blur-md border-t border-slate-800/80 px-4 flex items-center justify-between z-30 select-none">
        {/* Left: Start Menu Button + Active Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStartOpen(!startOpen)}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
              startOpen
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                : 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            <span className="font-cursive text-lg font-bold">toxic</span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1"></div>

          {/* Window Buttons */}
          <button
            onClick={() => onOpenWindow('games')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors ${
              activeWindow === 'games'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Games (1129)</span>
          </button>

          <button
            onClick={() => onOpenWindow('toxify')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors ${
              activeWindow === 'toxify'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Toxify</span>
            {isPlayingMusic && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => onOpenWindow('search')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors ${
              activeWindow === 'search'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search & Code</span>
          </button>
        </div>

        {/* Right: System Tray */}
        <div className="flex items-center gap-2">
          {/* Quick Panic Button */}
          <button
            onClick={onTriggerPanic}
            title="Emergency Panic Decoy (Redirection)"
            className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
          </button>

          {/* Tab Cloaker */}
          <button
            onClick={onToggleCloaker}
            title="Tab Cloaker"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
          </button>

          {/* Settings */}
          <button
            onClick={onToggleSettings}
            title="Desktop Settings"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Clock & Location */}
          <div
            onClick={onToggleSettings}
            title={`Location: ${timeInfo.locationName} (${tz}) · Click to change`}
            className="px-2 py-1 rounded-lg text-xs font-mono text-slate-300 font-semibold tabular-nums cursor-pointer hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <span>{timeInfo.hours}:{timeInfo.minutes}</span>
            {!timeFormat24 && <span className="text-[10px] text-slate-400 font-sans">{timeInfo.ampm}</span>}
          </div>
        </div>
      </div>
    </>
  );
};
