import { useUI } from '@/contexts/UIContext';
import { useMusic } from '@/hooks/useMusic';

export default function MusicControls() {
  const { state: uiState } = useUI();
  const { isPlaying, toggle } = useMusic();

  if (!uiState.isUIVisible) return null;

  return (
    <div className="fixed bottom-20 right-5 z-[999] flex gap-2">
      <button
        onClick={toggle}
        className="w-12 h-12 rounded-full border-2 border-space-star-gold bg-panel-bg text-space-star-gold text-lg cursor-pointer transition-all duration-300 backdrop-blur-md shadow-[0_4px_15px_rgba(11,61,145,0.4)] flex items-center justify-center font-titillium hover:bg-gradient-to-br hover:from-[rgba(255,214,10,0.9)] hover:to-[rgba(255,193,7,0.9)] hover:text-space-deep-space hover:scale-110 hover:shadow-[0_6px_20px_rgba(255,214,10,0.4)] active:scale-95"
        title={isPlaying ? 'Silenciar Música' : 'Reproduzir Trilha Sonora Interstellar'}
      >
        {isPlaying ? '🔇' : '🎵'}
      </button>
    </div>
  );
}

