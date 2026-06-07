import { memo, useEffect, useState, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  LayersControl,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix for missing default marker icons in React-Leaflet
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 10, {
      duration: 1.5,
    });
  }, [center, map]);
  return null;
}

function MapLayerTracker({
  onRadarToggle,
  onAqiToggle,
}: {
  onRadarToggle: (visible: boolean) => void;
  onAqiToggle: (visible: boolean) => void;
}) {
  useMapEvents({
    overlayadd(e) {
      if (e.name.includes("Rain Radar")) onRadarToggle(true);
      if (e.name.includes("Air Quality")) onAqiToggle(true);
    },
    overlayremove(e) {
      if (e.name.includes("Rain Radar")) onRadarToggle(false);
      if (e.name.includes("Air Quality")) onAqiToggle(false);
    },
  });
  return null;
}

interface WeatherMapProps {
  lat: number;
  lon: number;
  city: string;
}

const WeatherMap = memo(({ lat, lon, city }: WeatherMapProps) => {
  const [radarUrl, setRadarUrl] = useState<string | null>(null);

  const [isRadarChecked, setIsRadarChecked] = useState<boolean>(() => {
    const saved = localStorage.getItem("map_show_radar");
    return saved !== null ? saved === "true" : true;
  });

  const [isAqiChecked, setIsAqiChecked] = useState<boolean>(() => {
    const saved = localStorage.getItem("map_show_aqi");
    return saved === "true";
  });

  useEffect(() => {
    fetch("https://api.rainviewer.com/public/weather-maps.json")
      .then((res) => res.json())
      .then((data) => {
        if (data?.radar?.past && data.radar.past.length > 0) {
          const pastRadars = data.radar.past;
          const latestRadar = pastRadars[pastRadars.length - 1];
          const url = `${data.host}${latestRadar.path}/256/{z}/{x}/{y}/2/1_1.png`;
          setRadarUrl(url);
        }
      })
      .catch((err) => console.error("Failed to fetch radar data:", err));
  }, []);

  const handleRadarToggle = useCallback((visible: boolean) => {
    setIsRadarChecked(visible);
    localStorage.setItem("map_show_radar", String(visible));
  }, []);

  const handleAqiToggle = useCallback((visible: boolean) => {
    setIsAqiChecked(visible);
    localStorage.setItem("map_show_aqi", String(visible));
  }, []);

  if (!lat || !lon) return null;

  const position: [number, number] = [lat, lon];
  const WAQI_KEY = import.meta.env.VITE_WAQI_API_KEY;
  const waqiLayerUrl = `https://tiles.waqi.info/tiles/usepa-aqi/{z}/{x}/{y}.png?token=${WAQI_KEY}`;

  return (
    <div className="w-full max-w-4xl mt-6 mb-4">
      <div className="card bg-base-100 shadow-xl backdrop-blur-md bg-opacity-90 border border-white/20 overflow-hidden">
        <div className="card-body p-0 sm:p-0">
          <div className="h-[300px] sm:h-[400px] w-full relative z-0">
            <MapContainer
              center={position}
              zoom={10}
              scrollWheelZoom={true}
              attributionControl={true}
              style={{ height: "100%", width: "100%", zIndex: 0 }}
            >
              <ChangeView center={position} />

              <MapLayerTracker
                onRadarToggle={handleRadarToggle}
                onAqiToggle={handleAqiToggle}
              />

              <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="OpenStreetMap">
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Air Quality tiles &copy; <a href="https://waqi.info">WAQI</a>'
                  />
                </LayersControl.BaseLayer>
                {radarUrl && (
                  <LayersControl.Overlay
                    checked={isRadarChecked}
                    name="Rain Radar (RainViewer)"
                  >
                    <TileLayer
                      key={radarUrl}
                      url={radarUrl}
                      opacity={0.65}
                      maxNativeZoom={7}
                    />
                  </LayersControl.Overlay>
                )}
                <LayersControl.Overlay
                  checked={isAqiChecked}
                  name="Air Quality (WAQI)"
                >
                  <TileLayer url={waqiLayerUrl} opacity={0.7} />
                </LayersControl.Overlay>
              </LayersControl>

              <Marker position={position}>
                <Popup className="font-bold">{city}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
});

export default WeatherMap;
