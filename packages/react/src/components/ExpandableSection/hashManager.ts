import { useEffect } from "react";

export function useHashManager(id: string, setIsOpen: (open: boolean) => void) {
  useEffect(() => {
    function handleHashChange() {
      if (!window.location.hash) {
        return;
      }
      const hash = window.location.hash.slice(1); // Remove the '#'

      // Check for exact match
      if (hash === id) {
        setIsOpen(true);
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            // Check if element is already in view (with buffer to prevent jumping)
            const rect = element.getBoundingClientRect();
            const buffer = 100; // pixels of buffer to prevent jumping when near viewport edges
            const isInView =
              rect.top >= -buffer && rect.bottom <= window.innerHeight + buffer;

            if (!isInView) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }
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

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [id, setIsOpen]);
}
