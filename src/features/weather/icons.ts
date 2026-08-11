export const FALLBACK_WEATHER_ICON = 'icons/11n.png';

export function weatherIconPath(code?: string) {
  return code ? `icons/${code}.png` : FALLBACK_WEATHER_ICON;
}
