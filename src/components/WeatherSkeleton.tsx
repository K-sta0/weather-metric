import { memo } from "react";

const WeatherSkeleton = memo(() => {
  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl backdrop-blur-md bg-opacity-80 mt-4">
      <div className="card-body items-center text-center py-10">
        <div className="skeleton h-8 w-3/4 mb-4" />
        <div className="skeleton w-24 h-24 rounded-full mb-4" />
        <div className="skeleton h-14 w-1/2 mb-3" />
        <div className="skeleton h-5 w-1/3 mb-8" />

        <div className="grid grid-cols-3 gap-4 w-full bg-base-200/50 p-4 rounded-2xl">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex flex-col items-center gap-3">
              <div className="skeleton w-6 h-6 rounded-full" />
              <div className="skeleton h-4 w-12" />
              <div className="skeleton h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default WeatherSkeleton;
