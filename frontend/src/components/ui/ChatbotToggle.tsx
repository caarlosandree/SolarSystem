import { useUI } from '@/contexts/UIContext';

export default function ChatbotToggle() {
  const { state: uiState, toggleChatbot } = useUI();

  if (!uiState.isUIVisible) return null;

  return (
    <button
      onClick={toggleChatbot}
      className="fixed bottom-20 right-5 w-15 h-15 rounded-full bg-gradient-to-br from-nasa-blue to-space-cosmic-blue border-2 border-space-star-gold text-space-star-gold text-2xl cursor-pointer shadow-[0_4px_15px_rgba(11,61,145,0.4)] z-[999] transition-all duration-300 flex items-center justify-center hover:bg-gradient-to-br hover:from-space-cosmic-blue hover:to-nasa-blue hover:scale-110 hover:shadow-[0_6px_20px_rgba(255,214,10,0.4)]"
      title="Abrir Chatbot de IA Espacial"
    >
      💬
    </button>
  );
}

