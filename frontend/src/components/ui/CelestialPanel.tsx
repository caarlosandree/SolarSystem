import { useUI } from '@/contexts/UIContext';
import { useSolarSystem } from '@/contexts/SolarSystemContext';
import { celestialBodies } from '@/utils/constants';

export default function CelestialPanel() {
  const { state: uiState, toggleCelestialPanel, openPlanetInfo } = useUI();
  const { state, toggleLabels, toggleMoonLabels, selectBody } = useSolarSystem();

  if (!uiState.isUIVisible) return null;

  return (
    <div className={`absolute top-4 right-4 bg-panel-bg text-nasa-white rounded-md border border-panel-border backdrop-blur-md shadow-lg min-w-[180px] max-h-[350px] overflow-hidden transition-all duration-300 ${uiState.isCelestialPanelOpen ? '' : 'collapsed'}`}>
      <div className="px-2 py-2 bg-gradient-to-br from-nasa-red to-[#d32f2f] border-b border-panel-border cursor-pointer select-none transition-all duration-300" onClick={toggleCelestialPanel}>
        <h4 className="m-0 font-orbitron font-bold text-[13px] text-nasa-white uppercase tracking-wide flex justify-between items-center">
          Corpos Celestes <span className="text-base transition-transform duration-300">{uiState.isCelestialPanelOpen ? '▼' : '►'}</span>
        </h4>
      </div>
      <div className={`max-h-[290px] overflow-y-auto transition-all duration-300 ${uiState.isCelestialPanelOpen ? '' : 'max-h-0'}`}>
        <div className="p-2 bg-black/30 border-b border-space-star-gold/20 flex flex-col gap-1.5">
          <button
            onClick={toggleLabels}
            className={`w-full px-2 py-1 rounded border border-white/20 text-[10px] font-titillium font-medium uppercase tracking-wide transition-all duration-300 ${state.showLabels ? 'bg-gradient-to-br from-space-star-gold to-[#ffa000] text-nasa-black shadow-[0_0_10px_rgba(255,214,10,0.5)]' : 'bg-gradient-to-br from-nasa-dark-gray to-[#404040] text-nasa-white hover:bg-gradient-to-br hover:from-nasa-blue hover:to-[#0a2a66] hover:shadow-[0_0_10px_rgba(11,61,145,0.5)]'} hover:-translate-y-0.5`}
          >
            Mostrar Nomes dos Planetas
          </button>
          <button
            onClick={toggleMoonLabels}
            className={`w-full px-2 py-1 rounded border border-white/20 text-[10px] font-titillium font-medium uppercase tracking-wide transition-all duration-300 ${state.showMoonLabels ? 'bg-gradient-to-br from-space-star-gold to-[#ffa000] text-nasa-black shadow-[0_0_10px_rgba(255,214,10,0.5)]' : 'bg-gradient-to-br from-nasa-dark-gray to-[#404040] text-nasa-white hover:bg-gradient-to-br hover:from-nasa-blue hover:to-[#0a2a66] hover:shadow-[0_0_10px_rgba(11,61,145,0.5)]'} hover:-translate-y-0.5`}
          >
            Mostrar Nomes das Luas
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
              className="px-3 py-2 border-b border-white/10 cursor-pointer transition-all duration-300 text-[11px] font-titillium hover:bg-space-star-gold/10 hover:translate-x-1 hover:shadow-[0_2px_8px_rgba(255,214,10,0.2)]"
            >
              <strong className={`font-orbitron font-semibold text-xs ${
                body.type === 'planet' ? 'text-[#64b5f6]' :
                body.type === 'dwarf' ? 'text-space-star-gold' :
                body.type === 'asteroid' ? 'text-space-asteroid-orange' :
                'text-space-nebula-purple'
              }`}>
                {body.name}
              </strong>
              <br />
              <small className="font-titillium font-normal opacity-80">{
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

