<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# 🌤️ Weather App

A clean, responsive weather app that shows current conditions and a 5-day forecast for any city in the world.

![Weather App Screenshot](./screenshots/preview.png)

**Live demo:** [your-demo-link-here](https://your-demo-link-here)

---

## Features

- 🔍 Search weather by city name
- 📍 Use your current location (geolocation)
- 🌡️ Current temperature, "feels like", humidity, wind speed, and pressure
- 📅 5-day forecast
- 🔄 Toggle between °C and °F
- 🌙 Light and dark mode
- 📱 Fully responsive on mobile, tablet, and desktop
- ⚠️ Friendly error handling for invalid cities and network issues

## Tech Stack

- **Framework:** React / Next.js
- **Styling:** CSS / Tailwind CSS
- **API:** [OpenWeatherMap](https://openweathermap.org/api)
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn
- A free API key from [OpenWeatherMap](https://home.openweathermap.org/users/sign_up)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/your-username/weather-app.git
   cd weather-app
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root and add your API key

   ```env
   NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
   ```

4. Start the development server

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command           | Description                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start the development server      |
| `npm run build`   | Create a production build         |
| `npm start`       | Run the production build          |
| `npm run lint`    | Lint the codebase                 |

## Project Structure

```
weather-app/
├── public/            # Static assets
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # App pages / routes
│   ├── hooks/         # Custom hooks (e.g. useWeather)
│   ├── utils/         # Helpers (unit conversion, formatting)
│   └── styles/        # Global styles
├── .env.local         # Environment variables (not committed)
└── README.md
```

## How It Works

1. The user searches for a city or allows location access.
2. The app calls the OpenWeatherMap API with the city name or coordinates.
3. The response is parsed and displayed as current conditions and a daily forecast.

## Roadmap

- [ ] Hourly forecast
- [ ] Save favorite cities
- [ ] Weather alerts
- [ ] Animated weather icons

## Contributing

Contributions are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m "Add amazing feature"`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for the weather data
- [Lucide](https://lucide.dev/) / [Weather Icons](https://erikflowers.github.io/weather-icons/) for icons

## Contact

Your Name – [@your-handle](https://twitter.com/your-handle) – you@example.com

Project Link: [https://github.com/your-username/weather-app](https://github.com/your-username/weather-app)
>>>>>>> 3718036c44aa3b1c6bcb5009d6695ab55663b458
