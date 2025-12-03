import { useState } from 'react';
import { useUI } from '@/contexts/UIContext';
import { useChatbot } from '@/hooks/useChatbot';

export default function Chatbot() {
  const { state: uiState, toggleChatbot } = useUI();
  const { messages, isLoading, sendMessage } = useChatbot();
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput('');
    }
  };

  if (!uiState.isChatbotOpen) return null;

  return (
    <div className="fixed bottom-20 right-5 w-[350px] max-h-[500px] bg-gradient-to-br from-panel-bg to-[rgba(11,61,145,0.95)] border border-panel-border rounded-xl shadow-[0_8px_32px_rgba(11,61,145,0.4)] backdrop-blur-[15px] flex flex-col z-[1000] transition-all duration-300">
      <div className="bg-gradient-to-br from-nasa-red to-[#d32f2f] px-4 py-4 rounded-t-xl border-b-2 border-panel-border flex justify-between items-center">
        <h3 className="m-0 font-orbitron font-bold text-base text-nasa-white uppercase tracking-wide">🪐 IA Espacial</h3>
        <button
          onClick={toggleChatbot}
          className="bg-none border-none text-nasa-white text-xl cursor-pointer w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-white/20 hover:scale-110"
        >
          ×
        </button>
      </div>
      <div className="flex-1 px-4 py-4 overflow-y-auto max-h-[350px] flex flex-col gap-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`px-3.5 py-2.5 rounded-2xl font-titillium text-sm leading-snug max-w-[80%] ${
              msg.sender === 'bot'
                ? 'bg-[rgba(0,29,61,0.8)] text-nasa-white border border-space-star-gold/30 self-start rounded-bl-sm'
                : 'bg-gradient-to-br from-nasa-blue to-space-cosmic-blue text-nasa-white self-end rounded-br-sm'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="px-3.5 py-2.5 rounded-2xl bg-[rgba(0,29,61,0.8)] text-nasa-white border border-space-star-gold/30 self-start rounded-bl-sm font-titillium text-sm">
            Contatando Gemini...
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex px-4 py-4 gap-2.5 border-t border-white/10">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte sobre planetas, luas ou espaço..."
          className="flex-1 bg-black/30 border border-white/20 rounded-full px-4 py-2.5 text-nasa-white font-titillium text-sm outline-none focus:border-space-star-gold focus:shadow-[0_0_0_2px_rgba(255,214,10,0.3)] placeholder:text-white/50"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-br from-space-star-gold to-[#ffa000] text-nasa-black border-none rounded-full w-10 h-10 text-base cursor-pointer flex items-center justify-center transition-all duration-300 hover:bg-gradient-to-br hover:from-[#ffa000] hover:to-space-star-gold hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ➤
        </button>
      </form>
    </div>
  );
}

