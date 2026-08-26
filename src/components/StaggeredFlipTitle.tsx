import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeMode } from '../types';

interface StaggeredFlipTitleProps {
  text?: string;
  themeMode: ThemeMode;
  className?: string;
}

export const StaggeredFlipTitle: React.FC<StaggeredFlipTitleProps> = ({
  text = 'HỆ THỐNG QUẢN LÝ TIẾP CÔNG DÂN VÀ GIẢI QUYẾT ĐƠN THƯ KHIẾU NẠI TỐ CÁO',
  themeMode,
  className = '',
}) => {
  const [replayKey, setReplayKey] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Split text into words to maintain proper word wrapping
  const words = text.split(' ');

  // Calculate cumulative character index for smooth staggered delay across the entire sentence
  let globalCharIndex = 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.022,
        delayChildren: 0.05,
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      rotateX: -90,
      y: -12,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      rotateX: 0,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 14,
        stiffness: 140,
        mass: 0.8,
      },
    },
  };

  const handleReplay = () => {
    setReplayKey((prev) => prev + 1);
  };

  return (
    <div
      className={`inline-block cursor-pointer select-none ${className}`}
      onClick={handleReplay}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Nhấn để phát lại hiệu ứng lật ký tự (Staggered Flip)"
      style={{ perspective: 1200 }}
    >
      <AnimatePresence mode="wait">
        <motion.h1
          key={replayKey}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`text-sm sm:text-base md:text-lg lg:text-xl font-black uppercase tracking-wider text-center leading-snug flex flex-wrap justify-center items-center gap-x-2 gap-y-1 transition-colors duration-200 ${
            themeMode === 'standard_office'
              ? 'text-slate-950 drop-shadow-none'
              : themeMode === 'command_center'
              ? 'text-cyan-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]'
              : 'text-amber-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]'
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {words.map((word, wordIdx) => {
            const letters = Array.from(word);
            return (
              <span
                key={`word-${wordIdx}`}
                className="inline-flex whitespace-nowrap"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {letters.map((char, charIdx) => {
                  const currentIdx = globalCharIndex++;
                  return (
                    <motion.span
                      key={`char-${wordIdx}-${charIdx}-${currentIdx}`}
                      variants={letterVariants}
                      whileHover={{
                        scale: 1.18,
                        rotateX: 360,
                        transition: { duration: 0.45, ease: 'easeInOut' },
                      }}
                      className={`inline-block origin-bottom font-black transition-colors duration-150 ${
                        themeMode === 'ceremonial'
                          ? isHovered
                            ? 'text-amber-300 drop-shadow-[0_2px_10px_rgba(251,191,36,0.7)]'
                            : 'text-amber-100 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]'
                          : themeMode === 'command_center'
                          ? isHovered
                            ? 'text-cyan-300 drop-shadow-[0_2px_10px_rgba(34,211,238,0.75)]'
                            : 'text-cyan-50 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]'
                          : isHovered
                          ? 'text-red-700 font-black'
                          : 'text-slate-950 font-black'
                      }`}
                      style={{
                        transformStyle: 'preserve-3d',
                        backfaceVisibility: 'hidden',
                      }}
                    >
                      {char}
                    </motion.span>
                  );
                })}
              </span>
            );
          })}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
};
