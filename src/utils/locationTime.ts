/**
 * Location-based Time & Geolocation Utilities for Toxic Desktop
 */

export interface LocationPreset {
  id: string;
  name: string;
  timezone: string;
  flag: string;
}

export const WORLD_LOCATIONS: LocationPreset[] = [
  { id: 'auto', name: 'Auto-Detect Local Location', timezone: '', flag: '📍' },
  { id: 'los-angeles', name: 'Los Angeles (Pacific)', timezone: 'America/Los_Angeles', flag: '🇺🇸' },
  { id: 'denver', name: 'Denver (Mountain)', timezone: 'America/Denver', flag: '🇺🇸' },
  { id: 'chicago', name: 'Chicago (Central)', timezone: 'America/Chicago', flag: '🇺🇸' },
  { id: 'new-york', name: 'New York (Eastern)', timezone: 'America/New_York', flag: '🇺🇸' },
  { id: 'london', name: 'London (GMT / BST)', timezone: 'Europe/London', flag: '🇬🇧' },
  { id: 'paris', name: 'Paris / Berlin (CET)', timezone: 'Europe/Paris', flag: '🇪🇺' },
  { id: 'dubai', name: 'Dubai (GST)', timezone: 'Asia/Dubai', flag: '🇦🇪' },
  { id: 'tokyo', name: 'Tokyo (JST)', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
  { id: 'sydney', name: 'Sydney (AEST)', timezone: 'Australia/Sydney', flag: '🇦🇺' },
  { id: 'honolulu', name: 'Honolulu (HST)', timezone: 'Pacific/Honolulu', flag: '🌺' }
];

export function getEffectiveTimezone(selectedId: string): string {
  if (selectedId && selectedId !== 'auto') {
    const found = WORLD_LOCATIONS.find(l => l.id === selectedId);
    if (found && found.timezone) return found.timezone;
  }
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Los_Angeles';
  } catch {
    return 'America/Los_Angeles';
  }
}

export function getLocationDisplayName(timezone: string): string {
  const parts = timezone.split('/');
  const city = parts[parts.length - 1].replace(/_/g, ' ');
  return city;
}

export interface FormattedLocationTime {
  hours: string;
  minutes: string;
  seconds: string;
  ampm: string;
  dateStr: string;
  locationName: string;
  tzAbbrev: string;
}

export function formatTimeInLocation(
  date: Date,
  timezone: string,
  timeFormat24: boolean
): FormattedLocationTime {
  const effectiveTz = timezone || getEffectiveTimezone('auto');

  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: effectiveTz,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: !timeFormat24,
      timeZoneName: 'short'
    });

    const parts = formatter.formatToParts(date);
    let hours = '00';
    let minutes = '00';
    let seconds = '00';
    let ampm = '';
    let tzAbbrev = '';

    parts.forEach(p => {
      if (p.type === 'hour') hours = p.value;
      if (p.type === 'minute') minutes = p.value;
      if (p.type === 'second') seconds = p.value;
      if (p.type === 'dayPeriod') ampm = p.value.toUpperCase();
      if (p.type === 'timeZoneName') tzAbbrev = p.value;
    });

    if (timeFormat24 && hours.length === 1) {
      hours = '0' + hours;
    }

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: effectiveTz,
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });

    const dateStr = dateFormatter.format(date);
    const locationName = getLocationDisplayName(effectiveTz);

    return {
      hours,
      minutes,
      seconds,
      ampm,
      dateStr,
      locationName,
      tzAbbrev
    };
  } catch {
    // Fallback if timezone not supported
    const h = date.getHours();
    const hours = timeFormat24 ? (h < 10 ? `0${h}` : `${h}`) : `${h % 12 || 12}`;
    const m = date.getMinutes();
    const minutes = m < 10 ? `0${m}` : `${m}`;
    const s = date.getSeconds();
    const seconds = s < 10 ? `0${s}` : `${s}`;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const dateStr = date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    return {
      hours,
      minutes,
      seconds,
      ampm,
      dateStr,
      locationName: 'Local Time',
      tzAbbrev: ''
    };
  }
}
