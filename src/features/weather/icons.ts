export const FALLBACK_WEATHER_ICON = '/icons/clear-cloudy.svg';

export function weatherIconPath(code?: string) {
  return code ? `/icons/${code}.png` : FALLBACK_WEATHER_ICON;
}
