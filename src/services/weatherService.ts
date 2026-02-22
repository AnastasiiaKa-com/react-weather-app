import type { WeatherData } from '../types/weather'

const API_KEY = '9c52fb7aec5e3b212f7eccff63792fdf'
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

export const fetchWeather = async (city: string): Promise<WeatherData> => {

  const url = `${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`
  console.log('Fetching:', url)

  const res = await fetch(url)

  const data = await res.json()

  console.log('Response status:', res.status)
  console.log('Response data:', data)

  if (!res.ok) {
    throw new Error(data.message || 'City not found')
  }

  return data as WeatherData
}