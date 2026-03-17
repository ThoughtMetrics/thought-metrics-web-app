import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';

interface LocationPoint { latitude: number; longitude: number; count: number; }

// Fix Leaflet's default icon path broken by bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1/dist/images/marker-shadow.png',
});

// Auto-fit map to all points
const FitBounds: React.FC<{ points: LocationPoint[] }> = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points.map((p) => [p.latitude, p.longitude]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [map, points]);
  return null;
};


interface SurveyLocationMapProps {
  points: LocationPoint[];
  expanded?: boolean;
  onToggleExpand?: () => void;
}

const SurveyLocationMap: React.FC<SurveyLocationMapProps> = ({ points, expanded: controlledExpanded, onToggleExpand }) => {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isControlled = controlledExpanded !== undefined && onToggleExpand !== undefined;
  const expanded = isControlled ? controlledExpanded : internalExpanded;
  const toggleExpand = isControlled ? onToggleExpand : () => setInternalExpanded((e) => !e);

  useEffect(() => {
    const id = 'leaflet-css';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
  }, []);

  if (points.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-400">No GPS coordinates recorded</p>
      </div>
    );
  }

  const maxCount = Math.max(...points.map((p) => p.count), 1);
  const defaultCenter: [number, number] = [10.7905, 78.6557];
  const mapHeight = expanded ? 450 : 220;

  return (
    <div
      className="relative rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 ease-in-out"
      style={{ height: mapHeight }}
    >
      <MapContainer
        center={defaultCenter}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />
        {points.map((p, i) => {
          const radius = 8 + Math.round((p.count / maxCount) * 12);
          return (
            <CircleMarker
              key={i}
              center={[p.latitude, p.longitude]}
              radius={radius}
              pathOptions={{ color: '#E8505E', fillColor: '#E8505E', fillOpacity: 0.6, weight: 1.5 }}
            >
              <Tooltip permanent={p.count > 1} direction="top" offset={[0, -radius]}>
                {p.count} {p.count === 1 ? 'response' : 'responses'}
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Expand / collapse button */}
      <button
        onClick={toggleExpand}
        title={expanded ? 'Collapse map' : 'Expand map'}
        className="absolute bottom-2 right-2 z-[1000] w-7 h-7 flex items-center justify-center rounded-md bg-white border border-gray-300 shadow-sm text-gray-600 hover:bg-gray-50 transition-colors"
      >
        {expanded ? (
          /* Minimize icon */
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 9L4 4m0 0l5 0M4 4l0 5M15 9l5-5m0 0l-5 0m5 0l0 5M9 15l-5 5m0 0l5 0m-5 0l0-5M15 15l5 5m0 0l-5 0m5 0l0-5" />
          </svg>
        ) : (
          /* Maximize icon */
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5M20 8V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5M20 16v4m0 0h-4m4 0l-5-5" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default SurveyLocationMap;
