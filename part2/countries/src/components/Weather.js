import React, { useState, useEffect } from "react"
import axios from "axios"
const Weather = ({ capital }) => {
  const [weather, setWeather] = useState({})
  const [loading, setLoading] = useState(false)
  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${API_KEY}`
      )
      .then((res) => {
        setWeather(res.data)
        setLoading(true)
      })
      .catch((err) => console.log(err))
  }, [capital])

  return !loading ? null : (
    <div>
      <h2>Weather in {weather.name}</h2>
      <p>
        <b>temperature:</b> {weather.main.temp} degree celsius
      </p>
      <img
        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather.description}
      />
      <p>
        <b>wind:</b> {weather.wind.speed} mph
      </p>
    </div>
  )
}

export default Weather
