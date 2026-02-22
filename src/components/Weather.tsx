
/* eslint-disable @typescript-eslint/no-explicit-any */
import defaultBg from "../assets/360_F_802177332_jccDahi1GNWavQ64LSEBfs7qR0hlRo9m.jpg";
import { useState } from "react";
import type { WeatherData } from "../types/weather";
import WeatherCard from "./WeatherCard";
import styles from "./Weather.module.css";

const API_KEY = import.meta.env.VITE_API_KEY;
const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;

interface ForecastItem {
  dt_txt: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    main: string;
  }[];
}

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [cityImage, setCityImage] = useState<string | null>(null);
  const [error, setError] = useState("");

  const getDailyForecast = (data: any): ForecastItem[] => {
    const daily = data.list.filter((item: any) =>
      item.dt_txt.includes("12:00:00")
    );
    return daily.slice(0, 5);
  };

  const fetchCityImage = async (cityName: string) => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${cityName}&client_id=${UNSPLASH_KEY}`
      );
      const data = await response.json();

      if (data.results.length > 0) {
        setCityImage(data.results[0].urls.regular);
      } else {
        setCityImage(null);
      }
    } catch {
      setCityImage(null);
    }
  };

  const searchWeather = async () => {
    if (!city.trim()) return;

    try {
      setError("");

      const weatherResponse = await fetch(
       ` https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );

      if (!weatherResponse.ok) {
        throw new Error("City not found");
      }

      const weatherData: WeatherData = await weatherResponse.json();
      setWeather(weatherData);

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );

      const forecastData = await forecastResponse.json();
      setForecast(getDailyForecast(forecastData));

      await fetchCityImage(city);

    } catch {
      setError("City not found");
      setWeather(null);
      setForecast([]);
      setCityImage(null);
    }
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: cityImage
          ?` url(${cityImage})`
          :` url(${defaultBg})`
      }}
    >
      <div className={styles.overlay}>
        <h1 className={styles.title}>Weather App 🌞</h1>

        <div className={styles.search}>
          <input
            type="text"
            placeholder="Enter city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={styles.input}
          />
          <button onClick={searchWeather} className={styles.button}>
            Search
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {weather && (
          <WeatherCard weather={weather} />
        )}

        {forecast.length > 0 && (
          <div className={styles.forecastContainer}>
            {forecast.map((day, index) => (
              <div key={index} className={styles.forecastCard}>
                <p>
                  {new Date(day.dt_txt).toLocaleDateString("en-US", {
                    weekday: "short"
                  })}
                </p>
                <p>🌡 {Math.round(day.main.temp)}°C</p>
                <p>💧 {day.main.humidity}%</p>
                <p>{day.weather[0].main}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Weather;