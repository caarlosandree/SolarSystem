export interface UIState {
  isMissionControlOpen: boolean;
  isCelestialPanelOpen: boolean;
  isPlanetInfoOpen: boolean;
  isChatbotOpen: boolean;
  isEclipseTourActive: boolean;
  eclipseTourType: 'solar' | 'lunar' | null;
  eclipseTourProgress: number;
  eclipsePhase: string;
  eclipsePhaseDesc: string;
  isUIVisible: boolean;
}

