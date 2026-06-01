import { useCallback, useRef, useEffect } from 'react';

// Cosmic/runic character set for the scramble effect
const SCRAMBLE_CHARS = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθ∑∏∂∆∇∫≈≠≤≥×÷◈◉◊⬡⬢▸▹▷';

export function useScrambleText() {
  const intervalsRef = useRef<Map<HTMLElement, ReturnType<typeof setInterval>>>(new Map());

  const scramble = useCallback(
    (element: HTMLElement, targetText: string, duration = 400) => {
      // Clear existing interval for this specific element if any
      const existing = intervalsRef.current.get(element);
      if (existing) clearInterval(existing);

      const steps     = Math.ceil(duration / 35);
      let   iteration = 0;

      const interval = setInterval(() => {
        const progress = iteration / steps;

        element.textContent = targetText
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            // Characters resolve left-to-right as progress increases
            if (i < progress * targetText.length) return char;
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join('');

        iteration++;
        if (iteration > steps) {
          clearInterval(interval);
          intervalsRef.current.delete(element);
          element.textContent = targetText;
        }
      }, 35);

      intervalsRef.current.set(element, interval);
    },
    []
  );

  const cancel = useCallback((element?: HTMLElement) => {
    if (element) {
      const existing = intervalsRef.current.get(element);
      if (existing) {
        clearInterval(existing);
        intervalsRef.current.delete(element);
      }
    } else {
      intervalsRef.current.forEach((interval) => clearInterval(interval));
      intervalsRef.current.clear();
    }
  }, []);

  // Clean up all intervals on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      intervalsRef.current.forEach((interval) => clearInterval(interval));
    };
  }, []);

  return { scramble, cancel };
}

