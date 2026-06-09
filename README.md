# Weather Metric Dashboard

A responsive, interactive weather application built with React and TypeScript. This project focuses on delivering real-time weather data through a clean, minimalist UI, showcasing practical solutions to common frontend challenges, state management, and third-party API integration.

## Overview

Developed as a technical portfolio piece, this application is designed to demonstrate practical skills in frontend architecture, state management, and external API integration.

While functioning as a comprehensive weather dashboard with real-time metrics, air quality data, a 5-day forecast, and an interactive map, its primary goal is to showcase clean and scalable client-side rendering (CSR) practices.

## Technical Stack

**Core Architecture**
* **UI Library:** React 19
* **Language:** TypeScript (Strict Mode)
* **Build Tool:** Vite (optimized Hot Module Replacement and fast production builds)

**UI & Styling**
* **CSS Framework:** Tailwind CSS
* **Component Library:** DaisyUI
* **Animations:** Framer Motion (complex physics, interactive hover states, and smooth transitions) & Native CSS Keyframes (high-performance particle systems like rain/snow and sun shimmer)
* **Dynamic Procedural Generation:** Custom React algorithms for generating randomized, non-repeating city skylines (`CitySkyline.tsx`) using strict Flexbox logic to prevent layout gaps.

**Data Visualization & Mapping**
* **Mapping:** Leaflet.js with React-Leaflet wrapper
* **Weather Radar:** RainViewer API (real-time precipitation overlays)
* **Air Quality Data:** WAQI (World Air Quality Index) API (high-accuracy ground-sensor data)
* **Charts:** Recharts (responsive forecast data visualization)

**Network & Data Fetching**
* **Data Fetching:** Native Fetch API with asynchronous state handling
* **Weather Provider:** OpenWeatherMap API
* **Geolocation Provider:** Geoapify API (coordinate-based city lookups)

## Engineering Features

### 1. State Management
* **Debounced Input Processing:** Search queries are routed through a custom `useDebounce` hook. This prevents redundant API calls during user input, optimizing API credit consumption and reducing network overhead.
* **Custom Hook Architecture:** The application heavily relies on the Component-State-Effect lifecycle. All API interactions, loading states, and error handling are encapsulated within a dedicated `useWeather` hook. This keeps UI components clean and easy to maintain.
* **Persistence:** Leveraged `localStorage` for UI preference synchronization (e.g., map layer settings), ensuring state consistency across sessions.
* **Strict Payload Typing:** The JSON payloads from OpenWeatherMap and Geoapify are fully typed using TypeScript interfaces (`src/types.ts`). This guarantees runtime safety, prevents undefined reference errors, and improves developer experience (DX).

### 2. Performance & UX Optimization
* **Hybrid Animation Strategy:** Optimized rendering by utilizing Framer Motion for UI-heavy transitions and native CSS keyframes for particle generation. This ensures a stable frame rate without overloading the React render cycle.
* **Layout Stability:** Implemented `WeatherSkeleton` components that reflect the dimensions of loaded content to mitigate Cumulative Layout Shift (CLS) during asynchronous data fetching.
* **Rendering Optimization:** Strategically managing component state to ensure that heavy UI elements (like Recharts and Leaflet maps) do not re-render unnecessarily when unrelated state (like the Celsius/Fahrenheit toggle) changes.
* **Defensive Programming:** Integrated robust error fallbacks for API inconsistencies. Missing sensor data or API failures are handled gracefully at the UI level to prevent application crashes.

### 3. Data & Computations
* **Timezone Logic:** Local time is computed by converting system time to UTC and applying the API-provided offset dynamically.
* **Client-Side Unit Conversions:** Unit switching (Celsius/Fahrenheit) is performed on the client side, ensuring instant UI responsiveness without additional network requests.

### 4. Interactive UI & Mapping
* **Map Integration:** The `WeatherMap.tsx` component leverages Leaflet to visually locate the searched city, allowing users to explore the surrounding area interactively.
* **Layer Control:** Leveraged Leaflet’s `LayersControl` for modular toggling of street maps, radar overlays, and air quality heatmaps.
* **Adaptive Geo-Resolution:** Implemented intelligent fallback logic. In locations lacking registered city names (e.g., open ocean or remote territories), the UI dynamically resolves to precise latitude/longitude coordinates to maintain data transparency.

