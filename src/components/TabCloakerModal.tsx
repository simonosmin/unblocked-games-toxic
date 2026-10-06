import React, { useState, useEffect } from 'react';
import { Shield, Check, Globe, AlertTriangle, Key, ExternalLink, RefreshCw } from 'lucide-react';

export interface TabCloakProfile {
  id: string;
  name: string;
  title: string;
  favicon: string;
}

export const CLOAK_PROFILES: TabCloakProfile[] = [
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Classes',
    favicon: 'https://ssl.gstatic.com/classroom/favicon.png'
  },
  {
    id: 'drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    favicon: 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png'
  },
  {
    id: 'docs',
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    favicon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico'
  },
  {
    id: 'khan',
    name: 'Khan Academy',
    title: 'Dashboard | Khan Academy',
    favicon: 'https://www.khanacademy.org/favicon.ico'
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard',
    favicon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico'
  },
  {
    id: 'default',
    name: 'Toxic Default',
    title: 'Toxic Desktop',
    favicon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310b981'><path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/></svg>"
  }
];

interface TabCloakerModalProps {
  onClose: () => void;
  activeProfile: string;
  onSelectProfile: (profile: TabCloakProfile) => void;
  panicKey: string;
  onSetPanicKey: (key: string) => void;
  panicUrl: string;
  onSetPanicUrl: (url: string) => void;
}

export const TabCloakerModal: React.FC<TabCloakerModalProps> = ({
  onClose,
  activeProfile,
  onSelectProfile,
  panicKey,
  onSetPanicKey,
  panicUrl,
  onSetPanicUrl
}) => {
  const [customTitle, setCustomTitle] = useState('');
  const [customFavicon, setCustomFavicon] = useState('');
  const [isRecordingKey, setIsRecordingKey] = useState(false);

  useEffect(() => {
    if (!isRecordingKey) return;
    const handleKey = (e: KeyboardEvent) => {
      e.preventDefault();
      onSetPanicKey(e.key);
      setIsRecordingKey(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isRecordingKey, onSetPanicKey]);

  const handleApplyCustom = () => {
    if (!customTitle) return;
    onSelectProfile({
      id: 'custom',
      name: 'Custom Cloak',
      title: customTitle,
      favicon: customFavicon || CLOAK_PROFILES[0].favicon
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="bg-[#0e141c] border border-emerald-500/30 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0a0f15] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Tab Cloaker & Stealth Settings</h2>
              <p className="text-xs text-slate-400">Mask tab title and favicon</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Preset Profiles */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Preset Stealth Profiles
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {CLOAK_PROFILES.map(p => {
                const isSelected = activeProfile === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectProfile(p)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-semibold'
                        : 'border-slate-800 bg-[#121922] text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <img
                        src={p.favicon}
                        alt=""
                        className="w-4 h-4 rounded-sm object-contain shrink-0"
                        onError={e => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310b981'><path d='M12 2L2 7l10 5 10-5-10-5z'/></svg>";
                        }}
                      />
                      <span className="truncate">{p.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Cloak Form */}
          <div className="bg-[#121a24] p-4 rounded-xl border border-slate-800">
            <h3 className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-emerald-400" /> Custom Mask Profile
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Custom Tab Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  placeholder="e.g. Biology Assignment 4 - Period 3"
                  className="w-full bg-[#0a0f15] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Custom Favicon URL (Optional)</label>
                <input
                  type="text"
                  value={customFavicon}
                  onChange={e => setCustomFavicon(e.target.value)}
                  placeholder="https://example.com/favicon.ico"
                  className="w-full bg-[#0a0f15] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                onClick={handleApplyCustom}
                disabled={!customTitle}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-2 rounded-lg text-xs transition-colors"
              >
                Apply Custom Cloak
              </button>
            </div>
          </div>

          {/* Panic Key Settings */}
          <div className="bg-[#121a24] p-4 rounded-xl border border-slate-800">
            <h3 className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Key className="w-3.5 h-3.5 text-amber-400" /> Emergency Panic Key
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Pressing this key anywhere in the app immediately redirects the window to your chosen decoy destination.
            </p>
            <div className="grid grid-cols-2 gap-3 items-center">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Trigger Key</label>
                <button
                  onClick={() => setIsRecordingKey(true)}
                  className={`w-full py-2 px-3 rounded-lg border text-xs font-mono font-bold transition-colors ${
                    isRecordingKey
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 animate-pulse'
                      : 'border-slate-700 bg-[#0a0f15] text-slate-200 hover:border-slate-600'
                  }`}
                >
                  {isRecordingKey ? 'Press any key...' : `Key: [ ${panicKey} ]`}
                </button>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Decoy Redirect URL</label>
                <input
                  type="text"
                  value={panicUrl}
                  onChange={e => onSetPanicUrl(e.target.value)}
                  className="w-full bg-[#0a0f15] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
              </div>
            </div>
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
