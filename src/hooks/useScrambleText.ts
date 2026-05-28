import { useCallback, useRef } from 'react';

// Cosmic/runic character set for the scramble effect
const SCRAMBLE_CHARS = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθ∑∏∂∆∇∫≈≠≤≥×÷◈◉◊⬡⬢▸▹▷';

export function useScrambleText() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scramble = useCallback(
    (element: HTMLElement, targetText: string, duration = 400) => {
      if (intervalRef.current) clearInterval(intervalRef.current);

      const steps     = Math.ceil(duration / 35);
      let   iteration = 0;

      intervalRef.current = setInterval(() => {
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
          if (intervalRef.current) clearInterval(intervalRef.current);
          element.textContent = targetText;
        }
      }, 35);
    },
    []
  );

  const cancel = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  return { scramble, cancel };
}
