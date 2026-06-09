import { memo, useMemo } from "react";
import { motion } from "framer-motion";

export interface CitySkylineProps {
  isVisible: boolean;
  isNight: boolean;
}

interface WindowData {
  id: string;
  isLit: boolean;
  duration: number;
  delay: number;
}

interface BuildingData {
  id: string;
  heightClass: string;
  marginLeftClass: string;
  cols: number;
  rows: number;
  windows: WindowData[];
}

const generateBuildings = (
  count: number,
  prefix: string,
  litProbability: number,
): BuildingData[] => {
  const heights = ["h-32", "h-40", "h-48", "h-56", "h-64", "h-72", "h-80"];
  const widths = [4, 5, 6, 7];
  const margins = ["-ml-8", "-ml-6", "-ml-4", "-ml-2", "ml-0"];

  return Array.from({ length: count }).map((_, i) => {
    const cols = widths[Math.floor(Math.random() * widths.length)];
    const heightIndex = Math.floor(Math.random() * heights.length);
    const rows = (heightIndex + 4) * 2;
    const marginLeftClass = margins[Math.floor(Math.random() * margins.length)];

    const windows: WindowData[] = Array.from({ length: cols * rows }).map(
      (_, wIdx) => ({
        id: `${prefix}-b${i}-w${wIdx}`,
        isLit: Math.random() < litProbability,
        duration: Math.random() * 3 + 2,
        delay: -(Math.random() * 5),
      }),
    );

    return {
      id: `${prefix}-${i}`,
      heightClass: heights[heightIndex],
      marginLeftClass,
      cols,
      rows,
      windows,
    };
  });
};

const CitySkyline = memo(({ isVisible, isNight }: CitySkylineProps) => {
  const backBuildings = useMemo(() => generateBuildings(40, "back", 0.15), []);
  const frontBuildings = useMemo(
    () => generateBuildings(35, "front", 0.25),
    [],
  );

  if (!isVisible) return null;

  const backBg = isNight
    ? "bg-purple-950 border-purple-800 z-0"
    : "bg-slate-400 border-slate-400 z-0";

  const frontBg = isNight
    ? "bg-indigo-950 border-indigo-800 z-10 shadow-[-5px_0_15px_-5px_rgba(0,0,0,0.5)]"
    : "bg-slate-300 border-slate-300 z-10 shadow-[-5px_0_15px_-5px_rgba(0,0,0,0.2)]";

  const windowBase = isNight ? "bg-transparent" : "bg-slate-400/20";

  const activeBackNight = "bg-amber-500/60";
  const activeBackDay = "bg-white/30";
  const activeFrontNight =
    "bg-amber-300/90 shadow-[0_0_4px_rgba(252,211,77,0.5)]";
  const activeFrontDay = "bg-white/50";

  return (
    <div className="absolute bottom-0 w-full h-[50vh] min-h-75 flex flex-col justify-end overflow-hidden">
      {/* Background */}
      <div className="absolute bottom-0 w-[200%] flex flex-row flex-nowrap items-end justify-start px-4 -mb-4">
        {backBuildings.map((building) => (
          <div
            key={building.id}
            className={`flex shrink-0 justify-center items-start pt-4 border-t transition-colors duration-1000 ${building.heightClass} ${building.marginLeftClass} ${backBg} w-20`}
          >
            <div
              className="grid gap-1.5 px-2"
              style={{
                gridTemplateColumns: `repeat(${building.cols}, minmax(0, 1fr))`,
              }}
            >
              {building.windows.map((win) => (
                <div
                  key={win.id}
                  className={`w-1.5 h-2.5 rounded-sm ${windowBase}`}
                >
                  {win.isLit && (
                    <motion.div
                      className={`w-full h-full rounded-sm ${isNight ? activeBackNight : activeBackDay}`}
                      animate={{
                        opacity: isNight ? [0.3, 0.8, 0.3] : [0, 0.6, 0],
                      }}
                      transition={{
                        duration: isNight ? win.duration : win.duration * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: win.delay,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Foreground */}
      <div className="absolute bottom-0 w-[200%] flex flex-row flex-nowrap items-end justify-start -mb-2">
        {frontBuildings.map((building) => (
          <div
            key={building.id}
            className={`flex shrink-0 justify-center items-start pt-4 border-t scale-y-75 transform origin-bottom transition-colors duration-1000 ${building.heightClass} ${building.marginLeftClass} ${frontBg} w-24 z-10`}
          >
            <div
              className="grid gap-2 px-2"
              style={{
                gridTemplateColumns: `repeat(${building.cols}, minmax(0, 1fr))`,
              }}
            >
              {building.windows.map((win) => (
                <div
                  key={win.id}
                  className={`w-2 h-3.5 rounded-sm ${windowBase}`}
                >
                  {win.isLit && (
                    <motion.div
                      className={`w-full h-full rounded-sm ${isNight ? activeFrontNight : activeFrontDay}`}
                      animate={{
                        opacity: isNight ? [0.5, 1, 0.5] : [0, 0.7, 0],
                      }}
                      transition={{
                        duration: isNight ? win.duration : win.duration * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: win.delay,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default CitySkyline;
