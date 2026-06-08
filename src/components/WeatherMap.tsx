import { memo, useEffect, useState } from "react";
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

const mapCursorStyles = `
  .leaflet-container { cursor: crosshair !important; }
  .leaflet-dragging .leaflet-container { cursor: grabbing !important; }
`;

interface ChangeViewProps {
  center: [number, number];
}

interface MapEventsTrackerProps {
  onRadarToggle: (visible: boolean) => void;
  onAqiToggle: (visible: boolean) => void;
  onMapClick?: (lat: number, lon: number) => void;
}

interface WeatherMapProps {
  lat: number;
  lon: number;
  city: string;
  onMapClick?: (lat: number, lon: number) => void;
}

function ChangeView({ center }: ChangeViewProps) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 10, { duration: 1.5 });
  }, [center, map]);
  return null;
}

function MapEventsTracker({
  onRadarToggle,
  onAqiToggle,
  onMapClick,
}: MapEventsTrackerProps) {
  useMapEvents({
    overlayadd(e: L.LayersControlEvent) {
      if (e.name.includes("Precipitation")) onRadarToggle(true);
      if (e.name.includes("Air Quality")) onAqiToggle(true);
    },
    overlayremove(e: L.LayersControlEvent) {
      if (e.name.includes("Precipitation")) onRadarToggle(false);
      if (e.name.includes("Air Quality")) onAqiToggle(false);
    },
    click(e: L.LeafletMouseEvent) {
      if (onMapClick) onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const WeatherMap = memo(({ lat, lon, city, onMapClick }: WeatherMapProps) => {
  const [radarUrl, setRadarUrl] = useState<string | null>(null);
  const [isRadarChecked, setIsRadarChecked] = useState<boolean>(
    () => localStorage.getItem("map_show_radar") !== "false",
  );
  const [isAqiChecked, setIsAqiChecked] = useState<boolean>(
    () => localStorage.getItem("map_show_aqi") === "true",
  );

  useEffect(() => {
    fetch("https://api.rainviewer.com/public/weather-maps.json")
      .then((res) => res.json())
      .then((data) => {
        if (data?.radar?.past?.length > 0) {
          const latestRadar = data.radar.past[data.radar.past.length - 1];
          setRadarUrl(
            `${data.host}${latestRadar.path}/256/{z}/{x}/{y}/2/1_1.png`,
          );
        }
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("map_show_radar", String(isRadarChecked));
    localStorage.setItem("map_show_aqi", String(isAqiChecked));
  }, [isRadarChecked, isAqiChecked]);

  return (
    <div className="w-full max-w-4xl mt-6 mb-4">
      <style>{mapCursorStyles}</style>

      <div className="flex items-center mb-2 px-1">
        <span className="text-[10px] sm:text-xs font-bold text-white bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-white/10">
          💡 You can also click anywhere on the map to see local weather
        </span>
      </div>

      <div className="card bg-base-100 shadow-xl backdrop-blur-md bg-opacity-90 border border-white/20 overflow-hidden">
        <div className="h-[300px] sm:h-[400px] w-full relative z-0">
          <MapContainer
            center={[lat, lon]}
            zoom={10}
            style={{ height: "100%", width: "100%" }}
          >
            <ChangeView center={[lat, lon]} />
            <MapEventsTracker
              onRadarToggle={setIsRadarChecked}
              onAqiToggle={setIsAqiChecked}
              onMapClick={onMapClick}
            />

            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="OpenStreetMap">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
              </LayersControl.BaseLayer>

              {radarUrl && (
                <LayersControl.Overlay
                  checked={isRadarChecked}
                  name="Precipitation (RainViewer)"
                >
                  <TileLayer
                    key={radarUrl}
                    url={radarUrl}
                    opacity={0.65}
                    maxNativeZoom={7}
                    attribution='| Precipitation &copy; <a href="https://www.rainviewer.com/">RainViewer</a>'
                  />
                </LayersControl.Overlay>
              )}

              <LayersControl.Overlay
                checked={isAqiChecked}
                name="Air Quality (WAQI)"
              >
                <TileLayer
                  url={`https://tiles.waqi.info/tiles/usepa-aqi/{z}/{x}/{y}.png?token=${import.meta.env.VITE_WAQI_API_KEY}`}
                  opacity={0.7}
                  attribution='| Air Quality &copy; <a href="https://waqi.info">WAQI</a>'
                />
              </LayersControl.Overlay>
            </LayersControl>

            <Marker position={[lat, lon]}>
              <Popup className="font-bold">{city}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
});

export default WeatherMap;
