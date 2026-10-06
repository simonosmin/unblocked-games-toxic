import React, { useState } from 'react';
import { Radio, Music, Play, ExternalLink, Link2, Search, Heart, Sparkles, ListMusic, Disc, Volume2, Shield } from 'lucide-react';
import { toxifySynth } from '../utils/audioSynth';

export interface SpotifyPreset {
  id: string;
  title: string;
  creator: string;
  description: string;
  embedUri: string;
  category: 'lofi' | 'gaming' | 'synthwave' | 'phonk' | 'hits' | 'focus';
  coverGradient: string;
}

export const SPOTIFY_PRESETS: SpotifyPreset[] = [
  {
    id: 'lofi-beats',
    title: 'Lofi Beats',
    creator: 'Spotify',
    description: 'The iconic chill lo-fi study and gaming beats playlist with over 5M saves.',
    embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXWQRwui0ExPn?utm_source=generator&theme=0',
    category: 'lofi',
    coverGradient: 'from-amber-700 via-stone-800 to-[#0d1217]'
  },
  {
    id: 'gaming-lounge',
    title: 'Top Gaming Tracks 2026',
    creator: 'Spotify',
    description: 'High-energy electronic beats, bass, and trap curated for competitive gaming.',
    embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdfO2leQ337Q?utm_source=generator&theme=0',
    category: 'gaming',
    coverGradient: 'from-blue-700 via-indigo-900 to-[#0d1217]'
  },
  {
    id: 'synthwave-retro',
    title: 'Synthwave & Retrowave',
    creator: 'Spotify',
    description: 'Retro 80s analog synthesizers, neon outrun horizons, and cyberpunk dreamscapes.',
    embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXd9rSDyQguIk?utm_source=generator&theme=0',
    category: 'synthwave',
    coverGradient: 'from-fuchsia-800 via-purple-950 to-[#0d1217]'
  },
  {
    id: 'phonk-gaming',
    title: 'Phonk Gaming Drift',
    creator: 'Spotify',
    description: 'Aggressive drift phonk, memphis rap samples, and heavy distorted 808s.',
    embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWY64Hb7ZaEG?utm_source=generator&theme=0',
    category: 'phonk',
    coverGradient: 'from-red-800 via-neutral-900 to-[#0d1217]'
  },
  {
    id: 'deep-focus',
    title: 'Deep Focus & Flow',
    creator: 'Spotify',
    description: 'Calm atmospheric ambient pads and binaural tones for deep concentration.',
    embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ?utm_source=generator&theme=0',
    category: 'focus',
    coverGradient: 'from-emerald-800 via-teal-950 to-[#0d1217]'
  },
  {
    id: 'top-hits',
    title: "Today's Top Global Hits",
    creator: 'Spotify',
    description: 'The hottest real tracks trending worldwide right now on Spotify.',
    embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0',
    category: 'hits',
    coverGradient: 'from-violet-700 via-slate-900 to-[#0d1217]'
  }
];

