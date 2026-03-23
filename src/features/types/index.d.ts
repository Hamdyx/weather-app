export interface Location {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeather {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
  temp_kf?: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

export interface Cloud {
  all: number;
}

export interface DailyForecastItem {
  dt: number;
  weather: WeatherCondition[];
  temp: { min: number; max: number };
}

export interface ForecastWeather {
  dt: number;
  main: MainWeather;
  weather: WeatherCondition[];
  clouds: Cloud;
  wind: Wind;
  visibility: number;
  pop: number;
  rain: {
    '3h': number;
  };
  sys: {
    pod: string;
  };
  dt_txt: string;
}
