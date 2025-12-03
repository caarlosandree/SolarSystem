import { SolarSystemProvider } from '@/contexts/SolarSystemContext';
import { UIProvider } from '@/contexts/UIContext';
import SolarSystem from '@/components/solar-system/SolarSystem';
import MissionControl from '@/components/ui/MissionControl';
import CelestialPanel from '@/components/ui/CelestialPanel';
import PlanetInfoCard from '@/components/ui/PlanetInfoCard';
import EclipseTourInfo from '@/components/ui/EclipseTourInfo';
import Chatbot from '@/components/ui/Chatbot';
import ChatbotToggle from '@/components/ui/ChatbotToggle';
import MusicControls from '@/components/ui/MusicControls';
import InfoPanel from '@/components/ui/InfoPanel';

function App() {
  return (
    <SolarSystemProvider>
      <UIProvider>
        <div className="relative h-screen w-screen overflow-hidden">
          <SolarSystem />
          <MissionControl />
          <CelestialPanel />
          <PlanetInfoCard />
          <EclipseTourInfo />
          <Chatbot />
          <ChatbotToggle />
          <MusicControls />
          <InfoPanel />
        </div>
      </UIProvider>
    </SolarSystemProvider>
  );
}

export default App;

