import React, { useState, useEffect } from 'react';
import { formatTimeInLocation, getEffectiveTimezone } from '../utils/locationTime';
import { MapPin } from 'lucide-react';

interface DesktopClockProps {
  showSeconds: boolean;
  timeFormat24: boolean;
  locationId: string;
  onOpenSettings?: () => void;
}

export const DesktopClock: React.FC<DesktopClockProps> = ({
  showSeconds,
  timeFormat24,
  locationId,
  onOpenSettings
}) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const tz = getEffectiveTimezone(locationId);
  const info = formatTimeInLocation(now, tz, timeFormat24);

  return (
    <div className="flex flex-col items-center justify-center select-none text-center drop-shadow-lg">
      {/* Digits row */}
      <div className="flex items-baseline gap-2 font-mono font-bold tracking-tight text-white/95 pointer-events-none">
        <span className="text-6xl md:text-8xl tabular-nums">
          {info.hours}:{info.minutes}
        </span>
        {showSeconds && (
          <span className="text-2xl md:text-4xl text-emerald-400/90 tabular-nums">
            :{info.seconds}
          </span>
        )}
        {!timeFormat24 && (
          <span className="text-xl md:text-2xl text-slate-400 font-sans font-medium">
            {info.ampm}
          </span>
        )}
      </div>

      {/* Date string */}
      <div className="text-base md:text-lg text-slate-300 font-medium tracking-wide mt-2 pointer-events-none">
        {info.dateStr}
      </div>

      {/* Location Badge */}
      <button
        onClick={onOpenSettings}
        className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 hover:bg-slate-800/80 border border-emerald-500/20 text-xs text-emerald-400 hover:text-emerald-300 transition-colors shadow-sm group pointer-events-auto cursor-pointer"
        title="Click to change location or time settings"
      >
        <MapPin className="w-3 h-3 text-emerald-400 group-hover:scale-110 transition-transform" />
        <span className="font-semibold">{info.locationName}</span>
        {info.tzAbbrev && (
          <>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400 font-mono text-[11px]">{info.tzAbbrev}</span>
          </>
        )}
      </button>
    </div>
  );
};
