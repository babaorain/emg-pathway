import { useEffect, useRef } from "react";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])'
].join(",");

/**
 * Shared behaviour for the drawers and the sources modal: Escape closes, focus
 * moves into the overlay when it opens, Tab is kept inside it, and focus
 * returns to whatever opened it on close.
 *
 * Returns a ref to attach to the overlay container (which needs tabIndex={-1}).
 */
export function useOverlay<T extends HTMLElement>(
  open: boolean,
  onClose: () => void
) {
  const containerRef = useRef<T | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  // Held in a ref so an inline `onClose` arrow doesn't re-run the effect and
  // clobber the saved trigger element on every render.
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    lastFocused.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const container = containerRef.current;
    const focusables = () =>
      Array.from(
        container?.querySelectorAll<HTMLElement>(focusableSelector) ?? []
      ).filter((element) => element.offsetParent !== null);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        closeRef.current();
        return;
      }

      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === container)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    // Deferred a frame: these overlays animate in from `visibility: hidden`,
    // and focus() is a no-op while the subtree is still hidden.
    const frame = requestAnimationFrame(() => {
      const initial =
        container?.querySelector<HTMLElement>("[data-autofocus]") ?? container;
      initial?.focus();
    });

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      lastFocused.current?.focus();
    };
  }, [open]);

  return containerRef;
}
