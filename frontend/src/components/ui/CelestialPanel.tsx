import { useUI } from '@/contexts/UIContext';
import { useSolarSystem } from '@/contexts/SolarSystemContext';
import { celestialBodies } from '@/utils/constants';

export default function CelestialPanel() {
  const { state: uiState, toggleCelestialPanel, openPlanetInfo } = useUI();
  const { state, toggleLabels, toggleMoonLabels, selectBody } = useSolarSystem();

  if (!uiState.isUIVisible) return null;

  // Calcula posição e largura baseado no estado dos painéis
  const getPositionClasses = () => {
    // No desktop, sempre mantém posição fixa
    if (uiState.isMissionControlOpen) {
      // Se MissionControl está aberto, CelestialPanel fica abaixo dele no mobile
      return 'top-[calc(50vh+0.5rem)] left-2 w-[calc(100%-1rem)] md:left-auto md:right-4 md:top-4 md:w-auto';
    } else if (uiState.isCelestialPanelOpen) {
      // Se CelestialPanel está aberto e MissionControl fechado, ocupa toda largura no mobile
      return 'top-2 left-2 w-[calc(100%-1rem)] md:left-auto md:right-4 md:top-4 md:w-auto';
    }
    // Ambos fechados - lado a lado no mobile
    return 'top-2 left-[calc(50%+0.25rem)] w-[calc(50%-0.75rem)] md:left-auto md:right-4 md:top-4 md:w-auto';
  };

  return (
    <div className={`absolute ${getPositionClasses()} bg-panel-bg text-nasa-white rounded-md border border-panel-border backdrop-blur-md shadow-lg md:min-w-[180px] max-h-[40vh] md:max-h-[350px] overflow-hidden transition-all duration-300 z-[99] ${uiState.isCelestialPanelOpen ? '' : 'collapsed'}`}>
      <div className="px-2 py-2.5 md:px-2 md:py-2 bg-gradient-to-br from-nasa-red to-[#d32f2f] border-b border-panel-border cursor-pointer select-none transition-all duration-300" onClick={toggleCelestialPanel}>
        <div className="flex flex-col md:flex-row items-center md:justify-between gap-1 md:gap-0">
          <div className="text-xl md:text-base">🪐</div>
          <h4 className="m-0 font-orbitron font-bold text-xs md:text-[13px] text-nasa-white uppercase tracking-wide text-center md:text-left">
            <span className="hidden md:inline">Corpos Celestes</span>
            <span className="md:hidden">Celestes</span>
          </h4>
          <span className="text-xs md:text-sm transition-transform duration-300">{uiState.isCelestialPanelOpen ? '▼' : '►'}</span>
        </div>
      </div>
      <div className={`max-h-[calc(40vh-80px)] md:max-h-[290px] overflow-y-auto transition-all duration-300 ${uiState.isCelestialPanelOpen ? '' : 'max-h-0 overflow-hidden'}`}>
        <div className="p-2 md:p-2 bg-black/30 border-b border-space-star-gold/20 flex flex-col gap-1.5 md:gap-1.5">
          <button
            onClick={toggleLabels}
            className={`w-full px-2 py-2 md:px-2 md:py-1 rounded border border-white/20 text-xs md:text-[10px] font-titillium font-medium uppercase tracking-wide transition-all duration-300 ${state.showLabels ? 'bg-gradient-to-br from-space-star-gold to-[#ffa000] text-nasa-black shadow-[0_0_10px_rgba(255,214,10,0.5)]' : 'bg-gradient-to-br from-nasa-dark-gray to-[#404040] text-nasa-white hover:bg-gradient-to-br hover:from-nasa-blue hover:to-[#0a2a66] hover:shadow-[0_0_10px_rgba(11,61,145,0.5)]'} hover:-translate-y-0.5 active:scale-95`}
          >
            Nomes Planetas
          </button>
          <button
            onClick={toggleMoonLabels}
            className={`w-full px-2 py-2 md:px-2 md:py-1 rounded border border-white/20 text-xs md:text-[10px] font-titillium font-medium uppercase tracking-wide transition-all duration-300 ${state.showMoonLabels ? 'bg-gradient-to-br from-space-star-gold to-[#ffa000] text-nasa-black shadow-[0_0_10px_rgba(255,214,10,0.5)]' : 'bg-gradient-to-br from-nasa-dark-gray to-[#404040] text-nasa-white hover:bg-gradient-to-br hover:from-nasa-blue hover:to-[#0a2a66] hover:shadow-[0_0_10px_rgba(11,61,145,0.5)]'} hover:-translate-y-0.5 active:scale-95`}
          >
            Nomes Luas
          </button>
        </div>
        <div>
          {celestialBodies.map((body) => (
            <div
              key={body.name}
              onClick={() => {
                selectBody(body);
                openPlanetInfo();
              }}
              className="px-2 py-2 md:px-3 md:py-2 border-b border-white/10 cursor-pointer transition-all duration-300 text-xs md:text-[11px] font-titillium hover:bg-space-star-gold/10 hover:translate-x-1 hover:shadow-[0_2px_8px_rgba(255,214,10,0.2)] active:bg-space-star-gold/20"
            >
              <strong className={`font-orbitron font-semibold text-sm md:text-xs ${
                body.type === 'planet' ? 'text-[#64b5f6]' :
                body.type === 'dwarf' ? 'text-space-star-gold' :
                body.type === 'asteroid' ? 'text-space-asteroid-orange' :
                'text-space-nebula-purple'
              }`}>
                {body.name}
              </strong>
              <br />
              <small className="font-titillium font-normal opacity-80 text-xs md:text-xs">{
                body.type === 'planet' ? 'PLANETA' :
                body.type === 'dwarf' ? 'ANÃO' :
                body.type === 'asteroid' ? 'ASTEROIDE' :
                body.type.toUpperCase()
              }</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

