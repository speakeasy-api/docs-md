import { useEffect } from "react";

export function useHashManager(id: string, setIsOpen: (open: boolean) => void) {
  useEffect(() => {
    // Prevent double-handling when both click and hashchange fire
    let suppressNextHashFor: string | null = null;
    let suppressTimer: number | null = null;
    function getHighlightColor(el: HTMLElement): string {
      const val = getComputedStyle(el).getPropertyValue(
        "--speakeasy-highlight-color"
      );
      const color = val?.trim();
      return color && color.length > 0 ? color : "rgba(255, 235, 59, 0.6)";
    }
    function getElement(): HTMLElement | null {
      return document.getElementById(id);
    }

    function isInViewWithBuffer(el: Element, buffer = 100): boolean {
      const rect = el.getBoundingClientRect();
      return rect.top >= -buffer && rect.bottom <= window.innerHeight + buffer;
    }

    function flashHighlight(el: HTMLElement) {
      const color = getHighlightColor(el);
      // Prefer WAAPI for a transient background flash without global CSS
      try {
        el.animate(
          [{ backgroundColor: color }, { backgroundColor: "transparent" }],
          { duration: 1200, easing: "ease-out" }
        );
      } catch {
        // Fallback if WAAPI is unavailable
        const original = el.style.backgroundColor;
        el.style.backgroundColor = color;
        window.setTimeout(() => {
          el.style.backgroundColor = original;
        }, 1200);
      }
    }

    function handleHashChange() {
      if (!window.location.hash) {
        return;
      }
      const hash = window.location.hash.slice(1); // Remove the '#'
      if (suppressNextHashFor && hash === suppressNextHashFor) {
        suppressNextHashFor = null;
        if (suppressTimer) {
          window.clearTimeout(suppressTimer);
          suppressTimer = null;
        }
        return;
      }

      // Check for exact match
      if (hash === id) {
        setIsOpen(true);
        setTimeout(() => {
          const element = getElement();
          if (!element) return;
          if (!isInViewWithBuffer(element)) {
            // Respect scroll padding via CSS scroll-margin; keep some headroom
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "nearest",
            });
          }
          // Always flash highlight, even if already on screen
          flashHighlight(element);
        }, 50);
        return;
      }

      // Check if this ID is in the path to the target
      // Split both by common separators (-, _, /)
      const hashParts = hash.split(/[-_/]/);
      const idParts = id.split(/[-_/]/);

      // Check if the hash starts with our ID segments
      // This ensures 'user-properties' opens for 'user-properties-name'
      // but NOT for 'new-user-properties' or 'user-settings-properties'
      if (idParts.length > 0 && hashParts.length >= idParts.length) {
        const matchesPath = idParts.every(
          (part, index) => hashParts[index] === part
        );
        if (matchesPath) {
          setIsOpen(true);
        }
      }
    }

    // Check initial hash on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    // Also listen for clicks on in-page anchors so we can
    // highlight even when the hash doesn't change.
    function handleAnchorClick(e: MouseEvent) {
      const target = e.target as Element | null;
      if (!target) return;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const targetHash = anchor.hash?.slice(1);
      if (!targetHash) return;

      // Exact target: open, possibly scroll, and highlight
      if (targetHash === id) {
        setIsOpen(true);
        suppressNextHashFor = id;
        // Clear suppression if no hashchange arrives shortly
        if (suppressTimer) {
          window.clearTimeout(suppressTimer);
        }
        suppressTimer = window.setTimeout(() => {
          suppressNextHashFor = null;
          suppressTimer = null;
        }, 500);
        // Run after navigation default handlers queue so DOM is updated
        setTimeout(() => {
          const element = getElement();
          if (!element) return;
          if (!isInViewWithBuffer(element)) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "nearest",
            });
          }
          flashHighlight(element);
        }, 0);
        return;
      }

      // Path prefix match: open but don't scroll
      const hashParts = targetHash.split(/[-_/]/);
      const idParts = id.split(/[-_/]/);
      if (
        idParts.length > 0 &&
        hashParts.length >= idParts.length &&
        idParts.every((part, index) => hashParts[index] === part)
      ) {
        setIsOpen(true);
      }
    }
    document.addEventListener("click", handleAnchorClick, true);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      document.removeEventListener("click", handleAnchorClick, true);
      if (suppressTimer) {
        window.clearTimeout(suppressTimer);
        suppressTimer = null;
      }
    };
  }, [id, setIsOpen]);
}
