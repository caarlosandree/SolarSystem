import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { UIState } from '@/types/ui';

interface UIContextType {
  state: UIState;
  toggleMissionControl: () => void;
  toggleCelestialPanel: () => void;
  openPlanetInfo: () => void;
  closePlanetInfo: () => void;
  toggleChatbot: () => void;
  startEclipseTour: (type: 'solar' | 'lunar') => void;
  stopEclipseTour: () => void;
  updateEclipseProgress: (progress: number, phase: string, phaseDesc: string) => void;
  toggleUIVisibility: () => void;
  toggleInfoPanel: () => void;
}

const initialState: UIState = {
  isMissionControlOpen: false,
  isCelestialPanelOpen: false,
  isPlanetInfoOpen: false,
  isChatbotOpen: false,
  isEclipseTourActive: false,
  eclipseTourType: null,
  eclipseTourProgress: 0,
  eclipsePhase: '',
  eclipsePhaseDesc: '',
  isUIVisible: true,
  isInfoPanelOpen: false,
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UIState>(initialState);

  const toggleMissionControl = useCallback(() => {
    setState((prev) => ({ ...prev, isMissionControlOpen: !prev.isMissionControlOpen }));
  }, []);

  const toggleCelestialPanel = useCallback(() => {
    setState((prev) => ({ ...prev, isCelestialPanelOpen: !prev.isCelestialPanelOpen }));
  }, []);

  const openPlanetInfo = useCallback(() => {
    setState((prev) => ({ ...prev, isPlanetInfoOpen: true }));
  }, []);

  const closePlanetInfo = useCallback(() => {
    setState((prev) => ({ ...prev, isPlanetInfoOpen: false }));
  }, []);

  const toggleChatbot = useCallback(() => {
    setState((prev) => ({ ...prev, isChatbotOpen: !prev.isChatbotOpen }));
  }, []);

  const startEclipseTour = useCallback((type: 'solar' | 'lunar') => {
    setState((prev) => ({
      ...prev,
      isEclipseTourActive: true,
      eclipseTourType: type,
      eclipseTourProgress: 0,
      eclipsePhase: 'Preparando',
      eclipsePhaseDesc: 'Vamos nos aproximar lentamente para que você possa ver claramente como o Sol, a Lua e a Terra se alinham — isso ajuda você a entender por que os eclipses acontecem.',
    }));
  }, []);

  const stopEclipseTour = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isEclipseTourActive: false,
      eclipseTourType: null,
      eclipseTourProgress: 0,
      eclipsePhase: '',
      eclipsePhaseDesc: '',
    }));
  }, []);

  const updateEclipseProgress = useCallback(
    (progress: number, phase: string, phaseDesc: string) => {
      setState((prev) => ({
        ...prev,
        eclipseTourProgress: progress,
        eclipsePhase: phase,
        eclipsePhaseDesc: phaseDesc,
      }));
    },
    []
  );

  const toggleUIVisibility = useCallback(() => {
    setState((prev) => ({ ...prev, isUIVisible: !prev.isUIVisible }));
  }, []);

  const toggleInfoPanel = useCallback(() => {
    setState((prev) => ({ ...prev, isInfoPanelOpen: !prev.isInfoPanelOpen }));
  }, []);

  return (
    <UIContext.Provider
      value={{
        state,
        toggleMissionControl,
        toggleCelestialPanel,
        openPlanetInfo,
        closePlanetInfo,
        toggleChatbot,
        startEclipseTour,
        stopEclipseTour,
        updateEclipseProgress,
        toggleUIVisibility,
        toggleInfoPanel,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}

