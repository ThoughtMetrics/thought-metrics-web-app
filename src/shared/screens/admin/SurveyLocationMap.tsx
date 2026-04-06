import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import L from 'leaflet';
import { MapContainer, TileLayer, CircleMarker, Tooltip, Polygon, useMap } from 'react-leaflet';
import surveyService from '@services/survey/survey.service';
import type { AcBoundaryEntry } from '@services/api/zone.service';

interface LocationPoint { latitude: number; longitude: number; count: number; }

// Deterministic color from AC name — hash string → HSL (unique per AC, stable across renders)
function acNameToColor(acName: string): string {
  let hash = 0;
  for (let i = 0; i < acName.length; i++) {
    hash = Math.imul(31, hash) + acName.charCodeAt(i) | 0;
  }
  const h = Math.abs(hash) % 360;
  const s = 55 + (Math.abs(hash >> 8) % 25);   // 55–79%
  const l = 35 + (Math.abs(hash >> 16) % 20);  // 35–54%
  return `hsl(${h}, ${s}%, ${l}%)`;
}

// Ray-casting point-in-polygon (GeoJSON ring = [[lng, lat], ...])
function pointInRing(lat: number, lng: number, ring: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]; // xi=lng, yi=lat
    const [xj, yj] = ring[j];
    if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

interface LocationResponseItem {
  id: string;
  respondent: { name: string | null; userId: string | null };
  submittedAt: string;
  submitterZone: string | null;
  submitterDistrict: string | null;
  submitterAc: string | null;
}

interface ActiveCluster { lat: number; lng: number; }

// Fix Leaflet's default icon path broken by bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1/dist/images/marker-shadow.png',
});

// Auto-fit map to response points, or to Tamil Nadu if no points
const FitBounds: React.FC<{ points: LocationPoint[] }> = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map((p) => [p.latitude, p.longitude]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    } else {
      // Fit to Tamil Nadu bounding box
      map.fitBounds([[8.0, 76.2], [13.6, 80.5]], { padding: [20, 20] });
    }
  }, [map, points]);
  return null;
};

// Shared polygon layer renderer
const BoundaryLayers: React.FC<{
  boundaries: AcBoundaryEntry[];
  acSubmissions?: Record<string, number>;
}> = ({ boundaries, acSubmissions }) => (
  <>
    {boundaries.flatMap((b) => {
      const count = acSubmissions?.[b.acName] ?? 0;
      const color = count > 0 ? '#C0392B' : '#4B5563';
      const pathOptions = { color, fillColor: color, fillOpacity: 0.5, weight: 2, opacity: 1 };
      const tooltip = (
        <Tooltip sticky direction="top">
          <span style={{ fontWeight: 600 }}>{b.acName}</span>
          {count > 0 && <span style={{ color: '#6B7280', marginLeft: 4 }}>· {count} responses</span>}
        </Tooltip>
      );

      if (b.geometry.type === 'Polygon') {
        const positions = (b.geometry.coordinates as number[][][])[0]
          .map(([lng, lat]) => [lat, lng] as [number, number]);
        return (
          <Polygon key={b.acNo} positions={positions} pathOptions={pathOptions}>
            {tooltip}
          </Polygon>
        );
      }

      return (b.geometry.coordinates as number[][][][]).map((poly, idx) => {
        const positions = poly[0].map(([lng, lat]) => [lat, lng] as [number, number]);
        return (
          <Polygon key={`${b.acNo}-${idx}`} positions={positions} pathOptions={pathOptions}>
            {tooltip}
          </Polygon>
        );
      });
    })}
  </>
);

