import { useSolarSystem } from '@/contexts/SolarSystemContext';
import { useUI } from '@/contexts/UIContext';
import { useMusic } from '@/hooks/useMusic';

export default function MissionControl() {
  const { state, setSpeed, togglePause, toggleOrbits, toggleMoons, toggleRealAsteroids, toggleComets, setBloomStrength, toggleAsteroidBelt, toggleAllAsteroidBelts } = useSolarSystem();
  const { state: uiState, toggleMissionControl } = useUI();
  const { isPlaying, volume, setVolume, toggle: toggleMusic } = useMusic();

  const speedLabel = state.speed < 0.5 ? 'Lento' : state.speed < 1 ? 'Normal' : state.speed < 5 ? 'Rápido' : 'Muito Rápido';

  if (!uiState.isUIVisible) return null;

  return (
    <div className={`absolute top-2 left-2 md:left-4 md:right-auto md:top-4 bg-panel-bg text-nasa-white rounded-md border border-panel-border backdrop-blur-md shadow-lg ${uiState.isMissionControlOpen ? 'w-[calc(100%-1rem)] md:w-auto' : 'w-[calc(50%-0.75rem)] md:w-auto'} md:min-w-[180px] max-h-[50vh] md:max-h-[350px] overflow-hidden transition-all duration-300 z-[100] ${uiState.isMissionControlOpen ? '' : 'collapsed'}`}>
      <div className="px-2 py-2.5 md:px-2 md:py-2 bg-gradient-to-br from-nasa-red to-[#d32f2f] border-b border-panel-border cursor-pointer select-none transition-all duration-300" onClick={toggleMissionControl}>
        <div className="flex flex-col md:flex-row items-center md:justify-between gap-1 md:gap-0">
          <div className="text-xl md:text-base">🎛️</div>
          <h3 className="m-0 font-orbitron font-bold text-xs md:text-[11px] text-nasa-white uppercase tracking-wide text-center md:text-left">
            <span className="hidden md:inline">Controle de Missão</span>
            <span className="md:hidden">Missão</span>
          </h3>
          <span className="text-xs md:text-sm transition-transform duration-300">{uiState.isMissionControlOpen ? '▼' : '►'}</span>
        </div>
      </div>
      <div className={`max-h-[calc(50vh-80px)] md:max-h-[300px] overflow-y-auto transition-all duration-300 p-2 md:p-2 ${uiState.isMissionControlOpen ? '' : 'max-h-0 p-0 overflow-hidden'}`}>
        <div className="mb-2 md:mb-1.5">
          <label className="block mb-1 md:mb-0.5 text-xs md:text-[10px] text-nasa-gray font-medium uppercase tracking-wide font-titillium">Velocidade</label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={state.speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full h-1.5 md:h-0.5 bg-white/20 rounded-sm outline-none mb-0.5 md:mb-0.5"
          />
          <span className="font-orbitron text-xs md:text-[9px] text-space-star-gold font-medium">{state.speed.toFixed(1)}x {speedLabel}</span>
        </div>

        <div className="mb-2 md:mb-1.5">
          <label className="block mb-1 md:mb-0.5 text-xs md:text-[10px] text-nasa-gray font-medium uppercase tracking-wide font-titillium">Brilho</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={state.bloomStrength}
            onChange={(e) => setBloomStrength(parseFloat(e.target.value))}
            className="w-full h-1.5 md:h-0.5 bg-white/20 rounded-sm outline-none mb-0.5 md:mb-0.5"
          />
          <span className="font-orbitron text-xs md:text-[9px] text-space-star-gold font-medium">{state.bloomStrength.toFixed(1)}</span>
        </div>

        <div className="mb-2 md:mb-1.5">
          <div className="flex flex-wrap gap-1 md:gap-1">
            <button
              onClick={togglePause}
              className="bg-gradient-to-br from-nasa-dark-gray to-[#404040] text-nasa-white border border-white/20 px-2 py-1.5 md:px-1.5 md:py-0.5 rounded-sm cursor-pointer text-xs md:text-[9px] font-titillium font-medium uppercase tracking-wide transition-all duration-300 hover:bg-gradient-to-br hover:from-nasa-blue hover:to-[#0a2a66] hover:shadow-[0_0_10px_rgba(11,61,145,0.5)] hover:-translate-y-0.5 active:scale-95 flex-1 md:flex-none"
            >
              {state.isPaused ? '▶️' : '⏸️'}
            </button>
            <button
              onClick={() => setSpeed(0.4)}
              className="bg-gradient-to-br from-nasa-dark-gray to-[#404040] text-nasa-white border border-white/20 px-2 py-1.5 md:px-1.5 md:py-0.5 rounded-sm cursor-pointer text-xs md:text-[9px] font-titillium font-medium uppercase tracking-wide transition-all duration-300 hover:bg-gradient-to-br hover:from-nasa-blue hover:to-[#0a2a66] hover:shadow-[0_0_10px_rgba(11,61,145,0.5)] hover:-translate-y-0.5 active:scale-95 flex-1 md:flex-none"
            >
              🔄
            </button>
          </div>
        </div>

        <div className="mb-2 md:mb-1.5">
          <label className="block mb-1 md:mb-0.5 text-xs md:text-[10px] text-nasa-gray font-medium uppercase tracking-wide font-titillium">Alternar</label>
          <div className="flex flex-wrap gap-1 md:gap-1">
            <button
              onClick={toggleOrbits}
              className={`px-2 py-1 md:px-1.5 md:py-0.5 rounded-sm text-xs md:text-[9px] font-titillium font-medium uppercase tracking-wide transition-all duration-300 ${state.showOrbits ? 'bg-gradient-to-br from-nasa-red to-[#d32f2f] shadow-[0_0_10px_rgba(252,61,33,0.5)]' : 'bg-gradient-to-br from-nasa-dark-gray to-[#404040]'} text-nasa-white border border-white/20 hover:-translate-y-0.5 active:scale-95 flex-1 md:flex-none`}
            >
              Órbitas
            </button>
            <button
              onClick={toggleMoons}
              className={`px-2 py-1 md:px-1.5 md:py-0.5 rounded-sm text-xs md:text-[9px] font-titillium font-medium uppercase tracking-wide transition-all duration-400 ${state.showMoons ? 'bg-gradient-to-br from-nasa-red to-[#d32f2f] shadow-[0_0_10px_rgba(252,61,33,0.5)]' : 'bg-gradient-to-br from-nasa-dark-gray to-[#404040]'} text-nasa-white border border-white/20 hover:-translate-y-0.5 active:scale-95 flex-1 md:flex-none`}
            >
              Luas
            </button>
            <button
              onClick={toggleRealAsteroids}
              className={`px-2 py-1 md:px-1.5 md:py-0.5 rounded-sm text-xs md:text-[9px] font-titillium font-medium uppercase tracking-wide transition-all duration-400 ${state.showRealAsteroids ? 'bg-gradient-to-br from-nasa-red to-[#d32f2f] shadow-[0_0_10px_rgba(252,61,33,0.5)]' : 'bg-gradient-to-br from-nasa-dark-gray to-[#404040]'} text-nasa-white border border-white/20 hover:-translate-y-0.5 active:scale-95 flex-1 md:flex-none`}
            >
              Asteroides
            </button>
            <button
              onClick={toggleComets}
              className={`px-2 py-1 md:px-1.5 md:py-0.5 rounded-sm text-xs md:text-[9px] font-titillium font-medium uppercase tracking-wide transition-all duration-400 ${state.showComets ? 'bg-gradient-to-br from-nasa-red to-[#d32f2f] shadow-[0_0_10px_rgba(252,61,33,0.5)]' : 'bg-gradient-to-br from-nasa-dark-gray to-[#404040]'} text-nasa-white border border-white/20 hover:-translate-y-0.5 active:scale-95 flex-1 md:flex-none`}
            >
              Cometas
            </button>
          </div>
        </div>

        <div className="mb-2 md:mb-1.5">
          <label className="block mb-1 md:mb-0.5 text-xs md:text-[10px] text-nasa-gray font-medium uppercase tracking-wide font-titillium">Cinturões</label>
          <div className="flex flex-wrap gap-1 md:gap-1 mb-1 md:mb-1">
            <button
              onClick={toggleAllAsteroidBelts}
              className={`px-2 py-1 md:px-1.5 md:py-0.5 rounded-sm text-xs md:text-[9px] font-titillium font-medium uppercase tracking-wide transition-all duration-300 ${state.asteroidBeltVisibility.all ? 'bg-gradient-to-br from-nasa-red to-[#d32f2f] shadow-[0_0_10px_rgba(252,61,33,0.5)]' : 'bg-gradient-to-br from-nasa-dark-gray to-[#404040]'} text-nasa-white border border-white/20 hover:-translate-y-0.5 active:scale-95 flex-1 md:flex-none`}
            >
              Todos
            </button>
            <button
              onClick={() => toggleAsteroidBelt('main')}
              className={`px-2 py-1 md:px-1.5 md:py-0.5 rounded-sm text-xs md:text-[9px] font-titillium font-medium uppercase tracking-wide transition-all duration-300 ${state.asteroidBeltVisibility.main ? 'bg-gradient-to-br from-nasa-red to-[#d32f2f] shadow-[0_0_10px_rgba(252,61,33,0.5)]' : 'bg-gradient-to-br from-nasa-dark-gray to-[#404040]'} text-nasa-white border border-white/20 hover:-translate-y-0.5 active:scale-95 flex-1 md:flex-none`}
            >
              Principal
            </button>
            <button
              onClick={() => toggleAsteroidBelt('trojans')}
              className={`px-2 py-1 md:px-1.5 md:py-0.5 rounded-sm text-xs md:text-[9px] font-titillium font-medium uppercase tracking-wide transition-all duration-300 ${state.asteroidBeltVisibility.trojans ? 'bg-gradient-to-br from-nasa-red to-[#d32f2f] shadow-[0_0_10px_rgba(252,61,33,0.5)]' : 'bg-gradient-to-br from-nasa-dark-gray to-[#404040]'} text-nasa-white border border-white/20 hover:-translate-y-0.5 active:scale-95 flex-1 md:flex-none`}
            >
              Troianos
            </button>
            <button
              onClick={() => toggleAsteroidBelt('kuiper')}
              className={`px-2 py-1 md:px-1.5 md:py-0.5 rounded-sm text-xs md:text-[9px] font-titillium font-medium uppercase tracking-wide transition-all duration-300 ${state.asteroidBeltVisibility.kuiper ? 'bg-gradient-to-br from-nasa-red to-[#d32f2f] shadow-[0_0_10px_rgba(252,61,33,0.5)]' : 'bg-gradient-to-br from-nasa-dark-gray to-[#404040]'} text-nasa-white border border-white/20 hover:-translate-y-0.5 active:scale-95 flex-1 md:flex-none`}
            >
              Kuiper
            </button>
            <button
              onClick={() => toggleAsteroidBelt('scattered')}
              className={`px-2 py-1 md:px-1.5 md:py-0.5 rounded-sm text-xs md:text-[9px] font-titillium font-medium uppercase tracking-wide transition-all duration-300 ${state.asteroidBeltVisibility.scattered ? 'bg-gradient-to-br from-nasa-red to-[#d32f2f] shadow-[0_0_10px_rgba(252,61,33,0.5)]' : 'bg-gradient-to-br from-nasa-dark-gray to-[#404040]'} text-nasa-white border border-white/20 hover:-translate-y-0.5 active:scale-95 flex-1 md:flex-none`}
            >
              Espalhado
            </button>
          </div>
        </div>

        <div className="mb-2 md:mb-1.5">
          <label className="block mb-1 md:mb-0.5 text-xs md:text-[10px] text-nasa-gray font-medium uppercase tracking-wide font-titillium">Música</label>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMusic}
              className="bg-gradient-to-br from-nasa-dark-gray to-[#404040] text-nasa-white border border-white/20 px-2 py-1.5 md:px-1.5 md:py-0.5 rounded-sm cursor-pointer text-xs md:text-[9px] font-titillium font-medium uppercase tracking-wide transition-all duration-300 hover:bg-gradient-to-br hover:from-nasa-blue hover:to-[#0a2a66] hover:shadow-[0_0_10px_rgba(11,61,145,0.5)] hover:-translate-y-0.5 active:scale-95"
            >
              {isPlaying ? '🔇' : '🎵'}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-1.5 md:h-auto"
            />
            <span className="font-orbitron text-xs md:text-[9px] text-space-star-gold font-medium w-10 text-right">{Math.round(volume * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