### 5. Procedural UI & Theming
* **Procedural City Skyline:** Built a custom React component (`CitySkyline.tsx`) that procedurally generates a two-tier architectural background. It dynamically calculates building widths, heights, and window grids based on screen size, utilizing advanced Flexbox techniques (`flex-nowrap`, `shrink-0`, randomized margins) to ensure a seamless, gap-free horizon on every render.
* **Contextual Time-of-Day Theming:** The environment completely adapts not just to weather, but to the exact time of day.
    * **Day Mode:** Features directional lighting, soft sun flares, atmospheric haze, and dynamic window reflections (shimmer effect).
    * **Night Mode:** Transitions to deep neon gradients, pulsating city lights, and randomized window illumination.
* **Unified Animation Physics:** Standardized interactive hover states across all components using Framer Motion's unified easing transitions, ensuring a cohesive and premium tactile feel.

## Project Architecture

The repository is organized following feature-based separation of concerns:

```text
src/
├── assets/                     # Static media and SVG icons
├── components/                 # Reusable UI blocks
│   ├── AirQuality.tsx          # Real-time AQI metrics and custom tooltips
│   ├── CitySkyline.tsx         # Procedural city generation and dynamic window lighting
│   ├── DaySummary.tsx          # Daily forecast breakdown
│   ├── ForecastGrid.tsx        # 5-day predictive data rendering
│   ├── SearchForm.tsx          # User input and city suggestions
│   ├── WeatherBackground.tsx   # Dynamic condition-based gradients and particle effects
│   ├── WeatherCard.tsx         # Primary metric display & time computation
│   ├── WeatherChart.tsx        # Recharts data visualization
│   ├── WeatherMap.tsx          # Leaflet map container with layer controls
│   ├── WeatherSkeleton.tsx     # Loading state placeholders
│   └── WelcomeScreen.tsx       # Initial landing state and quick-select cities
├── hooks/                      # Encapsulated business logic
│   ├── useDebounce.ts          # API request optimization
│   └── useWeather.ts           # Main API controller and state
├── App.tsx                     # Root layout and global state gate
├── index.css                   # Global styles and Tailwind directives
├── main.tsx                    # React DOM entry point
└── types.ts                    # TypeScript interfaces and data types
```
## Local Development Setup

To run this project locally, you will need Node.js (v20+) and active API keys for OpenWeatherMap, Geoapify, and WAQI.

1. Clone the repository:
```bash
git clone https://github.com/K-sta0/weather-metric.git
```

2. Navigate to the directory and install dependencies:
```bash
cd weather-metric
npm install
```

3. Configure Environment Variables by creating a `.env` file in the project root:
```env
VITE_WEATHER_API_KEY=your_openweathermap_api_key_here
VITE_GEOAPIFY_KEY=your_geoapify_api_key_here
VITE_WAQI_API_KEY=your_waqi_api_key_here
```
*(Note: Replace the placeholder values with your actual API keys. The `.env` file is included in `.gitignore` to prevent secret leakage).*

4. Start the Vite development server:
```bash
npm run dev
```

## Future Learning & Architectural Expansion

While built as a technical showcase, the application is structured with real-world scalability in mind. As part of my ongoing professional development, logical next steps to expand this architecture include:

* **Backend-For-Frontend (BFF):** Migrating external API calls to a dedicated **Java (Spring Boot)** REST service. This will fully secure API keys away from the client browser and allow for centralized rate-limiting.
* **Database Integration:** Implementing a relational database (**PostgreSQL**) to manage user sessions and persist customized dashboards (e.g., saved favorite cities).
* **Containerization & Deployment:** Packaging the React frontend and Spring Boot backend into **Docker** containers. The infrastructure would be managed via Docker Compose and served through an **Nginx** reverse proxy to ensure reliable routing and static file delivery.
* **Testing & CI/CD:** Implementing comprehensive component testing using Jest and React Testing Library, alongside automated build pipelines via GitHub Actions.