export const Toxify: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'spotify' | 'offline'>('spotify');
  const [selectedPreset, setSelectedPreset] = useState<SpotifyPreset>(SPOTIFY_PRESETS[0]);
  const [customInput, setCustomInput] = useState('');
  const [activeEmbedUrl, setActiveEmbedUrl] = useState(SPOTIFY_PRESETS[0].embedUri);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({ 'lofi-beats': true, 'gaming-lounge': true });

  // Offline synth state
  const [offlinePlaying, setOfflinePlaying] = useState(false);
  const [offlineGenre, setOfflineGenre] = useState('lofi');

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    let url = customInput.trim();
    // Transform open.spotify.com URL to embed URL format if needed
    // e.g. https://open.spotify.com/track/123 -> https://open.spotify.com/embed/track/123?utm_source=generator&theme=0
    // e.g. https://open.spotify.com/playlist/abc -> https://open.spotify.com/embed/playlist/abc?utm_source=generator&theme=0
    if (url.includes('open.spotify.com') && !url.includes('/embed/')) {
      url = url.replace('open.spotify.com/', 'open.spotify.com/embed/');
      if (!url.includes('?')) {
        url += '?utm_source=generator&theme=0';
      }
    } else if (!url.startsWith('http')) {
      // If user pasted a Spotify URI: spotify:track:123
      if (url.startsWith('spotify:')) {
        const parts = url.split(':');
        if (parts.length >= 3) {
          url = `https://open.spotify.com/embed/${parts[1]}/${parts[2]}?utm_source=generator&theme=0`;
        }
      }
    }

    setActiveEmbedUrl(url);
    setSelectedPreset({
      id: 'custom',
      title: 'Custom Spotify Stream',
      creator: 'User Linked',
      description: customInput,
      embedUri: url,
      category: 'hits',
      coverGradient: 'from-emerald-700 via-slate-900 to-[#0d1217]'
    });
  };

  const handleSelectPreset = (preset: SpotifyPreset) => {
    setSelectedPreset(preset);
    setActiveEmbedUrl(preset.embedUri);
    // If offline synth was playing, stop it
    if (offlinePlaying) {
      toxifySynth.stop();
      setOfflinePlaying(false);
    }
  };

  const toggleOfflinePlay = (genre: string) => {
    if (offlinePlaying && offlineGenre === genre) {
      toxifySynth.stop();
      setOfflinePlaying(false);
    } else {
      toxifySynth.start(genre);
      setOfflineGenre(genre);
      setOfflinePlaying(true);
    }
  };

  const filteredPresets = SPOTIFY_PRESETS.filter(p => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'favs') return favorites[p.id];
    return p.category === categoryFilter;
  });

  return (
    <div className="flex flex-col h-full bg-[#090d12] text-slate-100 select-none overflow-hidden rounded-2xl border border-emerald-500/25 shadow-2xl">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#070a0f] gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1ed760] flex items-center justify-center text-black font-extrabold shadow-lg shadow-[#1ed760]/30">
            <Radio className="w-5 h-5 fill-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-cursive text-emerald-400 font-bold tracking-wide">
                toxify
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-[#1ed760]/20 text-[#1ed760] border border-[#1ed760]/30">
                Spotify Powered
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Stream real music from Spotify in the background while playing
            </div>
          </div>
        </div>

        {/* Tab Switcher: Spotify Real Streams vs Offline Synth */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('spotify')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'spotify'
                ? 'bg-[#1ed760] text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            Spotify Music
          </button>
          <button
            onClick={() => setActiveTab('offline')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'offline'
                ? 'bg-emerald-500 text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            Offline Synth
          </button>
        </div>
      </div>

      {activeTab === 'spotify' ? (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: Preset Catalog & Custom URL Form */}
          <div className="w-full md:w-80 bg-[#0a0f16] border-r border-slate-800/80 p-4 flex flex-col gap-4 overflow-y-auto shrink-0">
            {/* Custom Spotify URL Bar */}
            <form onSubmit={handleApplyCustomUrl} className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                <Link2 className="w-3 h-3 text-[#1ed760]" /> Load Any Spotify Link
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={customInput}
                  onChange={e => setCustomInput(e.target.value)}
                  placeholder="Paste track / album / playlist URL..."
                  className="flex-1 bg-[#121922] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1ed760]"
                />
                <button
                  type="submit"
                  className="bg-[#1ed760] hover:bg-[#1db954] text-black font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shrink-0"
                >
                  Play
                </button>
              </div>
            </form>

            {/* Category Filter Tabs */}
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Curated Playlists
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'favs', label: 'Favorites' },
                  { id: 'lofi', label: 'Lo-Fi' },
                  { id: 'gaming', label: 'Gaming' },
                  { id: 'synthwave', label: 'Retro' },
                  { id: 'phonk', label: 'Phonk' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-colors ${
                      categoryFilter === cat.id
                        ? 'bg-[#1ed760]/20 text-[#1ed760] font-semibold border border-[#1ed760]/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Presets List */}
            <div className="space-y-2 flex-1">
              {filteredPresets.map(preset => {
                const isSelected = selectedPreset.id === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'border-[#1ed760] bg-[#1ed760]/10 text-white font-semibold shadow-md'
                        : 'border-slate-800 bg-[#101722] text-slate-300 hover:border-slate-700 hover:bg-[#131c28]'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="text-xs font-semibold group-hover:text-[#1ed760] transition-colors truncate">
                        {preset.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {preset.creator} · {preset.description}
                      </div>
                    </div>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setFavorites(prev => ({ ...prev, [preset.id]: !prev[preset.id] }));
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1 shrink-0"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          favorites[preset.id] ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Background Play Note */}
            <div className="bg-[#111722] border border-slate-800 p-3 rounded-xl text-[11px] text-slate-400 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#1ed760] shrink-0 mt-0.5" />
              <div>
                Music continues playing in background when you switch to games or other windows.
              </div>
            </div>
          </div>

          {/* Right Column: Real Spotify Embedded Iframe Player */}
          <div className="flex-1 flex flex-col bg-[#070b0f] p-4 md:p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1ed760] animate-pulse"></span>
                <span className="font-semibold text-white truncate">{selectedPreset.title}</span>
                <span className="text-slate-500 hidden sm:inline">· Official Spotify Stream</span>
              </div>
              <a
                href={selectedPreset.embedUri.replace('/embed/', '/')}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-slate-400 hover:text-[#1ed760] flex items-center gap-1 transition-colors"
              >
                Open on Spotify <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Official Spotify Embed Player Frame */}
            <div className="flex-1 rounded-xl overflow-hidden border border-slate-800 bg-black relative shadow-2xl">
              <iframe
                title="Spotify Web Player"
                src={activeEmbedUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="eager"
                className="w-full h-full border-none rounded-xl"
              />
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: Offline Web Audio Synthesizer */
        <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto w-full">
          <div className="bg-[#101722] border border-slate-800 p-6 rounded-2xl mb-6">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Music className="w-5 h-5 text-emerald-400" /> Offline Procedural Audio Synthesizer
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Need audio without streaming external network services? This Web Audio API engine
              generates real-time chord progressions, vinyl crackle, 8-bit melodies, and ambient pads directly in your browser.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'lofi', title: 'Lo-Fi Chillhop Beats', desc: 'Warm electric piano 7th chords, relaxed kick drum, vinyl noise.' },
                { id: 'synthwave', title: '80s Synthwave Horizon', desc: 'Driving sawtooth bassline, arpeggiated lead, punchy snare.' },
                { id: 'chiptune', title: '8-Bit Arcade Chiptune', desc: 'Square wave melodies, fast pace retro game sounds.' },
                { id: 'ambient', title: 'Deep Ambient Calm', desc: 'Ethereal sine wave resonant drone pads for studying.' }
              ].map(synth => {
                const isThisPlaying = offlinePlaying && offlineGenre === synth.id;
                return (
                  <div
                    key={synth.id}
                    onClick={() => toggleOfflinePlay(synth.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isThisPlaying
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-slate-800 bg-[#0a0f16] text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm text-white mb-1">{synth.title}</div>
                      <div className="text-xs text-slate-400">{synth.desc}</div>
                    </div>
                    <button
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                        isThisPlaying ? 'bg-emerald-400 text-black scale-105' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <Play className={`w-4 h-4 ${isThisPlaying ? 'fill-black ml-0.5' : 'ml-0.5'}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
