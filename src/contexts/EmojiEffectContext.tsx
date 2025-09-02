import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmojiEffect {
  id: string;
  emoji: string;
  x: number;
  y: number;
}

interface EmojiEffectContextType {
  triggerEmoji: (emoji: string, x?: number, y?: number) => void;
}

const EmojiEffectContext = createContext<EmojiEffectContextType | undefined>(undefined);

export function EmojiEffectProvider({ children }: { children: React.ReactNode }) {
  const [effects, setEffects] = useState<EmojiEffect[]>([]);

  const triggerEmoji = useCallback((emoji: string, x?: number, y?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    const effect: EmojiEffect = {
      id,
      emoji,
      x: x ?? Math.random() * window.innerWidth,
      y: y ?? Math.random() * window.innerHeight,
    };

    setEffects(prev => [...prev, effect]);

    setTimeout(() => {
      setEffects(prev => prev.filter(e => e.id !== id));
    }, 2000);
  }, []);

  return (
    <EmojiEffectContext.Provider value={{ triggerEmoji }}>
      {children}
      <div className="fixed inset-0 pointer-events-none z-50">
        <AnimatePresence>
          {effects.map(effect => (
            <motion.div
              key={effect.id}
              initial={{ 
                x: effect.x, 
                y: effect.y, 
                scale: 0.5, 
                opacity: 1 
              }}
              animate={{ 
                y: effect.y - 100, 
                scale: 1.5, 
                opacity: 0 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute text-4xl"
              style={{ left: effect.x, top: effect.y }}
            >
              {effect.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </EmojiEffectContext.Provider>
  );
}

export function useEmojiEffect() {
  const context = useContext(EmojiEffectContext);
  if (!context) {
    throw new Error('useEmojiEffect must be used within EmojiEffectProvider');
  }
  return context;
}