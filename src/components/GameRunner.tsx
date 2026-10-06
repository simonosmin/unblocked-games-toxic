import React, { useState, useEffect, useRef } from 'react';
import { GameItem } from '../data/games';
import { getGameHtml } from '../data/embeddedGames';
import { Maximize2, Minimize2, RotateCcw, Heart, Star, X, ExternalLink, Gamepad2 } from 'lucide-react';

interface GameRunnerProps {
  game: GameItem;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const GameRunner: React.FC<GameRunnerProps> = ({
  game,
  onClose,
  isFavorite,
  onToggleFavorite
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Synchronously compute HTML code in 0ms
  const gameHtml = getGameHtml(game);

  // Auto-focus the game iframe so controls work immediately
  useEffect(() => {
    const timer = setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.focus();
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [iframeKey]);

  const handleRestart = () => {
    setIframeKey(k => k + 1);
  };

  const handlePopout = () => {
    const win = window.open('', '_blank', 'width=900,height=700');
    if (win) {
      win.document.open();
      win.document.write(gameHtml);
      win.document.close();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 transition-all ${
        isFullscreen ? 'p-0' : 'bg-black/85 backdrop-blur-md'
      }`}
    >
      <div
        className={`bg-[#0d1218] border border-emerald-500/30 flex flex-col overflow-hidden shadow-2xl transition-all ${
          isFullscreen
            ? 'w-full h-full rounded-none border-0'
            : 'w-full max-w-5xl h-[88vh] rounded-2xl'
        }`}
      >
        {/* Top Control Bar */}
        <div className="h-14 bg-[#090d12] border-b border-slate-800 px-4 md:px-6 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-3 truncate">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h2 className="text-base font-bold text-white truncate flex items-center gap-2">
                {game.title}
                <span className="text-[11px] font-normal text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {game.category}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleFavorite(game.id)}
              className={`p-2 rounded-lg transition-colors ${
                isFavorite
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
              title="Favorite Game"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-400' : ''}`} />
            </button>
            <button
              onClick={handleRestart}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Restart Game"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handlePopout}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors hidden sm:block"
              title="Popout Window"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 transition-colors ml-1"
              title="Close Game"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Sandboxed Game Iframe - Instant 0ms Load */}
        <div className="flex-1 bg-black relative overflow-hidden flex items-center justify-center">
          <iframe
            ref={iframeRef}
            key={iframeKey}
            title={game.title}
            srcDoc={gameHtml}
            sandbox="allow-scripts allow-same-origin allow-pointer-lock"
            allow="autoplay; fullscreen"
            loading="eager"
            className="w-full h-full border-none"
          />
        </div>

        {/* Bottom Details HUD (only in non-fullscreen) */}
        {!isFullscreen && (
          <div className="bg-[#090d12] border-t border-slate-800 px-6 py-3 shrink-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-slate-400 select-none">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-semibold text-slate-200">{game.rating}</span> / 5.0
              </span>
              <span>·</span>
              <span>{game.plays.toLocaleString()} Plays</span>
              <span>·</span>
              <span className="text-slate-300 font-medium">Controls: {game.controls}</span>
            </div>
            <div className="text-slate-500 truncate">
              {game.instructions}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

