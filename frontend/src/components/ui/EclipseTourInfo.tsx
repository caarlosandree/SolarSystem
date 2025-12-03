import { useUI } from '@/contexts/UIContext';

export default function EclipseTourInfo() {
  const { state: uiState } = useUI();

  if (!uiState.isEclipseTourActive) return null;

  return (
    <div className="fixed bottom-2 md:bottom-5 left-1/2 -translate-x-1/2 bg-gradient-to-br from-[rgba(0,0,0,0.75)] to-[rgba(10,10,30,0.6)] border border-space-star-gold/12 rounded-lg px-3 py-3 md:py-2.5 text-left z-[2000] w-[95vw] md:w-[min(700px,85%)] max-w-[700px] backdrop-blur-sm shadow-[0_6px_30px_rgba(0,0,0,0.6)]">
      <div className="flex flex-col md:flex-row gap-3 md:gap-4.5 items-start">
        <div className="flex-[0_0_auto] md:flex-[0_0_72px] text-4xl leading-none">🌒</div>
        <div className="flex-1">
          <h3 className="m-0 mb-2 md:mb-1.5 font-orbitron text-space-star-gold text-lg md:text-base text-shadow-[0_0_10px_rgba(255,214,10,0.5)]">
            Eclipse Solar: Tour Cinematográfico
          </h3>
          <div className="font-orbitron text-nasa-white text-base md:text-sm font-semibold mb-2 md:mb-1.5">
            {uiState.eclipsePhase}
          </div>
          <div className="font-titillium text-nasa-gray text-sm md:text-xs mb-3 md:mb-2.5 leading-snug">
            {uiState.eclipsePhaseDesc}
          </div>
        </div>
        <div className="flex-[0_0_auto] md:flex-[0_0_220px] flex flex-col gap-2 items-stretch md:items-end w-full md:w-auto">
          <div className="w-full md:w-[200px] h-3 md:h-2 bg-white/20 rounded overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-space-star-gold to-nasa-red rounded transition-all duration-300 shadow-[0_0_10px_rgba(255,214,10,0.5)]"
              style={{ width: `${uiState.eclipseTourProgress}%` }}
            />
          </div>
          <div className="text-sm md:text-[11px] text-white/75">
            Relaxe — o tour completo pode levar um ou dois minutos. Seja paciente; foi projetado para ensinar e ser bonito.
          </div>
        </div>
      </div>
    </div>
  );
}

