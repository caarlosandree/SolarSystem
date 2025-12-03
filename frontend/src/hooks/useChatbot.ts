import { useState, useCallback } from 'react';
import { fetchGeminiResponse } from '@/services/geminiApi';
import { getFallbackResponse } from '@/services/geminiApi';

export interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      text: "Olá! Sou a IA Espacial, sua assistente inteligente para explorar o cosmos. Pergunte-me qualquer coisa sobre o nosso sistema solar! 🌌",
      sender: 'bot',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading) {
      return;
    }

    const userMessage: ChatMessage = { text: message, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetchGeminiResponse(message);
      const botMessage: ChatMessage = {
        text: response.text || getFallbackResponse(message),
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        text: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}. ${getFallbackResponse(message)}`,
        sender: 'bot',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return {
    messages,
    isLoading,
    sendMessage,
  };
}

