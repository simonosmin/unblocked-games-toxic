import React, { useState } from 'react';
import { Settings, Image, Clock, Shield, MapPin, Check, Globe } from 'lucide-react';
import { WORLD_LOCATIONS, getEffectiveTimezone, getLocationDisplayName } from '../utils/locationTime';

export interface WallpaperOption {
  id: string;
  name: string;
  type: 'image' | 'matrix' | 'solid';
  url?: string;
  previewColor?: string;
}

export const WALLPAPER_PRESETS: WallpaperOption[] = [
  {
    id: 'toxic-neon',
    name: 'Toxic Cyber Neon',
    type: 'image',
    url: '/src/assets/images/toxic_neon_wallpaper_1791250801546.jpg'
  },
  {
    id: 'retro-synthwave',
    name: 'Retro Synthwave Grid',
    type: 'image',
    url: '/src/assets/images/toxic_retro_grid_1791250792186.jpg'
  },
  {
    id: 'matrix-canvas',
    name: 'Matrix Digital Rain (Live Canvas)',
    type: 'matrix'
  },
  {
    id: 'deep-obsidian',
    name: 'Obsidian Dark Minimal',
    type: 'solid',
    previewColor: '#070b0e'
  },
  {
    id: 'emerald-aurora',
    name: 'Emerald Cyber Glow',
    type: 'solid',
    previewColor: 'linear-gradient(135deg, #064e3b 0%, #022c22 50%, #070b0e 100%)'
  }
];

interface SettingsModalProps {
  onClose: () => void;
  currentWallpaper: string;
  onSetWallpaper: (id: string, customUrl?: string) => void;
  showSeconds: boolean;
  onToggleShowSeconds: (val: boolean) => void;
  timeFormat24: boolean;
  onToggleTimeFormat24: (val: boolean) => void;
  locationId: string;
  onSetLocationId: (id: string) => void;
  onOpenCloaker: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  currentWallpaper,
  onSetWallpaper,
  showSeconds,
  onToggleShowSeconds,
  timeFormat24,
  onToggleTimeFormat24,
  locationId,
  onSetLocationId,
  onOpenCloaker
}) => {
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState('');
  const activeTz = getEffectiveTimezone(locationId);
  const activeCity = getLocationDisplayName(activeTz);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="bg-[#0e141c] border border-emerald-500/30 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0a0f15] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Desktop Environment Settings</h2>
              <p className="text-xs text-slate-400">Personalize wallpaper, clock, and system</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Wallpaper Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Image className="w-3.5 h-3.5 text-emerald-400" /> Desktop Wallpaper
            </label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {WALLPAPER_PRESETS.map(wp => {
                const isSelected = currentWallpaper === wp.id;
                return (
                  <button
                    key={wp.id}
                    onClick={() => onSetWallpaper(wp.id)}
                    className={`relative p-3 rounded-xl border text-left transition-all overflow-hidden flex flex-col gap-2 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-semibold'
                        : 'border-slate-800 bg-[#121922] text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className="h-16 rounded-lg w-full bg-slate-900 border border-slate-800/80 overflow-hidden flex items-center justify-center"
                      style={{
                        background:
                          wp.type === 'image'
                            ? `url(${wp.url}) center/cover`
                            : wp.previewColor || '#0a1017'
                      }}
                    >
                      {wp.type === 'matrix' && (
                        <span className="font-mono text-emerald-400 text-xs font-bold tracking-widest">
                          0101_RUN
                        </span>
                      )}
                    </div>
                    <span className="text-xs truncate">{wp.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Wallpaper Input */}
            <div className="bg-[#121a24] p-3 rounded-xl border border-slate-800 flex gap-2">
              <input
                type="text"
                value={customWallpaperUrl}
                onChange={e => setCustomWallpaperUrl(e.target.value)}
                placeholder="Or paste custom image URL..."
                className="flex-1 bg-[#0a0f15] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => {
                  if (customWallpaperUrl.trim()) {
                    onSetWallpaper('custom', customWallpaperUrl.trim());
                  }
                }}
                disabled={!customWallpaperUrl.trim()}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-bold px-3 py-1.5 rounded-lg text-xs"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Desktop Clock Options */}
          <div className="bg-[#121a24] p-4 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Desktop Clock & Location Time
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-normal">
                {activeCity} ({activeTz})
              </span>
            </h3>

            {/* Location Selector */}
            <div>
              <label className="text-[11px] text-slate-400 block mb-2 font-medium flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-emerald-400" /> Geographic Location / Time Zone
              </label>
              <div className="grid grid-cols-2 gap-2">
                {WORLD_LOCATIONS.map(loc => {
                  const isSelected = locationId === loc.id;
                  return (
                    <button
                      key={loc.id}
                      onClick={() => onSetLocationId(loc.id)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg border text-left text-xs transition-colors ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-semibold'
                          : 'border-slate-800 bg-[#0c1219] text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <span className="truncate flex items-center gap-1.5">
                        <span>{loc.flag}</span>
                        <span className="truncate">{loc.name}</span>
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
              <div>
                <div className="text-xs text-white font-medium">Show Seconds</div>
                <div className="text-[11px] text-slate-400">Display digital live second ticks</div>
              </div>
              <input
                type="checkbox"
                checked={showSeconds}
                onChange={e => onToggleShowSeconds(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <div>
                <div className="text-xs text-white font-medium">24-Hour Military Format</div>
                <div className="text-[11px] text-slate-400">Switch between 12-hour AM/PM and 24-hour clock</div>
              </div>
              <input
                type="checkbox"
                checked={timeFormat24}
                onChange={e => onToggleTimeFormat24(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Tab Cloaker Quick Access */}
          <div className="bg-[#121a24] p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-white font-medium flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> Tab Cloaker & Privacy
              </div>
              <div className="text-[11px] text-slate-400">
                Disguise tab title and icon as Google Classroom, Docs, or Drive
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenCloaker();
              }}
              className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-3 py-1.5 rounded-lg text-xs transition-colors shrink-0"
            >
              Configure
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#0a0f15] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-2 rounded-lg text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
