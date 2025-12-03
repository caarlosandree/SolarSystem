import { useUI } from '@/contexts/UIContext';
import { useSolarSystem } from '@/contexts/SolarSystemContext';

export default function InfoPanel() {
  const { state: uiState } = useUI();
  const { followBody } = useSolarSystem();

  if (!uiState.isUIVisible) return null;

  return (
    <div className="absolute bottom-4 left-4 bg-[rgba(0,29,61,0.85)] text-nasa-white px-2.5 py-2.5 rounded-md border border-panel-border backdrop-blur-md text-[10px] font-titillium max-w-[200px]">
      <strong className="font-orbitron text-space-star-gold">EXPLORADOR SOLAR NASA</strong>
      <br />
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
        className="w-full mt-4 px-3 py-1.5 bg-gradient-to-br from-space-asteroid-orange to-[#ff6b35] text-nasa-white border border-space-asteroid-orange rounded cursor-pointer font-orbitron font-semibold text-[10px] uppercase tracking-wide transition-all duration-300 hover:bg-gradient-to-br hover:from-[#ff6b35] hover:to-space-asteroid-orange hover:-translate-y-0.5 hover:shadow-[0_3px_10px_rgba(247,127,0,0.4)]"
      >
        ☀️ Seguir Sol
      </button>
    </div>
  );
}