// Response cluster panel (reused in both inline and fullscreen)
const ClusterPanel: React.FC<{
  loading: boolean;
  error: string | null;
  responses: LocationResponseItem[];
  onClose: () => void;
  onViewResponse?: (id: string) => void;
}> = ({ loading, error, responses, onClose, onViewResponse }) => (
  <div
    className="absolute top-2 right-10 z-1100 w-64 bg-white rounded-lg border border-gray-200 shadow-lg flex flex-col overflow-hidden"
    style={{ maxHeight: 'calc(100% - 1rem)' }}
  >
    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50 shrink-0">
      <span className="text-xs font-semibold text-gray-700">Responses at this location</span>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors ml-2" title="Close">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div className="overflow-y-auto flex-1">
      {loading && (
        <div className="flex items-center justify-center py-6">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {error && !loading && <p className="text-xs text-red-500 text-center py-4 px-3">{error}</p>}
      {!loading && !error && responses.length === 0 && (
        <p className="text-xs text-gray-400 text-center py-4">No responses found</p>
      )}
      {!loading && responses.map((r) => (
        <div
          key={r.id}
          className={`px-3 py-2 border-b border-gray-50 last:border-0 ${onViewResponse ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}`}
          onClick={() => onViewResponse?.(r.id)}
        >
          <div className="flex items-start justify-between gap-1">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-800 truncate">{r.respondent.name ?? 'Anonymous'}</p>
              <p className="text-[10px] text-gray-500 truncate mt-0.5">
                {[r.submitterZone, r.submitterDistrict, r.submitterAc].filter(Boolean).join(' / ') || 'No location info'}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">{new Date(r.submittedAt).toLocaleString()}</p>
            </div>
            {onViewResponse && <span className="text-[10px] text-primary shrink-0 mt-0.5">View →</span>}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── Fullscreen map overlay ────────────────────────────────────────────────────
const FullscreenMapOverlay: React.FC<{
  points: LocationPoint[];
  surveyId?: string;
  surveyLabel?: string;
  boundaries?: AcBoundaryEntry[];
  acSubmissions?: Record<string, number>;
  onViewResponse?: (id: string) => void;
  onClose: () => void;
}> = ({ points, surveyId, surveyLabel, boundaries, acSubmissions, onViewResponse, onClose }) => {
  const [selectedAc, setSelectedAc] = useState<string | null>(null);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [acResponsesMap, setAcResponsesMap] = useState<
    Record<string, { loading: boolean; error: string | null; items: LocationResponseItem[] }>
  >({});
  const sidebarContentRef = useRef<HTMLDivElement>(null);
  const defaultCenter: [number, number] = [10.7905, 78.6557];
  const maxCount = Math.max(...points.map((p) => p.count), 1);

  // Build acNo → color map (only when boundaries provided)
  const acColorMap = useMemo(() => {
    if (!boundaries) return null;
    const m = new globalThis.Map<number, string>();
    boundaries.forEach((b) => m.set(b.acNo, acNameToColor(b.acName)));
    return m;
  }, [boundaries]);

  // For each point, find which AC it falls in and return { color, acName }
  const pointAcInfo = useMemo(() => {
    if (!boundaries || !acColorMap) return null;
    return points.map((p) => {
      for (const b of boundaries) {
        const polys = b.geometry.type === 'Polygon'
          ? [b.geometry.coordinates as number[][][]]
          : (b.geometry.coordinates as number[][][][]);
        for (const poly of polys) {
          if (pointInRing(p.latitude, p.longitude, poly[0])) {
            return { color: acColorMap.get(b.acNo) ?? '#E8505E', acName: b.acName };
          }
        }
      }
      return { color: '#E8505E', acName: null };
    });
  }, [points, boundaries, acColorMap]);

  // Sorted AC list for sidebar.
  // Primary source: aggregate GPS points by AC using pointAcInfo (boundary polygon lookup).
  // This always works as long as fullscreenBoundaries is passed, regardless of
  // whether submitterAc is set on responses.
  // Count supplement: acSubmissions fills in ACs that have responses but no GPS points.
  const acList = useMemo(() => {
    const map: Record<string, { color: string; count: number }> = {};

    // 1. Tally GPS points into ACs via polygon lookup
    if (pointAcInfo) {
      pointAcInfo.forEach((info, i) => {
        if (!info.acName) return;
        const existing = map[info.acName];
        if (existing) {
          existing.count += points[i].count;
        } else {
          map[info.acName] = { color: info.color, count: points[i].count };
        }
      });
    }

    // 2. Supplement with acSubmissions for ACs not captured by GPS points
    if (acSubmissions) {
      Object.entries(acSubmissions).forEach(([acName, count]) => {
        if (!map[acName] && count > 0) {
          map[acName] = { color: acNameToColor(acName), count };
        }
      });
    }

    return Object.entries(map)
      .map(([acName, { color, count }]) => ({ acName, color, count }))
      .sort((a, b) => b.count - a.count);
  }, [pointAcInfo, points, acSubmissions]);

  // Lock body scroll and handle Escape key
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const handleAcSelect = async (acName: string | null) => {
    if (!acName) return;
    // Toggle off if same AC clicked again
    if (selectedAc === acName) {
      setSelectedAc(null);
      return;
    }
    setSelectedAc(acName);
    // Scroll sidebar to top
    sidebarContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

    // Already fetched — reuse cached data
    if (acResponsesMap[acName]) return;

    // Find all GPS points inside this AC via pointAcInfo
    const acPoints = points.filter((_, i) => pointAcInfo?.[i]?.acName === acName);
    if (!acPoints.length || !surveyId) {
      setAcResponsesMap((prev) => ({ ...prev, [acName]: { loading: false, error: null, items: [] } }));
      return;
    }

    setAcResponsesMap((prev) => ({ ...prev, [acName]: { loading: true, error: null, items: [] } }));
    try {
      const results = await Promise.all(
        acPoints.map((p) => surveyService.getLocationResponses(surveyId, p.latitude, p.longitude))
      );
      const allItems = results.flatMap((r) => r.data ?? []);
      const seen = new Set<string>();
      const unique = allItems.filter((r) => { if (seen.has(r.id)) return false; seen.add(r.id); return true; });
      setAcResponsesMap((prev) => ({ ...prev, [acName]: { loading: false, error: null, items: unique } }));
    } catch (err: any) {
      setAcResponsesMap((prev) => ({ ...prev, [acName]: { loading: false, error: err?.message ?? 'Failed to load', items: [] } }));
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-9999 flex flex-col bg-gray-900">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-semibold text-gray-800">
            {surveyLabel ? `${surveyLabel} — Response Map` : 'Response Map'}
          </span>
          {boundaries && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">
              Boundaries on
            </span>
          )}
          <span className="text-xs text-gray-400 ml-1">
            {points.reduce((s, p) => s + p.count, 0)} responses with GPS
          </span>
        </div>
        <button
          onClick={onClose}
          title="Close fullscreen (Esc)"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 9L4 4m0 0l5 0M4 4l0 5M15 9l5-5m0 0l-5 0m5 0l0 5M9 15l-5 5m0 0l5 0m-5 0l0-5M15 15l5 5m0 0l-5 0m5 0l0-5" />
          </svg>
          Exit fullscreen
        </button>
      </div>

      {/* Body: map + right sidebar side-by-side */}
      <div className="flex flex-1 min-h-0">

        {/* Map area */}
        <div className="relative flex-1 min-h-0 min-w-0">
          <MapContainer
            key="fullscreen-map"
            center={defaultCenter}
            zoom={7}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBounds points={points} />
            {boundaries && <BoundaryLayers boundaries={boundaries} acSubmissions={acSubmissions} />}
            {points.map((p, i) => {
              const acInfo = pointAcInfo?.[i];
              const pointAcName = acInfo?.acName ?? null;
              const isSelected = selectedAc !== null && pointAcName === selectedAc;
              const isDimmed = selectedAc !== null && pointAcName !== selectedAc;
              const radius = 8 + Math.round((p.count / maxCount) * 12);
              const baseColor = acInfo?.color ?? '#E8505E';
              const dotColor = isSelected ? '#C0392B' : baseColor;
              return (
                <CircleMarker
                  key={i}
                  center={[p.latitude, p.longitude]}
                  radius={radius}
                  pathOptions={{
                    color: dotColor,
                    fillColor: dotColor,
                    fillOpacity: isDimmed ? 0.15 : isSelected ? 0.9 : 0.75,
                    weight: isSelected ? 2.5 : 1.5,
                    opacity: isDimmed ? 0.3 : 1,
                  }}
                  eventHandlers={surveyId ? { click: () => handleAcSelect(pointAcName) } : {}}
                >
                  <Tooltip direction="top" offset={[0, -radius]}>
                    {p.count} {p.count === 1 ? 'response' : 'responses'}
                    {pointAcName && <span style={{ color: '#9CA3AF', marginLeft: 4 }}>· {pointAcName}</span>}
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        {/* Right sidebar */}
        {sidebarMinimized ? (
          /* Minimized strip */
          <div className="w-8 bg-white border-l border-gray-200 flex flex-col items-center py-2 gap-2 shrink-0">
            <button
              onClick={() => setSidebarMinimized(false)}
              title="Expand sidebar"
              className="w-6 h-6 flex items-center justify-center rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-[9px] text-gray-400 font-medium tracking-wide select-none" style={{ writingMode: 'vertical-lr' }}>
              Locations
            </span>
          </div>
        ) : (
          /* Expanded sidebar */
          <div className="w-72 bg-white border-l border-gray-200 flex flex-col overflow-hidden shrink-0">
            {/* Sidebar header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50 shrink-0">
              <div className="flex items-center gap-1.5 min-w-0">
                {selectedAc && (
                  <button
                    onClick={() => setSelectedAc(null)}
                    title="Back to AC list"
                    className="w-5 h-5 flex items-center justify-center rounded text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors shrink-0"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <span className="text-xs font-semibold text-gray-700 truncate">
                  {selectedAc ? selectedAc : 'AC Locations'}
                </span>
              </div>
              <button
                onClick={() => setSidebarMinimized(true)}
                title="Minimize sidebar"
                className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors shrink-0 ml-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Sidebar body */}
            <div ref={sidebarContentRef} className="overflow-y-auto flex-1">
              {!selectedAc ? (
                /* AC list — default view */
                acList.length === 0 ? (
                  <p className="text-[11px] text-gray-400 text-center px-4 py-6 leading-relaxed">
                    No responses with GPS data found
                  </p>
                ) : (
                  acList.map((ac) => (
                    <div
                      key={ac.acName}
                      onClick={() => handleAcSelect(ac.acName)}
                      className="flex items-center gap-2.5 px-3 py-2.5 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors select-none"
                    >
                      <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: ac.color }} />
                      <span className="text-xs text-gray-800 flex-1 truncate">{ac.acName}</span>
                      <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded shrink-0">
                        {ac.count}
                      </span>
                      <svg className="w-3 h-3 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ))
                )
              ) : (
                /* Response list for selected AC */
                (() => {
                  const acData = acResponsesMap[selectedAc];
                  return (
                    <>
                      {(!acData || acData.loading) && (
                        <div className="flex items-center justify-center py-8">
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      {acData?.error && !acData.loading && (
                        <p className="text-xs text-red-500 text-center py-6 px-3">{acData.error}</p>
                      )}
                      {acData && !acData.loading && !acData.error && acData.items.length === 0 && (
                        <p className="text-xs text-gray-400 text-center py-6">No responses found</p>
                      )}
                      {acData && !acData.loading && acData.items.map((r) => (
                        <div key={r.id} className="px-3 py-2.5 border-b border-gray-50 last:border-0">
                          <div className="flex items-start justify-between gap-1">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-800 truncate">
                                {r.respondent.name ?? 'Anonymous'}
                              </p>
                              <p className="text-[10px] text-gray-500 truncate mt-0.5">
                                {[r.submitterZone, r.submitterDistrict, r.submitterAc].filter(Boolean).join(' / ') || 'No location info'}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                {new Date(r.submittedAt).toLocaleString()}
                              </p>
                            </div>
                            {onViewResponse && (
                              <button
                                onClick={() => onViewResponse(r.id)}
                                className="text-[10px] text-primary font-medium shrink-0 mt-0.5 hover:underline"
                              >
                                View →
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  );
                })()
              )}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

// ── Main inline map component ─────────────────────────────────────────────────
interface SurveyLocationMapProps {
  points: LocationPoint[];
  surveyId?: string;
  surveyLabel?: string;
  onViewResponse?: (responseId: string) => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
  boundaries?: AcBoundaryEntry[];
  /** Always pass raw boundary data here so fullscreen auto-enables it even when the inline toggle is off */
  fullscreenBoundaries?: AcBoundaryEntry[];
  acSubmissions?: Record<string, number>;
}

const SurveyLocationMap: React.FC<SurveyLocationMapProps> = ({
  points, surveyId, surveyLabel, onViewResponse,
  expanded: controlledExpanded, onToggleExpand,
  boundaries, fullscreenBoundaries, acSubmissions,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isControlled = controlledExpanded !== undefined && onToggleExpand !== undefined;
  const expanded = isControlled ? controlledExpanded : internalExpanded;
  const toggleExpand = isControlled ? onToggleExpand : () => setInternalExpanded((e) => !e);

  const [activeCluster, setActiveCluster] = useState<ActiveCluster | null>(null);
  const [clusterResponses, setClusterResponses] = useState<LocationResponseItem[]>([]);
  const [clusterLoading, setClusterLoading] = useState(false);
  const [clusterError, setClusterError] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const fetchIdRef = useRef(0);

  useEffect(() => {
    const id = 'leaflet-css';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id; link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    const styleId = 'leaflet-no-focus';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = '.leaflet-interactive:focus { outline: none; }';
      document.head.appendChild(style);
    }
  }, []);

  const handleCircleClick = async (lat: number, lng: number) => {
    if (!surveyId) return;
    if (activeCluster?.lat === lat && activeCluster?.lng === lng) {
      setActiveCluster(null); setClusterResponses([]); return;
    }
    const fetchId = ++fetchIdRef.current;
    setActiveCluster({ lat, lng });
    setClusterResponses([]);
    setClusterLoading(true);
    setClusterError(null);
    try {
      const result = await surveyService.getLocationResponses(surveyId, lat, lng);
      if (fetchIdRef.current !== fetchId) return;
      setClusterResponses(result.data ?? []);
    } catch (err: any) {
      if (fetchIdRef.current !== fetchId) return;
      setClusterError(err?.message ?? 'Failed to load responses');
    } finally {
      if (fetchIdRef.current === fetchId) setClusterLoading(false);
    }
  };

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
    <>
      <div
        className="relative z-0 rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 ease-in-out"
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
          {boundaries && <BoundaryLayers boundaries={boundaries} acSubmissions={acSubmissions} />}
          {points.map((p, i) => {
            const isActive = activeCluster?.lat === p.latitude && activeCluster?.lng === p.longitude;
            const radius = 8 + Math.round((p.count / maxCount) * 12);
            return (
              <CircleMarker
                key={i}
                center={[p.latitude, p.longitude]}
                radius={radius}
                pathOptions={{
                  color: isActive ? '#C0392B' : '#E8505E',
                  fillColor: isActive ? '#C0392B' : '#E8505E',
                  fillOpacity: 0.6,
                  weight: isActive ? 2.5 : 1.5,
                }}
                eventHandlers={surveyId ? { click: () => handleCircleClick(p.latitude, p.longitude) } : {}}
              >
                <Tooltip permanent={p.count > 1} direction="top" offset={[0, -radius]}>
                  {p.count} {p.count === 1 ? 'response' : 'responses'}
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {activeCluster && (
          <ClusterPanel
            loading={clusterLoading}
            error={clusterError}
            responses={clusterResponses}
            onClose={() => { setActiveCluster(null); setClusterResponses([]); }}
            onViewResponse={onViewResponse}
          />
        )}

        {/* Fullscreen button — top-left */}
        <button
          onClick={() => setFullscreen(true)}
          title="Open fullscreen map"
          className="absolute right-2 bottom-2 z-1000 w-7 h-7 flex items-center justify-center rounded-md bg-white border border-gray-300 shadow-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5M20 8V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5M20 16v4m0 0h-4m4 0l-5-5" />
          </svg>
        </button>

        {/* Expand / collapse button — bottom-right */}
        {/* <button
          onClick={toggleExpand}
          title={expanded ? 'Collapse map' : 'Expand map'}
          className="absolute bottom-2 right-2 z-[1000] w-7 h-7 flex items-center justify-center rounded-md bg-white border border-gray-300 shadow-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {expanded ? (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 9L4 4m0 0l5 0M4 4l0 5M15 9l5-5m0 0l-5 0m5 0l0 5M9 15l-5 5m0 0l5 0m-5 0l0-5M15 15l5 5m0 0l-5 0m5 0l0-5" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5M20 8V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5M20 16v4m0 0h-4m4 0l-5-5" />
            </svg>
          )}
        </button> */}
      </div>

      {/* Fullscreen overlay — rendered via portal to document.body */}
      {fullscreen && (
        <FullscreenMapOverlay
          points={points}
          surveyId={surveyId}
          surveyLabel={surveyLabel}
          boundaries={fullscreenBoundaries ?? boundaries}
          acSubmissions={acSubmissions}
          onViewResponse={onViewResponse}
          onClose={() => setFullscreen(false)}
        />
      )}
    </>
  );
};

export default SurveyLocationMap;
