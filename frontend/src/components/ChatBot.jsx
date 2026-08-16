import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm Pro, your Game Complex assistant. I can help you search for games or navigate the site!", isBot: true }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateResponse = async (text) => {
    const lower = text.toLowerCase();
    
    if (lower.startsWith('search') || lower.startsWith('find') || lower.startsWith('look for')) {
      const query = text.replace(/search|find|look for/i, '').trim();
      if (query) {
        navigate(`/?search=${encodeURIComponent(query)}`);
        try {
          const res = await axios.get(`http://localhost:8000/api/products/?search=${encodeURIComponent(query)}`);
          const games = res.data;
          if (games.length > 0) {
            const gameList = games.slice(0, 5).map(g => `🎮 ${g.title} - $${g.price}`).join('\n');
            return `I found ${games.length} results for "${query}":\n\n${gameList}\n\nI've also navigated the store to show all results!`;
          } else {
            return `I searched everywhere but couldn't find any games matching "${query}".`;
          }
        } catch (e) {
          return `Searching the store for "${query}"!`;
        }
      }
    }
    
    // simulate network delay for other responses
    await new Promise(resolve => setTimeout(resolve, 800));

    if (lower.includes('go to profile') || lower.includes('open profile') || lower.includes('my account')) {
      navigate('/profile');
      return "Navigating to your profile page!";
    }
    
    if (lower.includes('go to login') || lower.includes('sign in')) {
      navigate('/login');
      return "Navigating to the login page!";
    }

    if (lower.includes('home') || lower.includes('store') || lower.includes('clear')) {
      navigate('/');
      return "Taking you back to the storefront!";
    }

    if (lower.includes('buy') || lower.includes('purchase') || lower.includes('cart')) {
      return "To buy a game, click on its cover to view details, then smash that animated 'Add to Cart' button!";
    }
    if (lower.includes('refund')) {
      return "We offer full refunds within 14 days of purchase if you have played less than 2 hours. Please open a support ticket on your profile page.";
    }
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return "Hello! Try asking me to 'search for action' or 'go to profile'.";
    }
    return "I am Pro, and I can control this site for you! Try saying 'search action' or 'go to login'.";
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newUserMsg = { id: Date.now(), text: inputText, isBot: false };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsTyping(true);

    const response = await generateResponse(newUserMsg.text);
    setMessages(prev => [...prev, { id: Date.now() + 1, text: response, isBot: true }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px] max-h-[80vh]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 px-2 py-2 rounded-lg backdrop-blur-sm shadow-inner border border-white/30 flex items-center justify-center">
                  <Gamepad2 size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white leading-tight">Pro</h3>
                  <span className="text-xs text-blue-100 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Online
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/50">
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, x: msg.isBot ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={msg.id} 
                  className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`whitespace-pre-wrap max-w-[80%] rounded-2xl p-3 text-sm shadow-md ${msg.isBot ? 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-sm' : 'bg-blue-600 text-white rounded-tr-sm'}`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-sm p-4 flex gap-1 items-center h-10">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-gray-500 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-gray-500 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-gray-500 rounded-full" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Pro anything..."
                className="flex-1 bg-gray-900 border border-gray-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button 
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-full transition-colors flex items-center justify-center w-10 h-10"
              >
                <Send size={16} className="ml-1" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-full p-4 shadow-2xl transition-transform hover:scale-110 focus:outline-none"
      >
        {isOpen ? <X size={28} /> : <Gamepad2 size={28} />}
      </button>
    </div>
  );
};

export default ChatBot;
