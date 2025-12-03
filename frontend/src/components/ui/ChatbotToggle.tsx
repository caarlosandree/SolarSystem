import { useUI } from '@/contexts/UIContext';

export default function ChatbotToggle() {
  const { state: uiState, toggleChatbot } = useUI();

  if (!uiState.isUIVisible) return null;

  // Ajusta posição quando InfoPanel está aberto no mobile
  const getBottomPosition = () => {
    if (uiState.isInfoPanelOpen) {
      return 'bottom-[calc(35vh+0.5rem)] md:bottom-32';
    }
    return 'bottom-32';
  };

  return (
    <button
      onClick={toggleChatbot}
      className={`fixed ${getBottomPosition()} right-2 md:right-5 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-nasa-blue to-space-cosmic-blue border-2 border-space-star-gold text-space-star-gold text-2xl md:text-2xl cursor-pointer shadow-[0_4px_15px_rgba(11,61,145,0.4)] z-[1000] transition-all duration-300 flex items-center justify-center hover:bg-gradient-to-br hover:from-space-cosmic-blue hover:to-nasa-blue hover:scale-110 hover:shadow-[0_6px_20px_rgba(255,214,10,0.4)] active:scale-95`}
      title="Abrir Chatbot de IA Espacial"
    >
      💬
    </button>
  );
}

