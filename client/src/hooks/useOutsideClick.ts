import { useEffect, useRef } from 'react';

type Handler = () => void;

function useOutsideClick(handler: Handler) {
  // Define the type for the ref
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Check if the ref's current element exists and if the click target is outside of it
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handler]);

  return ref;
}

export default useOutsideClick;
