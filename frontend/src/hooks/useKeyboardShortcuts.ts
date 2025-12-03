import { useEffect } from 'react';
import { useSolarSystem } from '@/contexts/SolarSystemContext';
import { useUI } from '@/contexts/UIContext';
import { useMusic } from '@/hooks/useMusic';

export function useKeyboardShortcuts() {
  const { state, setSpeed, togglePause, toggleOrbits, toggleMoons, toggleBloomManual, setBloomStrength, followBody } = useSolarSystem();
  const { toggleUIVisibility } = useUI();
  const { toggle: toggleMusic } = useMusic();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if focus is on chat input to allow normal typing
      const chatInput = document.getElementById('chatbotInput');
      if (document.activeElement === chatInput) {
        return; // Let the spacebar work normally in the chat input
      }

      const key = event.key.toLowerCase();

      switch (key) {
        case ' ': // Spacebar to pause/resume
          event.preventDefault();
          togglePause();
          break;

        case 'r': // R to reset view
          event.preventDefault();
          if ((window as any).__resetCamera) {
            (window as any).__resetCamera();
            followBody(null);
          }
          break;

        case 'f': // F to stop following planet
          event.preventDefault();
          followBody(null);
          break;

        case 'o': // O to toggle orbits
          event.preventDefault();
          toggleOrbits();
          break;

        case 'a': // A to cycle through asteroid belt types
          event.preventDefault();
          // This would need to be implemented with asteroid belt visibility toggles
          console.log('Ciclo de cinturão de asteroides - a ser implementado');
          break;

        case 'm': // M to toggle moons
          event.preventDefault();
          toggleMoons();
          break;

        case 'h': // H to toggle UI visibility
          event.preventDefault();
          toggleUIVisibility();
          break;

        case 'p': // P to toggle music (Play/Pause)
          event.preventDefault();
          toggleMusic();
          break;

        case '+':
        case '=': // Increase speed
          event.preventDefault();
          const newSpeed = Math.min(10, state.speed + 0.5);
          setSpeed(newSpeed);
          break;

        case '-': // Decrease speed
          event.preventDefault();
          const decreasedSpeed = Math.max(0, state.speed - 0.5);
          setSpeed(decreasedSpeed);
          break;

        case 'b': // B to toggle bloom mode (Auto/Manual)
          event.preventDefault();
          toggleBloomManual();
          if (state.isBloomManual) {
            // When switching to manual, set to current auto value
            setBloomStrength(0.5);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    state.speed,
    state.isBloomManual,
    togglePause,
    toggleOrbits,
    toggleMoons,
    toggleBloomManual,
    setSpeed,
    setBloomStrength,
    followBody,
    toggleUIVisibility,
    toggleMusic,
  ]);
}

