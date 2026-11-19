import { useState, useEffect, useRef } from "react";
import "./App.css";

// Open-Meteo weather codes -> label + icon
const WEATHER_CODES = {
  0: { label: "Clear sky", icon: "☀️" },
  1: { label: "Mainly clear", icon: "🌤️" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Fog", icon: "🌫️" },
  48: { label: "Freezing fog", icon: "🌫️" },
  51: { label: "Light drizzle", icon: "🌦️" },
  53: { label: "Drizzle", icon: "🌦️" },
  55: { label: "Heavy drizzle", icon: "🌦️" },
  56: { label: "Freezing drizzle", icon: "🌧️" },
  57: { label: "Heavy freezing drizzle", icon: "🌧️" },
  61: { label: "Light rain", icon: "🌧️" },
  63: { label: "Rain", icon: "🌧️" },
  65: { label: "Heavy rain", icon: "🌧️" },
  66: { label: "Freezing rain", icon: "🌧️" },
  67: { label: "Heavy freezing rain", icon: "🌧️" },
  71: { label: "Light snow", icon: "❄️" },
  73: { label: "Snow", icon: "❄️" },
  75: { label: "Heavy snow", icon: "❄️" },
  77: { label: "Snow grains", icon: "❄️" },
  80: { label: "Light showers", icon: "🌦️" },
  81: { label: "Showers", icon: "🌦️" },
  82: { label: "Violent showers", icon: "🌧️" },
  85: { label: "Snow showers", icon: "🌨️" },
  86: { label: "Heavy snow showers", icon: "🌨️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
  96: { label: "Thunderstorm with hail", icon: "⛈️" },
  99: { label: "Severe thunderstorm", icon: "⛈️" },
};

function describe(code) {
  return WEATHER_CODES[code] ?? { label: "Unknown", icon: "❓" };
}

// Picks which sky to paint behind the page
function skyFor(code, isDay) {
  if (code === 0 || code === 1) return isDay ? "clear-day" : "clear-night";
  if (code === 2 || code === 3) return isDay ? "cloud-day" : "cloud-night";
  if (code === 45 || code === 48) return "fog";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if (code >= 95) return "storm";
  return "cloud-day";
}

const toF = (c) => (c * 9) / 5 + 32;
const toMph = (kmh) => kmh * 0.621371;

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState(() => localStorage.getItem("unit") ?? "C");
  const controllerRef = useRef(null);

  // Convert only when displaying, never in the stored data
  const temp = (c) => Math.round(unit === "C" ? c : toF(c));
  const wind = (kmh) =>
    unit === "C" ? `${Math.round(kmh)} km/h` : `${Math.round(toMph(kmh))} mph`;

  async function search(name) {
    // Cancel any request still in flight so an old response can't overwrite a new one
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const { signal } = controller;

    setLoading(true);
    setError(null);

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1`,
        { signal }
      );
      const geo = await geoRes.json();
      if (!geo.results?.length) {
        throw new Error("We couldn't find that city. Check the spelling and try again.");
      }
      const { latitude, longitude, name: cityName, country, country_code } = geo.results[0];

      const wxRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
          `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,is_day` +
          `&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`,
        { signal }
      );
      if (!wxRes.ok) {
        throw new Error("Weather data isn't available right now. Try again in a moment.");
      }
      const wx = await wxRes.json();

      setWeather({
        name: cityName,
        country: country_code ?? country,
        current: wx.current,
        daily: wx.daily,
      });
      localStorage.setItem("lastCity", name);
    } catch (err) {
      if (err.name === "AbortError") return; // a newer search replaced this one
      setWeather(null);
      setError(
        err instanceof TypeError
          ? "Can't reach the weather service. Check your connection and try again."
          : err.message
      );
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }

  // Load the last searched city on first render
  useEffect(() => {
    const saved = localStorage.getItem("lastCity");
    if (saved) {
      setCity(saved);
      search(saved);
    }
    return () => controllerRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (city.trim()) search(city.trim());
  }

  function changeUnit(next) {
    setUnit(next);
    localStorage.setItem("unit", next);
  }

  const current = weather?.current;
  const daily = weather?.daily;
  const sky = current ? skyFor(current.weather_code, current.is_day === 1) : "idle";

  // Shared scale for the week, so every range bar lines up
  const weekMin = daily ? Math.min(...daily.temperature_2m_min) : 0;
  const weekMax = daily ? Math.max(...daily.temperature_2m_max) : 0;
  const span = weekMax - weekMin || 1;

  return (
    <main className="app" data-sky={sky}>
      <div className="shell">
        <h1 className="sr-only">Weather</h1>

        <header className="top">
          <form className="search" role="search" onSubmit={handleSubmit}>
            <label htmlFor="city" className="sr-only">
              City
            </label>
            <input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search for a city"
              autoComplete="off"
            />
            <button type="submit">Search</button>
          </form>

          <div className="units" role="group" aria-label="Temperature unit">
            <button type="button" aria-pressed={unit === "C"} onClick={() => changeUnit("C")}>
              °C
            </button>
            <button type="button" aria-pressed={unit === "F"} onClick={() => changeUnit("F")}>
              °F
            </button>
          </div>
        </header>

        <div className="status" aria-live="polite">
          {loading && <p>Loading weather…</p>}
          {error && <p className="error">{error}</p>}
        </div>

        {!weather && !loading && !error && (
          <p className="empty">Search for a city to see today’s weather and the week ahead.</p>
        )}

        {weather && (
          <div className="board" key={`${weather.name}-${weather.country}`}>
            <section className="hero">
              <h2 className="place">
                {weather.name}, {weather.country}
              </h2>
              <p className="now">
                {temp(current.temperature_2m)}
                <sup>°{unit}</sup>
              </p>
              <p className="condition">{describe(current.weather_code).label}</p>

              <dl className="facts">
                <div>
                  <dt>Feels like</dt>
                  <dd>{temp(current.apparent_temperature)}°</dd>
                </div>
                <div>
                  <dt>Wind</dt>
                  <dd>{wind(current.wind_speed_10m)}</dd>
                </div>
                <div>
                  <dt>Today</dt>
                  <dd>
                    {temp(daily.temperature_2m_min[0])}° to {temp(daily.temperature_2m_max[0])}°
                  </dd>
                </div>
              </dl>
            </section>

            <section className="week" aria-label="Forecast">
              <ul>
                {daily.time.map((day, i) => {
                  const info = describe(daily.weather_code[i]);
                  const lo = daily.temperature_2m_min[i];
                  const hi = daily.temperature_2m_max[i];
                  const left = ((lo - weekMin) / span) * 100;
                  const width = ((hi - lo) / span) * 100;

                  return (
                    <li key={day}>
                      <span className="day">
                        {i === 0
                          ? "Today"
                          : new Date(day + "T00:00").toLocaleDateString("en", { weekday: "short" })}
                      </span>
                      <span className="icon" role="img" aria-label={info.label}>
                        {info.icon}
                      </span>
                      <span className="lo">{temp(lo)}°</span>
                      <span className="range" aria-hidden="true">
                        <span className="fill" style={{ left: `${left}%`, width: `${width}%` }} />
                      </span>
                      <span className="hi">{temp(hi)}°</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}