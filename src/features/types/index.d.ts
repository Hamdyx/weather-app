export interface Temperature {
  day: number;
  night: number;
  eve: number;
  morn: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Wind {
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
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

export interface HourlyWeather extends Wind, BaseWeather {
  temp: number;
  feels_like: number;
  visibility: number;
  pop: number;
  uvi: number;
}

export interface CurrentWeather extends Omit<Wind, 'wind_gust'>, BaseWeather {
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  visibility: number;
  uvi: number;
}
