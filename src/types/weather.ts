
export interface WeatherData {
  name: string;

  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };

  wind: {
    speed: number;
  };

  weather: {
    description: string;
  }[];
}