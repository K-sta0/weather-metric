# Weather Metric Dashboard

A responsive, interactive weather application built with React and TypeScript. This project focuses on delivering real-time weather data through a clean, minimalist UI, demonstrating modern frontend practices, state management, and third-party API integration.

## Overview

Developed as a technical portfolio piece, this application is designed to demonstrate practical skills in frontend architecture, state management, and external API integration.

While functioning as a comprehensive weather dashboard with real-time metrics, a 5-day forecast, and an interactive map, its primary goal is to showcase clean and scalable client-side rendering (CSR) practices.

## Technical Stack

**Core Architecture**
* UI Library: React 19
* Language: TypeScript (Strict Mode enabled)
* Build Tool: Vite (for optimized Hot Module Replacement and fast production builds)

**UI & Styling**
* CSS Framework: Tailwind CSS
* Component Library: DaisyUI
* Animations: Framer Motion (for smooth layout transitions and component mounting)

**Data Visualization & Mapping**
* Mapping: Leaflet.js with React-Leaflet wrapper
* Charts: Recharts (for rendering responsive forecast graphs)

**Network & Data Fetching**
* Data Fetching: Native Fetch API with asynchronous state handling
* Weather Provider: OpenWeatherMap API
* Geolocation Provider: Geoapify API (for coordinate-based city lookups)

## Engineering Features & System Design

### 1. Advanced State Management
* **Debounced Input Processing:** Search queries are routed through a custom `useDebounce` hook. This ensures the external APIs are only called after the user finishes typing, effectively preventing rate-limiting, minimizing API credit consumption, and reducing redundant network traffic.
* **Custom Hook Architecture:** The application heavily relies on the Component-State-Effect lifecycle. All API interactions, loading states, and error handling are encapsulated within a dedicated `useWeather` hook. This keeps UI components clean and easy to maintain.
* **Strict Payload Typing:** The JSON payloads from OpenWeatherMap and Geoapify are fully typed using TypeScript interfaces (`src/types.ts`). This guarantees runtime safety, prevents undefined reference errors, and improves developer experience (DX).

### 2. Performance & UX Optimization
* **Cumulative Layout Shift (CLS) Mitigation:** Implemented custom Skeleton loader components (`WeatherSkeleton.tsx`) that mirror the exact dimensions of the actual components. This ensures layout stability while asynchronous data is being fetched over the network.
* **Rendering Optimization:** Strategically managing component state to ensure that heavy UI elements (like Recharts and Leaflet maps) do not re-render unnecessarily when unrelated state (like the Celsius/Fahrenheit toggle) changes.

### 3. Dynamic Data Computations
* **Timezone Calculation:** The application calculates the exact local time of the searched city globally in a 24-hour format. It achieves this by taking the user's local system time, converting it to UTC, and applying the specific timezone offset provided by the API payload dynamically.
* **Client-Side Unit Conversion:** Users can seamlessly switch between metric and imperial unit systems. The conversion logic (Celsius to Fahrenheit) is handled purely on the client side, updating the UI and Recharts data points instantly without triggering additional API calls.

### 4. Interactive UI & Mapping
* **Map Integration:** The `WeatherMap.tsx` component leverages Leaflet to visually locate the searched city, allowing users to explore the surrounding area interactively.
* **Clean & Minimalist Design System:** Implemented a modern, card-based UI with clear visual hierarchy. The `WeatherBackground.tsx` component responds to current weather conditions (e.g., rain, clouds, clear sky), adjusting the application's global theme while maintaining WCAG contrast standards.

## Project Architecture

The repository is organized following feature-based separation of concerns:

```text
src/
├── assets/                     # Static media and SVG icons
├── components/                 # Reusable UI blocks
│   ├── DaySummary.tsx          # Daily forecast breakdown
│   ├── ForecastGrid.tsx        # 5-day predictive data rendering
│   ├── SearchForm.tsx          # User input and city suggestions
│   ├── WeatherBackground.tsx   # Dynamic condition-based background
│   ├── WeatherCard.tsx         # Primary metric display & time computation
│   ├── WeatherChart.tsx        # Recharts data visualization
│   ├── WeatherMap.tsx          # Leaflet map container
│   └── WeatherSkeleton.tsx     # Loading state placeholders
├── hooks/                      # Encapsulated business logic
│   ├── useDebounce.ts          # API request optimization
│   └── useWeather.ts           # Main API controller and state
├── App.tsx                     # Root layout and global state gate
├── index.css                   # Global styles and Tailwind directives
├── main.tsx                    # React DOM entry point
└── types.ts                    # TypeScript interfaces and data types
```

## Local Development Setup

To run this project locally, you will need Node.js (v20+) and active API keys for both OpenWeatherMap and Geoapify.

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