import React, { useState, useMemo } from 'react';
import { GameItem, GAMES_CATALOG } from '../data/games';
import { Search, Gamepad2, Heart, Star, Sparkles, Flame, Trophy, Play, Filter } from 'lucide-react';

interface GamesCatalogProps {
  onPlayGame: (game: GameItem) => void;
  favorites: Record<string, boolean>;
  onToggleFavorite: (id: string) => void;
}

export const GamesCatalog: React.FC<GamesCatalogProps> = ({
  onPlayGame,
  favorites,
  onToggleFavorite
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rated' | 'name'>('popular');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 36;

  const categories = useMemo(() => {
    return [
      'All',
      'Favorites',
      'Retro & Arcade',
      'Puzzle & Logic',
      'Shooting & Defense',
      'Idle & Clicker',
      'Driving & Racing',
      'Platformer',
      'Sports',
      'Strategy',
      'Skill & Physics',
      'Classic Tabletop'
    ];
  }, []);

  const filteredGames = useMemo(() => {
    return GAMES_CATALOG.filter(game => {
      if (selectedCategory === 'Favorites') {
        if (!favorites[game.id]) return false;
      } else if (selectedCategory !== 'All' && game.category !== selectedCategory) {
        return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          game.title.toLowerCase().includes(q) ||
          game.category.toLowerCase().includes(q) ||
          game.description.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') return b.plays - a.plays;
      if (sortBy === 'rated') return b.rating - a.rating;
      return a.title.localeCompare(b.title);
    });
  }, [search, selectedCategory, sortBy, favorites]);

  const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE) || 1;
  const paginatedGames = filteredGames.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col h-full bg-[#0b0f15] text-slate-100 rounded-xl border border-emerald-500/20 shadow-2xl overflow-hidden select-none">
      {/* Header bar */}
      <div className="px-6 py-4 border-b border-slate-800 bg-[#080d12] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="text-xl font-cursive text-emerald-400 font-bold tracking-wide">toxic arcade</div>
          <div className="text-xs text-slate-400">
            {GAMES_CATALOG.length.toLocaleString()} Total Games Catalog
          </div>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search 1,129 games..."
              className="w-full bg-[#101722] border border-slate-800 rounded-lg py-1.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-[#101722] border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setSortBy('popular')}
              className={`px-2.5 py-1 rounded transition-colors ${
                sortBy === 'popular' ? 'bg-emerald-500 text-black font-semibold' : 'text-slate-400 hover:text-white'
              }`}
              title="Most Popular"
            >
              Popular
            </button>
            <button
              onClick={() => setSortBy('rated')}
              className={`px-2.5 py-1 rounded transition-colors ${
                sortBy === 'rated' ? 'bg-emerald-500 text-black font-semibold' : 'text-slate-400 hover:text-white'
              }`}
              title="Top Rated"
            >
              Rated
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`px-2.5 py-1 rounded transition-colors ${
                sortBy === 'name' ? 'bg-emerald-500 text-black font-semibold' : 'text-slate-400 hover:text-white'
              }`}
              title="Alphabetical"
            >
              A-Z
            </button>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="px-6 py-2.5 border-b border-slate-800/80 bg-[#090d13] flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 text-xs">
        {categories.map(cat => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                isSelected
                  ? 'bg-emerald-500 text-black font-semibold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat === 'Favorites' ? `★ Favorites (${Object.keys(favorites).length})` : cat}
            </button>
          );
        })}
      </div>

      {/* Games Grid Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredGames.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Gamepad2 className="w-12 h-12 mb-3 text-slate-600" />
            <p className="text-base font-medium">No games match your query</p>
            <p className="text-xs text-slate-600 mt-1">Try searching another title or category filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {paginatedGames.map(game => {
              const isFav = !!favorites[game.id];
              return (
                <div
                  key={game.id}
                  onClick={() => onPlayGame(game)}
                  className="group bg-[#101722] border border-slate-800/80 hover:border-emerald-500/60 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex flex-col relative"
                >
                  {/* Card Media Preview Area */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-[#121c29] to-[#0a1017] p-3 flex flex-col justify-between relative overflow-hidden">
                    {/* Glowing background gradient on hover */}
                    <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors"></div>

                    {/* Top row: Category tag & Favorite button */}
                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-[10px] font-medium text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/20 truncate max-w-[100px]">
                        {game.category}
                      </span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onToggleFavorite(game.id);
                        }}
                        className="p-1 rounded-md bg-slate-900/60 text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>

                    {/* Central Icon / Play affordance */}
                    <div className="flex items-center justify-center my-auto relative z-10">
                      <div className="w-10 h-10 rounded-full bg-slate-800/80 group-hover:bg-emerald-500 flex items-center justify-center text-slate-300 group-hover:text-black transition-all shadow-md group-hover:scale-110">
                        <Play className="w-4 h-4 ml-0.5 fill-current" />
                      </div>
                    </div>

                    {/* Bottom metadata inside image zone */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 relative z-10 tabular-nums">
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {game.rating}
                      </span>
                      <span>{(game.plays / 1000).toFixed(1)}k</span>
                    </div>
                  </div>

                  {/* Title & Description footer */}
                  <div className="p-3 bg-[#0d131c] flex-1 flex flex-col justify-between">
                    <h3 className="font-semibold text-xs text-white group-hover:text-emerald-400 transition-colors truncate">
                      {game.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate mt-1">
                      {game.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-slate-800 bg-[#080d12] flex items-center justify-between shrink-0 text-xs">
          <div className="text-slate-400">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filteredGames.length)} of {filteredGames.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
            >
              Previous
            </button>
            <span className="px-2 font-medium text-emerald-400 tabular-nums">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
