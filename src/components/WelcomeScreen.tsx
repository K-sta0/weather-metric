import { motion } from "framer-motion";

interface WelcomeScreenProps {
  onCitySelect: (city: string) => void;
}

export default function WelcomeScreen({ onCitySelect }: WelcomeScreenProps) {
  const suggestedCities = ["Dresden", "New York", "Paris", "Tokyo"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.5 }}
      className="card w-full max-w-md bg-base-100 shadow-xl backdrop-blur-md bg-opacity-80 mt-4"
    >
      <div className="card-body items-center text-center py-10">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="text-6xl mb-4"
        >
          🌍
        </motion.div>

        <h2 className="card-title text-2xl font-bold">
          Welcome to Weathermetric
        </h2>

        <p className="text-gray-500 mt-2 mb-6">
          Enter a city name above or click the location pin 📍 to get the
          current weather.
        </p>

        <div className="w-full border-t border-base-300/50 pt-6">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 block">
            Or try these locations
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestedCities.map((city) => (
              <motion.button
                key={city}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCitySelect(city)}
                className="px-4 py-1.5 rounded-full bg-base-200 border border-base-300 hover:bg-base-300 hover:border-primary/30 hover:text-primary transition-colors text-sm font-medium text-base-content/80 shadow-sm"
              >
                {city}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
