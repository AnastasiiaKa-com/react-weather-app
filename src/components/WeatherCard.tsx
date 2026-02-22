import type { WeatherData } from "../types/weather";
import styles from "./Weather.module.css";

interface Props {
  weather: WeatherData;
}

function WeatherCard({ weather }: Props) {
  return (
    <div className={styles.card}>
      <h2>{weather.name}</h2>
      <p>🌡 Temperature: {weather.main.temp} °C</p>
      <p>🤔 Feels like: {weather.main.feels_like} °C</p>
      <p>💧 Humidity: {weather.main.humidity}%</p>
      <p>💨 Wind: {weather.wind.speed} m/s</p>
      <p>☁ {weather.weather[0].description}</p>
    </div>
  );
}

export default WeatherCard;