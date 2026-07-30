// components/VgpDashboardEmbed.tsx
//
// Landscape (16:9) view-only preview of a client's external dashboard (e.g.
// VGP Wonder World's research dashboard). Auto-authenticated via a Firebase
// custom token minted server-side for the caller's own account — the
// embedded app shares the same Firebase project, so no second login is
// needed to render real, live content in the thumbnail.
//
// The preview itself is NOT interactive — the live iframe is rendered at its
// natural desktop size and scaled down to fit the landscape frame (so it
// looks like an actual dashboard, not a cropped corner of one), with
// pointer-events disabled. A transparent overlay captures the click and
// opens the real dashboard in a new tab (freshly authenticated there too),
// instead of letting the user navigate around inside the small preview.
//
// Renders nothing if the client has no dashboardUrl configured (the common
// case), and fails silently (no broken UI) if the token mint fails.

import React, { useEffect, useRef, useState } from 'react';
import authService from '@/services/api/auth.service';
import { LoaderUI } from '@/shared/ui/atoms/loader/LoaderUI';

// Virtual size the embedded dashboard is rendered at, then scaled down to
// fit the frame — matches the 16:9 frame so it fills it edge-to-edge.
const VIRTUAL_WIDTH = 1600;
const VIRTUAL_HEIGHT = 900;

function buildSsoUrl(dashboardUrl: string, customToken: string): string {
  return `${dashboardUrl.replace(/\/$/, '')}/login/index.html?ssoToken=${encodeURIComponent(customToken)}&next=${encodeURIComponent('/dashboard/index.html')}`;
}

const VgpDashboardEmbed: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardUrl, setDashboardUrl] = useState<string | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const profile = await authService.getUserProfile();
        const url = profile.dashboardUrl;
        if (!url) return;
        if (!cancelled) setDashboardUrl(url);

        const customToken = await authService.getDashboardSsoToken();
        if (!customToken || cancelled) return;

        if (!cancelled) setPreviewSrc(buildSsoUrl(url, customToken));
      } catch {
        // non-fatal — no external dashboard configured or reachable, just don't show the preview
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  // Scale the virtual-size iframe down to fit the frame's actual rendered width
  useEffect(() => {
    if (!previewSrc || !frameRef.current) return;
    const el = frameRef.current;
    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / VIRTUAL_WIDTH);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [previewSrc]);

  // Open a fresh, freshly-authenticated tab — the blank tab is opened
  // synchronously (inside the click handler) so popup blockers don't kill it
  // once the async token mint resolves afterward.
  const handleOpen = () => {
    if (!dashboardUrl) return;
    const newTab = window.open('', '_blank', 'noreferrer');
    authService.getDashboardSsoToken().then((token) => {
      if (!newTab) return;
      newTab.location.href = token ? buildSsoUrl(dashboardUrl, token) : dashboardUrl;
    });
  };

  if (loading) {
    return (
      <div className="bg-surface-container rounded-xl shadow-sm border border-outline-variant/50 mb-8 aspect-[16/9] flex items-center justify-center">
        <LoaderUI message="Loading dashboard…" />
      </div>
    );
  }

  if (!previewSrc) return null;

  return (
    <div
      className="group relative bg-surface-container rounded-xl shadow-sm border border-outline-variant/50 mb-8 aspect-[16/9] overflow-hidden cursor-pointer"
      onClick={handleOpen}
    >
      <div
        ref={frameRef}
        style={{
          width: VIRTUAL_WIDTH,
          height: VIRTUAL_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          pointerEvents: 'none',
        }}
      >
        <iframe
          src={previewSrc}
          title="Your dashboard preview"
          width={VIRTUAL_WIDTH}
          height={VIRTUAL_HEIGHT}
          className="border-0"
          tabIndex={-1}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>

      {/* Click-to-open overlay — the preview itself is view-only */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
        <span className="px-4 py-2 rounded-lg bg-surface-container text-on-surface text-sm font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
          Open Dashboard ↗
        </span>
      </div>
    </div>
  );
};

export default VgpDashboardEmbed;
