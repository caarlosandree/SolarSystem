import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { CelestialBody } from '@/types/planet';
import type { SolarSystemState } from '@/types/solarSystem';

interface SolarSystemContextType {
  state: SolarSystemState;
  setSpeed: (speed: number) => void;
  togglePause: () => void;
  toggleOrbits: () => void;
  toggleMoons: () => void;
  toggleRealAsteroids: () => void;
  toggleComets: () => void;
  setBloomStrength: (strength: number) => void;
  toggleBloomManual: () => void;
  selectBody: (body: CelestialBody | null) => void;
  followBody: (body: CelestialBody | null) => void;
  toggleLabels: () => void;
  toggleMoonLabels: () => void;
  setAsteroidBeltVisibility: (belt: keyof SolarSystemState['asteroidBeltVisibility'], visible: boolean) => void;
  toggleAsteroidBelt: (belt: keyof SolarSystemState['asteroidBeltVisibility']) => void;
  toggleAllAsteroidBelts: () => void;
}

const initialState: SolarSystemState = {
  speed: 0.4,
  isPaused: false,
  showOrbits: true,
  showMoons: true,
  showRealAsteroids: false,
  showComets: true,
  bloomStrength: 0.5,
  isBloomManual: false,
  selectedBody: null,
  followingBody: null,
  showLabels: false,
  showMoonLabels: false,
  asteroidBeltVisibility: {
    all: true,
    main: true,
    inner: true,
    middle: true,
    outer: true,
    trojans: true,
    kuiper: true,
    scattered: true,
    oort: true,
  },
};

const SolarSystemContext = createContext<SolarSystemContextType | undefined>(undefined);

export function SolarSystemProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SolarSystemState>(initialState);

  const setSpeed = useCallback((speed: number) => {
    setState((prev) => ({ ...prev, speed }));
  }, []);

  const togglePause = useCallback(() => {
    setState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const toggleOrbits = useCallback(() => {
    setState((prev) => ({ ...prev, showOrbits: !prev.showOrbits }));
  }, []);

  const toggleMoons = useCallback(() => {
    setState((prev) => ({ ...prev, showMoons: !prev.showMoons }));
  }, []);

  const toggleRealAsteroids = useCallback(() => {
    setState((prev) => ({ ...prev, showRealAsteroids: !prev.showRealAsteroids }));
  }, []);

  const toggleComets = useCallback(() => {
    setState((prev) => ({ ...prev, showComets: !prev.showComets }));
  }, []);

  const setBloomStrength = useCallback((strength: number) => {
    setState((prev) => ({ ...prev, bloomStrength: strength }));
  }, []);

  const toggleBloomManual = useCallback(() => {
    setState((prev) => ({ ...prev, isBloomManual: !prev.isBloomManual }));
  }, []);

  const selectBody = useCallback((body: CelestialBody | null) => {
    setState((prev) => ({ ...prev, selectedBody: body }));
  }, []);

  const followBody = useCallback((body: CelestialBody | null) => {
    setState((prev) => ({ ...prev, followingBody: body }));
  }, []);

  const toggleLabels = useCallback(() => {
    setState((prev) => ({ ...prev, showLabels: !prev.showLabels }));
  }, []);

  const toggleMoonLabels = useCallback(() => {
    setState((prev) => ({ ...prev, showMoonLabels: !prev.showMoonLabels }));
  }, []);

  const setAsteroidBeltVisibility = useCallback(
    (belt: keyof SolarSystemState['asteroidBeltVisibility'], visible: boolean) => {
      setState((prev) => ({
        ...prev,
        asteroidBeltVisibility: {
          ...prev.asteroidBeltVisibility,
          [belt]: visible,
        },
      }));
    },
    []
  );

  const toggleAsteroidBelt = useCallback(
    (belt: keyof SolarSystemState['asteroidBeltVisibility']) => {
      setState((prev) => ({
        ...prev,
        asteroidBeltVisibility: {
          ...prev.asteroidBeltVisibility,
          [belt]: !prev.asteroidBeltVisibility[belt],
        },
      }));
    },
    []
  );

  const toggleAllAsteroidBelts = useCallback(() => {
    setState((prev) => {
      const allVisible = prev.asteroidBeltVisibility.all;
      return {
        ...prev,
        asteroidBeltVisibility: {
          all: !allVisible,
          main: !allVisible,
          inner: !allVisible,
          middle: !allVisible,
          outer: !allVisible,
          trojans: !allVisible,
          kuiper: !allVisible,
          scattered: !allVisible,
          oort: !allVisible,
        },
      };
    });
  }, []);

  return (
    <SolarSystemContext.Provider
      value={{
        state,
        setSpeed,
        togglePause,
        toggleOrbits,
        toggleMoons,
        toggleRealAsteroids,
        toggleComets,
        setBloomStrength,
        toggleBloomManual,
        selectBody,
        followBody,
        toggleLabels,
        toggleMoonLabels,
        setAsteroidBeltVisibility,
        toggleAsteroidBelt,
        toggleAllAsteroidBelts,
      }}
    >
      {children}
    </SolarSystemContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSolarSystem() {
  const context = useContext(SolarSystemContext);
  if (context === undefined) {
    throw new Error('useSolarSystem must be used within a SolarSystemProvider');
  }
  return context;
}

