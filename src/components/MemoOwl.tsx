import React from 'react';
import { motion } from 'motion/react';

export type MemoMood = 'welcoming' | 'thinking' | 'celebrating' | 'sleepy';

interface MemoOwlProps {
  mood?: MemoMood;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Memo, the Finances Guru:
 * A skinny animated owl with tired, heavy-lidded eyes who explains complex accounting
 * and financial concepts in calm, literal "apples to apples" terms.
 */
export const MemoOwl: React.FC<MemoOwlProps> = ({
  mood = 'welcoming',
  size = 'md',
  className = '',
}) => {
  const dimensions = {
    sm: 'w-12 h-14',
    md: 'w-20 h-24',
    lg: 'w-28 h-32',
  }[size];

  const eyelidOffset = mood === 'celebrating' ? -3 : mood === 'sleepy' ? 3 : 0;

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center select-none shrink-0 ${dimensions} ${className}`}
      animate={{
        y: mood === 'celebrating' ? [0, -4, 0] : [0, -1.5, 0],
      }}
      transition={{
        duration: mood === 'celebrating' ? 0.8 : 3.4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      aria-label="Memo the Finances Guru Owl"
    >
      <svg
        viewBox="0 0 180 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        {/* Subtle Shadow under perch */}
        <ellipse cx="90" cy="208" rx="52" ry="6" fill="currentColor" className="text-black/10 dark:text-white/10" />

        {/* Left & Right Ear Tufts (Skinny, slightly droopy) */}
        <path
          d="M52 54 L34 22 L72 44 Z"
          fill="#5B493E"
        />
        <path
          d="M128 54 L146 22 L108 44 Z"
          fill="#5B493E"
        />

        {/* Skinny Owl Torso */}
        <rect
          x="46"
          y="38"
          width="88"
          height="152"
          rx="44"
          fill="#6E5A4F"
          stroke="#3E322B"
          strokeWidth="3"
        />

        {/* Left Wing */}
        <motion.path
          d="M46 92 C30 108, 32 148, 48 166"
          stroke="#3E322B"
          strokeWidth="3.5"
          fill="#5B493E"
          animate={
            mood === 'celebrating'
              ? { rotate: [0, -14, 0] }
              : mood === 'thinking'
              ? { rotate: [0, -5, 0] }
              : {}
          }
          style={{ transformOrigin: '46px 96px' }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />

        {/* Right Wing */}
        <motion.path
          d="M134 92 C150 108, 148 148, 132 166"
          stroke="#3E322B"
          strokeWidth="3.5"
          fill="#5B493E"
          animate={
            mood === 'celebrating'
              ? { rotate: [0, 14, 0] }
              : {}
          }
          style={{ transformOrigin: '134px 96px' }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />

        {/* Warm Cream Belly with Literal Ledger Lines */}
        <rect
          x="60"
          y="108"
          width="60"
          height="70"
          rx="30"
          fill="#F5EFE6"
        />
        <line x1="72" y1="126" x2="108" y2="126" stroke="#C86D3B" strokeWidth="3" strokeLinecap="round" />
        <line x1="72" y1="142" x2="108" y2="142" stroke="#8C7A6B" strokeWidth="3" strokeLinecap="round" />
        <line x1="72" y1="158" x2="98" y2="158" stroke="#2E6F40" strokeWidth="3" strokeLinecap="round" />

        {/* Big Sclera Eyes */}
        <circle cx="71" cy="74" r="19" fill="#FAF7F2" stroke="#3E322B" strokeWidth="3" />
        <circle cx="109" cy="74" r="19" fill="#FAF7F2" stroke="#3E322B" strokeWidth="3" />

        {/* Pupils */}
        <circle
          cx={mood === 'thinking' ? 74 : 71}
          cy={mood === 'thinking' ? 76 : 78}
          r="5.5"
          fill="#1E1B18"
        />
        <circle
          cx={mood === 'thinking' ? 112 : 109}
          cy={mood === 'thinking' ? 76 : 78}
          r="5.5"
          fill="#1E1B18"
        />
        {/* Tiny Eye Highlights */}
        <circle cx="69" cy="75" r="1.8" fill="#FFFFFF" />
        <circle cx="107" cy="75" r="1.8" fill="#FFFFFF" />

        {/* Heavy Tired Eyelids (Half-closed signature look) */}
        <g transform={`translate(0, ${eyelidOffset})`}>
          <path
            d="M52 73 Q71 82 90 73 C90 61, 82 55, 71 55 C60 55, 52 61, 52 73 Z"
            fill="#8C7A6B"
            stroke="#3E322B"
            strokeWidth="2.5"
          />
          <path
            d="M90 73 Q109 82 128 73 C128 61, 120 55, 109 55 C98 55, 90 61, 90 73 Z"
            fill="#8C7A6B"
            stroke="#3E322B"
            strokeWidth="2.5"
          />
        </g>

        {/* Tired Under-Eye Bags (Late-night auditing creases) */}
        <path
          d="M59 97 Q71 103 83 97"
          stroke="#4A3A31"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M97 97 Q109 103 121 97"
          stroke="#4A3A31"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Thin Wire Reading Glasses Bridge */}
        <path d="M89 74 L91 74" stroke="#C86D3B" strokeWidth="2.5" />

        {/* Small Amber Beak */}
        <polygon points="85,84 95,84 90,97" fill="#C86D3B" stroke="#3E322B" strokeWidth="1.5" />

        {/* Brass Ledger Perch & Claws */}
        <line x1="28" y1="192" x2="152" y2="192" stroke="#C86D3B" strokeWidth="6" strokeLinecap="round" />
        <path d="M72 187 L72 198 M79 187 L79 198" stroke="#C86D3B" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M101 187 L101 198 M108 187 L108 198" stroke="#C86D3B" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
};

export interface ReferenceInfo {
  id: string;
  sourceName: string;
  organization: string;
  sectionTitle: string;
  url: string;
  licenseOrApi: string;
  literalExcerpt: string;
  furtherReadingTip: string;
}

interface ReferenceCornerBadgeProps {
  reference: ReferenceInfo;
  onSelect: (ref: ReferenceInfo) => void;
}

/**
 * Tiny, almost transparent "R" in the very corner of each piece of information/card.
 * Keeps the student focused on the interactive experience while offering 1-click source transparency.
 */
export const ReferenceCornerBadge: React.FC<ReferenceCornerBadgeProps> = ({
  reference,
  onSelect,
}) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSelect(reference);
      }}
      title={`View source reference: ${reference.organization} — ${reference.sectionTitle}`}
      aria-label={`Reference source: ${reference.organization}`}
      className="absolute top-2.5 right-2.5 z-10 flex h-5 w-5 items-center justify-center rounded text-[10px] font-mono font-semibold text-[var(--text-muted)] opacity-35 hover:opacity-100 hover:bg-[var(--bg-surface)] hover:text-[#C86D3B] focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-[#C86D3B] transition-opacity cursor-pointer select-none"
    >
      R
    </button>
  );
};
