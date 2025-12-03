import { useUI } from '@/contexts/UIContext';
import { useSolarSystem } from '@/contexts/SolarSystemContext';
import type { Moon } from '@/types/planet';

export default function PlanetInfoCard() {
  const { state: uiState, closePlanetInfo } = useUI();
  const { state, followBody } = useSolarSystem();

  if (!uiState.isPlanetInfoOpen || !state.selectedBody) return null;

  const selectedBody = state.selectedBody;

  // Calculate orbital period in years (simplified calculation using Kepler's third law)
  const orbitalPeriodYears = Math.sqrt(Math.pow(selectedBody.dist, 3));
  const orbitalPeriodText = orbitalPeriodYears < 1
    ? `${Math.round(orbitalPeriodYears * 365)} days`
    : orbitalPeriodYears < 10
    ? `${orbitalPeriodYears.toFixed(1)} years`
    : `${Math.round(orbitalPeriodYears)} years`;

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-panel-bg to-[rgba(11,61,145,0.95)] text-nasa-white rounded-xl md:rounded-xl border-2 border-panel-border backdrop-blur-[15px] shadow-[0_8px_32px_rgba(11,61,145,0.4)] w-[95vw] max-w-[500px] md:min-w-[400px] max-h-[90vh] md:max-h-[80vh] z-[2000] font-titillium overflow-hidden animate-slideIn">
      <div className="bg-gradient-to-br from-nasa-red to-[#d32f2f] px-4 py-3 md:px-5 md:py-4 rounded-t-xl border-b-2 border-panel-border sticky top-0 z-[2001]">
        <h2 className="m-0 font-orbitron font-bold text-xl md:text-2xl text-nasa-white uppercase tracking-wide flex items-center gap-2 md:gap-3 flex-wrap">
          <span>🪐</span>
          <span>{selectedBody.name}</span>
          <span className="bg-[rgba(255,214,10,0.9)] text-nasa-black px-2 py-1 rounded-full font-titillium text-xs md:text-[10px] font-semibold uppercase tracking-wide">
            {selectedBody.type.toUpperCase()}
          </span>
        </h2>
        <button
          onClick={closePlanetInfo}
          className="absolute top-3 right-3 md:top-4 md:right-5 bg-none border-none text-nasa-white text-3xl md:text-2xl cursor-pointer w-10 h-10 md:w-8 md:h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-white/20 hover:scale-110 active:scale-95"
        >
          ×
        </button>
      </div>
      <div className="p-4 md:p-5 max-h-[calc(90vh-80px)] md:max-h-[calc(80vh-80px)] overflow-y-auto">
        <div className="mb-4 md:mb-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
            <div className="bg-black/30 p-3 md:p-3 rounded-lg border border-space-star-gold/20">
              <div className="font-orbitron text-sm md:text-[11px] font-semibold text-space-star-gold uppercase tracking-wide mb-1">Período Orbital</div>
              <div className="font-titillium text-base md:text-sm font-medium text-nasa-white">{orbitalPeriodText}</div>
            </div>
            <div className="bg-black/30 p-3 md:p-3 rounded-lg border border-space-star-gold/20">
              <div className="font-orbitron text-sm md:text-[11px] font-semibold text-space-star-gold uppercase tracking-wide mb-1">Tamanho Relativo</div>
              <div className="font-titillium text-base md:text-sm font-medium text-nasa-white">{selectedBody.size}x Terra</div>
            </div>
            <div className="bg-black/30 p-3 md:p-3 rounded-lg border border-space-star-gold/20">
              <div className="font-orbitron text-sm md:text-[11px] font-semibold text-space-star-gold uppercase tracking-wide mb-1">Distância do Sol</div>
              <div className="font-titillium text-base md:text-sm font-medium text-nasa-white">{selectedBody.dist} UA</div>
            </div>
          </div>
        </div>

        <div className="mb-4 md:mb-5">
          <div className="bg-black/40 p-4 md:p-4 rounded-lg border-l-4 border-space-star-gold font-titillium text-base md:text-sm leading-relaxed text-nasa-gray mb-3 md:mb-4">
            {selectedBody.info}
          </div>
        </div>

        {selectedBody.moons.length > 0 && (
          <div className="mb-4 md:mb-5">
            <h4 className="m-0 mb-3 md:mb-2.5 font-orbitron font-semibold text-base md:text-sm text-space-star-gold uppercase tracking-wide border-b border-panel-border pb-2 md:pb-1">🌙 Luas ({selectedBody.moons.length})</h4>
            <div className="bg-[rgba(0,29,61,0.6)] p-3 md:p-4 rounded-lg border border-panel-border">
              {selectedBody.moons.map((moon: Moon) => {
                const orbitalPeriodDays = moon.speed > 0
                  ? (2 * Math.PI / moon.speed).toFixed(1)
                  : 'Desconhecido';
                
                return (
                  <div key={moon.name} className="flex flex-col md:flex-row justify-between items-start md:items-center py-3 md:py-2 border-b border-white/10 last:border-b-0 gap-2 md:gap-0">
                    <div className="flex-1">
                      <div className="font-semibold text-nasa-white text-base md:text-[13px] mb-1">🌙 {moon.name}</div>
                      <div className="text-sm md:text-[11px] text-nasa-gray text-left mb-1">
                        Tamanho: {moon.size}x Terra | Distância: {moon.dist} raios planetários | Período: {orbitalPeriodDays} dias
                      </div>
                      <div className="text-sm md:text-[11px] text-nasa-gray text-left">{moon.info}</div>
                    </div>
                    <button
                      onClick={() => {
                        // Follow moon functionality would need to be implemented
                        // For now, just log
                        console.log(`Seguir lua ${moon.name} de ${selectedBody.name}`);
                      }}
                      className="ml-0 md:ml-2 px-4 py-2 md:px-3 md:py-1 bg-gradient-to-br from-space-star-gold to-[#ffa000] text-nasa-black border border-space-star-gold rounded text-sm md:text-[10px] font-orbitron font-semibold uppercase tracking-wide transition-all duration-300 hover:bg-gradient-to-br hover:from-[#ffa000] hover:to-space-star-gold hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(255,214,10,0.4)] active:scale-95 w-full md:w-auto"
                    >
                      🎯 Seguir
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-4 md:mb-5">
          <button
            onClick={() => {
              if (state.followingBody === selectedBody) {
                followBody(null);
              } else {
                followBody(selectedBody);
              }
            }}
            className={`w-full border-2 px-5 py-3 md:py-2.5 rounded-md cursor-pointer font-orbitron font-semibold text-sm md:text-xs uppercase tracking-wide transition-all duration-300 ${
              state.followingBody === selectedBody
                ? 'bg-gradient-to-br from-nasa-red to-[#d32f2f] text-nasa-white border-nasa-red hover:bg-gradient-to-br hover:from-[#d32f2f] hover:to-nasa-red hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(252,61,33,0.5)]'
                : 'bg-gradient-to-br from-space-star-gold to-[#ffa000] text-nasa-black border-space-star-gold hover:bg-gradient-to-br hover:from-[#ffa000] hover:to-space-star-gold hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(255,214,10,0.5)]'
            } active:scale-95`}
          >
            {state.followingBody === selectedBody ? '🛑 PARAR DE SEGUIR' : '🎯 SEGUIR PLANETA'}
          </button>
        </div>
      </div>
    </div>
  );
}

