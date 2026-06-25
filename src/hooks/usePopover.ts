import { useEffect, useId, useRef, useState } from 'react';

/**
 * Headless popover state: open/close plus dismissal on an outside click or the
 * Escape key. Returns a ref to spread on the popover's wrapper element and a
 * stable id to wire `aria-controls`/`id` between trigger and panel.
 */
export function usePopover<T extends HTMLElement = HTMLDivElement>() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<T>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    function handlePointer(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return { open, setOpen, containerRef, panelId };
}
