// src/shared/ui/molecules/portal-menu.tsx
//
// Renders dropdown/kebab-menu content into document.body via a portal,
// positioned with `position: fixed` off the trigger element's own bounding
// rect. Use this instead of an `absolute`-positioned div whenever the
// trigger sits inside an `overflow-hidden`/`overflow-x-auto` ancestor (e.g.
// a table card) — a plain `absolute` + `z-index` menu gets clipped by such
// ancestors regardless of z-index, since clipping happens at the ancestor's
// box before stacking order is considered.

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalMenuProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  align?: 'left' | 'right';
  children: React.ReactNode;
}

export const PortalMenu: React.FC<PortalMenuProps> = ({ open, anchorEl, onClose, align = 'right', children }) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<React.CSSProperties>({ visibility: 'hidden' });

  // Position off the anchor's rect, flipping upward if there isn't enough
  // room below — runs before paint so there's no visible jump.
  useLayoutEffect(() => {
    if (!open || !anchorEl) return;

    const position = () => {
      const rect = anchorEl.getBoundingClientRect();
      const menuHeight = menuRef.current?.offsetHeight ?? 0;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpward = menuHeight > spaceBelow && rect.top > menuHeight;

      const next: React.CSSProperties = {
        position: 'fixed',
        top: openUpward ? rect.top - menuHeight - 4 : rect.bottom + 4,
        zIndex: 100,
      };
      if (align === 'right') {
        next.right = window.innerWidth - rect.right;
      } else {
        next.left = rect.left;
      }
      setStyle(next);
    };

    position();
    // A second pass once the menu has actually rendered its real height
    // (first pass may run with menuRef still at its previous/zero height).
    const raf = requestAnimationFrame(position);
    return () => cancelAnimationFrame(raf);
  }, [open, anchorEl, align, children]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (anchorEl?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      onClose();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleScroll = () => onClose();

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, anchorEl]);

  if (!open) return null;

  return createPortal(
    <div ref={menuRef} style={style}>
      {children}
    </div>,
    document.body
  );
};

export default PortalMenu;
