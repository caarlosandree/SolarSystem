import { useUI } from '@/contexts/UIContext';
import { useSolarSystem } from '@/contexts/SolarSystemContext';

export default function InfoPanel() {
  const { state: uiState, toggleInfoPanel } = useUI();
  const { followBody } = useSolarSystem();

  if (!uiState.isUIVisible) return null;

  return (
    <div className={`absolute bottom-2 left-2 md:bottom-4 md:left-4 bg-[rgba(0,29,61,0.85)] text-nasa-white rounded-md border border-panel-border backdrop-blur-md shadow-lg max-w-[calc(100%-5rem)] md:max-w-[200px] max-h-[35vh] md:max-h-none overflow-hidden transition-all duration-300 z-[98] ${uiState.isInfoPanelOpen ? '' : 'collapsed'}`}>
      <div className="px-3 py-3 md:px-2.5 md:py-2.5 bg-gradient-to-br from-nasa-red to-[#d32f2f] border-b border-panel-border cursor-pointer select-none transition-all duration-300" onClick={toggleInfoPanel}>
        <strong className="font-orbitron text-space-star-gold text-base md:text-sm flex justify-between items-center">
          EXPLORADOR SOLAR NASA <span className="text-base md:text-sm transition-transform duration-300">{uiState.isInfoPanelOpen ? '▼' : '►'}</span>
        </strong>
      </div>
      <div className={`px-3 py-3 md:px-2.5 md:py-2.5 text-sm md:text-[10px] font-titillium transition-all duration-300 overflow-y-auto max-h-[calc(35vh-60px)] md:max-h-none ${uiState.isInfoPanelOpen ? '' : 'max-h-0 p-0 overflow-hidden'}`}>
        🪐 8 Planetas
        <br />
        🌍 11 Planetas Anões
        <br />
        ☄️ 4 Cinturões de Asteroides
        <br />
        🌌 Objetos Transnetunianos
        <br />
        🙀 50+ Luas
        <br />
        ✨ Anéis de Órbita Brilhantes
        <br />
        🎵 Música Atmosférica
        <br />
        🛰️ Dados da NASA em Tempo Real
        <br />
        <button
          onClick={() => followBody(null)}
          className="w-full mt-4 px-4 py-3 md:px-3 md:py-1.5 bg-gradient-to-br from-space-asteroid-orange to-[#ff6b35] text-nasa-white border border-space-asteroid-orange rounded cursor-pointer font-orbitron font-semibold text-sm md:text-[10px] uppercase tracking-wide transition-all duration-300 hover:bg-gradient-to-br hover:from-[#ff6b35] hover:to-space-asteroid-orange hover:-translate-y-0.5 hover:shadow-[0_3px_10px_rgba(247,127,0,0.4)] active:scale-95"
        >
          ☀️ Seguir Sol
        </button>
      </div>
    </div>
  );
}

