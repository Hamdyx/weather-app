export interface Temperature {
  day: number;
  night: number;
  eve: number;
  morn: number;
}

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

export interface BaseWeather {
  dt: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  clouds: number;
  weather: WeatherCondition[];
}

export interface DailyWeather extends Wind, BaseWeather {
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  temp: Temperature & { min: number; max: number };
  feels_like: Temperature;
  pop: number;
  uvi: number;
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
