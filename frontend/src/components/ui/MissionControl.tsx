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
    <div className={`absolute top-4 left-4 bg-panel-bg text-nasa-white rounded-md border border-panel-border backdrop-blur-md shadow-lg min-w-[180px] max-h-[350px] overflow-hidden transition-all duration-300 ${uiState.isMissionControlOpen ? '' : 'collapsed'}`}>
      <div className="px-2 py-2 bg-gradient-to-br from-nasa-red to-[#d32f2f] border-b border-panel-border cursor-pointer select-none transition-all duration-300" onClick={toggleMissionControl}>
        <h3 className="m-0 font-orbitron font-bold text-[11px] text-nasa-white uppercase tracking-wide flex justify-between items-center">
          Controle de Missão <span className="text-sm transition-transform duration-300">{uiState.isMissionControlOpen ? '▼' : '►'}</span>
        </h3>
      </div>
      <div className={`max-h-[300px] overflow-y-auto transition-all duration-300 p-2 ${uiState.isMissionControlOpen ? '' : 'max-h-0 p-0'}`}>
        <div className="mb-1.5">
          <label className="block mb-0.5 text-[10px] text-nasa-gray font-medium uppercase tracking-wide font-titillium">Velocidade (Tempo Terrestre)</label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={state.speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full h-0.5 bg-white/20 rounded-sm outline-none mb-0.5"
          />
          <span className="font-orbitron text-[9px] text-space-star-gold font-medium">{state.speed.toFixed(1)}x {speedLabel}</span>
        </div>

        <div className="mb-1.5">
          <label className="block mb-0.5 text-[10px] text-nasa-gray font-medium uppercase tracking-wide font-titillium">Brilho</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={state.bloomStrength}
            onChange={(e) => setBloomStrength(parseFloat(e.target.value))}
            className="w-full h-0.5 bg-white/20 rounded-sm outline-none mb-0.5"
          />
          <span className="font-orbitron text-[9px] text-space-star-gold font-medium">{state.bloomStrength.toFixed(1)}</span>
        </div>

        <div className="mb-1.5">
          <button
            onClick={togglePause}
            className="bg-gradient-to-br from-nasa-dark-gray to-[#404040] text-nasa-white border border-white/20 px-1.5 py-0.5 rounded-sm cursor-pointer mr-1 mb-0.5 text-[9px] font-titillium font-medium uppercase tracking-wide transition-all duration-300 hover:bg-gradient-to-br hover:from-nasa-blue hover:to-[#0a2a66] hover:shadow-[0_0_10px_rgba(11,61,145,0.5)] hover:-translate-y-0.5"
          >
            {state.isPaused ? 'Retomar' : 'Pausar'}
          </button>
          <button
            onClick={() => setSpeed(0.4)}
            className="bg-gradient-to-br from-nasa-dark-gray to-[#404040] text-nasa-white border border-white/20 px-1.5 py-0.5 rounded-sm cursor-pointer mr-1 mb-0.5 text-[9px] font-titillium font-medium uppercase tracking-wide transition-all duration-300 hover:bg-gradient-to-br hover:from-nasa-blue hover:to-[#0a2a66] hover:shadow-[0_0_10px_rgba(11,61,145,0.5)] hover:-translate-y-0.5"
          >
            Resetar
          </button>
        </div>

        <div className="mb-1.5">
          <label className="block mb-0.5 text-[10px] text-nasa-gray font-medium uppercase tracking-wide font-titillium">Alternar</label>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={toggleOrbits}
              className={`px-1.5 py-0.5 rounded-sm text-[9px] font-titillium font-medium uppercase tracking-wide transition-all duration-300 ${state.showOrbits ? 'bg-gradient-to-br from-nasa-red to-[#d32f2f] shadow-[0_0_10px_rgba(252,61,33,0.5)]' : 'bg-gradient-to-br from-nasa-dark-gray to-[#404040]'} text-nasa-white border border-white/20 hover:-translate-y-0.5`}
            >
              Órbitas
            </button>
            <button
              onClick={toggleMoons}
              className={`px-1.5 py-0.5 rounded-sm text-[9px] font-titillium font-medium uppercase tracking-wide transition-all duration-400 ${state.showMoons ? 'bg-gradient-to-br from-nasa-red to-[#d32f2f] shadow-[0_0_10px_rgba(252,61,33,0.5)]' : 'bg-gradient-to-br from-nasa-dark-gray to-[#404040]'} text-nasa-white border border-white/20 hover:-translate-y-0.5`}
            >
              Luas
            </button>
            <button
              onClick={toggleRealAsteroids}
              className={`px-1.5 py-0.5 rounded-sm text-[9px] font-titillium font-medium uppercase tracking-wide transition-all duration-400 ${state.showRealAsteroids ? 'bg-gradient-to-br from-nasa-red to-[#d32f2f] shadow-[0_0_10px_rgba(252,61,33,0.5)]' : 'bg-gradient-to-br from-nasa-dark-gray to-[#404040]'} text-nasa-white border border-white/20 hover:-translate-y-0.5`}
            >
              Asteroides Reais
            </button>
            <button
              onClick={toggleComets}
              className={`px-1.5 py-0.5 rounded-sm text-[9px] font-titillium font-medium uppercase tracking-wide transition-all duration-400 ${state.showComets ? 'bg-gradient-to-br from-nasa-red to-[#d32f2f] shadow-[0_0_10px_rgba(252,61,33,0.5)]' : 'bg-gradient-to-br from-nasa-dark-gray to-[#404040]'} text-nasa-white border border-white/20 hover:-translate-y-0.5`}
            >
              Cometas
            </button>
          </div>
        </div>

        <div className="mb-1.5">
          <label className="block mb-0.5 text-[10px] text-nasa-gray font-medium uppercase tracking-wide font-titillium">Cinturões de Asteroides</label>
          <div className="flex flex-wrap gap-1 mb-1">
            <button
              onClick={toggleAllAsteroidBelts}
              className={`px-1.5 py-0.5 rounded-sm text-[9px] font-titillium font-medium uppercase tracking-wide transition-all duration-300 ${state.asteroidBeltVisibility.all ? 'bg-gradient-to-br from-nasa-red to-[#d32f2f] shadow-[0_0_10px_rgba(252,61,33,0.5)]' : 'bg-gradient-to-br from-nasa-dark-gray to-[#404040]'} text-nasa-white border border-white/20 hover:-translate-y-0.5`}
            >
              Todos
            </button>
            <button
              onClick={() => toggleAsteroidBelt('main')}
              className={`px-1.5 py-0.5 rounded-sm text-[9px] font-titillium font-medium uppercase tracking-wide transition-all duration-300 ${state.asteroidBeltVisibility.main ? 'bg-gradient-to-br from-nasa-red to-[#d32f2f] shadow-[0_0_10px_rgba(252,61,33,0.5)]' : 'bg-gradient-to-br from-nasa-dark-gray to-[#404040]'} text-nasa-white border border-white/20 hover:-translate-y-0.5`}
            >
              Principal
            </button>
            <button
              onClick={() => toggleAsteroidBelt('trojans')}
              className={`px-1.5 py-0.5 rounded-sm text-[9px] font-titillium font-medium uppercase tracking-wide transition-all duration-300 ${state.asteroidBeltVisibility.trojans ? 'bg-gradient-to-br from-nasa-red to-[#d32f2f] shadow-[0_0_10px_rgba(252,61,33,0.5)]' : 'bg-gradient-to-br from-nasa-dark-gray to-[#404040]'} text-nasa-white border border-white/20 hover:-translate-y-0.5`}
            >
              Troianos
            </button>
            <button
              onClick={() => toggleAsteroidBelt('kuiper')}
              className={`px-1.5 py-0.5 rounded-sm text-[9px] font-titillium font-medium uppercase tracking-wide transition-all duration-300 ${state.asteroidBeltVisibility.kuiper ? 'bg-gradient-to-br from-nasa-red to-[#d32f2f] shadow-[0_0_10px_rgba(252,61,33,0.5)]' : 'bg-gradient-to-br from-nasa-dark-gray to-[#404040]'} text-nasa-white border border-white/20 hover:-translate-y-0.5`}
            >
              Kuiper
            </button>
            <button
              onClick={() => toggleAsteroidBelt('scattered')}
              className={`px-1.5 py-0.5 rounded-sm text-[9px] font-titillium font-medium uppercase tracking-wide transition-all duration-300 ${state.asteroidBeltVisibility.scattered ? 'bg-gradient-to-br from-nasa-red to-[#d32f2f] shadow-[0_0_10px_rgba(252,61,33,0.5)]' : 'bg-gradient-to-br from-nasa-dark-gray to-[#404040]'} text-nasa-white border border-white/20 hover:-translate-y-0.5`}
            >
              Espalhado
            </button>
          </div>
        </div>

        <div className="mb-1.5">
          <label className="block mb-0.5 text-[10px] text-nasa-gray font-medium uppercase tracking-wide font-titillium">Atmosfera</label>
          <button
            onClick={toggleMusic}
            className="bg-gradient-to-br from-nasa-dark-gray to-[#404040] text-nasa-white border border-white/20 px-1.5 py-0.5 rounded-sm cursor-pointer mr-1 mb-0.5 text-[9px] font-titillium font-medium uppercase tracking-wide transition-all duration-300 hover:bg-gradient-to-br hover:from-nasa-blue hover:to-[#0a2a66] hover:shadow-[0_0_10px_rgba(11,61,145,0.5)] hover:-translate-y-0.5"
          >
            {isPlaying ? '🔇 Silenciar' : '🎵 Música'}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-4/5 mt-1"
          />
          <span className="font-orbitron text-[9px] text-space-star-gold font-medium">{Math.round(volume * 100)}%</span>
        </div>
      </div>
    </div>
  );
}

