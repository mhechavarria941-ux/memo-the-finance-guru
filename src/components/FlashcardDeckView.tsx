import React, { useEffect, useState } from 'react';
import { motion, PanInfo } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Plus,
  BookOpen,
} from 'lucide-react';
import {
  FlashcardItem,
  LearningTrack,
  SM2CardState,
} from '../data/curriculumData';
import { MemoOwl, ReferenceCornerBadge, ReferenceInfo } from './MemoOwl';

interface FlashcardDeckViewProps {
  cards: FlashcardItem[];
  sm2States: Record<string, SM2CardState>;
  selectedTrack: LearningTrack;
  onSelectTrack: (track: LearningTrack) => void;
  onRateCard: (cardId: string, quality: 1 | 3 | 4 | 5) => void;
  onAddCustomCard: (card: FlashcardItem) => void;
  onOpenReference: (ref: ReferenceInfo) => void;
  initialCustomConcept?: string;
}

export const FlashcardDeckView: React.FC<FlashcardDeckViewProps> = ({
  cards,
  sm2States,
  selectedTrack,
  onSelectTrack,
  onRateCard,
  onAddCustomCard,
  onOpenReference,
  initialCustomConcept,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [customConcept, setCustomConcept] = useState(initialCustomConcept || '');
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCustomConcept) {
      setCustomConcept(initialCustomConcept);
    }
  }, [initialCustomConcept]);

  const filteredCards =
    selectedTrack === 'general'
      ? cards
      : cards.filter((c) => c.track === selectedTrack || c.track === 'general');

  const safeIndex = filteredCards.length > 0 ? currentIndex % filteredCards.length : 0;
  const activeCard = filteredCards[safeIndex];
  const cardState = activeCard ? sm2States[activeCard.id] : undefined;

  const handleGrade = (quality: 1 | 3 | 4 | 5) => {
    if (!activeCard) return;
    setSwipeDirection(quality >= 4 ? 'right' : 'left');
    onRateCard(activeCard.id, quality);
    setTimeout(() => {
      setIsFlipped(false);
      setSwipeDirection(null);
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, filteredCards.length));
    }, 180);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 95;
    if (info.offset.x > threshold) {
      handleGrade(4); // Good / Swiped Right
    } else if (info.offset.x < -threshold) {
      handleGrade(1); // Needs Review / Swiped Left
    }
  };

  const handleCreateCustomCard = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customConcept.trim();
    if (!trimmed || isGeneratingCard) return;

    setIsGeneratingCard(true);
    setGenError(null);
    try {
      const response = await fetch('/api/gemini/explain-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: trimmed,
          track: selectedTrack,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Could not generate flashcard right now.');
      }

      const newCard: FlashcardItem = {
        id: `fc-custom-${Date.now()}`,
        track: selectedTrack,
        rungId: 'node-5-complex-triage',
        term: data.term || trimmed,
        frontQuestion: data.frontPrompt || `What is ${trimmed} in plain apples-to-apples terms?`,
        literalAnswer: data.literalDefinition,
        applesToApplesExample: data.applesToApplesExample,
        formula: data.formulaOrRule,
        memoWhisper: data.memoTip,
        tastingStyleId: 'taste-ledger-audit',
        reference: {
          id: `ref-custom-${Date.now()}`,
          sourceName: data.reference?.sourceName || 'OpenStax Financial & Managerial Accounting',
          organization: data.reference?.sourceName || 'OpenStax / SEC Investor.gov',
          sectionTitle: data.reference?.section || trimmed,
          url: data.reference?.url || 'https://openstax.org/Subjects/Business',
          licenseOrApi: 'Open Educational Resource (CC-BY 4.0)',
          literalExcerpt: data.reference?.summary || data.literalDefinition,
          furtherReadingTip: 'Review how this item appears on a company’s Balance Sheet or Income Statement.',
        },
      };

      onAddCustomCard(newCard);
      setCustomConcept('');
      setIsFlipped(false);
      setCurrentIndex(0);
    } catch (err) {
      setGenError(err instanceof Error ? err.message : 'Failed to create flashcard.');
    } finally {
      setIsGeneratingCard(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left 8 Columns: Interactive Swipe Flashcard Stage */}
      <div className="lg:col-span-8 space-y-6">
        {/* Track Filter Bar & Deck Progress */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-hairline)] pb-4">
          <div className="flex items-center gap-1 rounded-lg bg-[var(--bg-surface)] p-1">
            {(['general', 'accounting', 'finance', 'markets'] as LearningTrack[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  onSelectTrack(t);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize whitespace-nowrap cursor-pointer ${
                  selectedTrack === t
                    ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {t === 'general' ? 'All Tracks' : t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-mono tabular-nums">
            <span>Card {safeIndex + 1} of {filteredCards.length}</span>
            <span aria-hidden="true">·</span>
            <span>
              SM-2 Interval: {cardState ? `${cardState.interval}d` : 'New'}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Ease: {cardState ? cardState.efactor.toFixed(2) : '2.50'}
            </span>
          </div>
        </div>

        {/* Main Swipeable Flashcard */}
        {activeCard && (
          <div className="relative">
            <motion.div
              key={`${activeCard.id}-${isFlipped ? 'back' : 'front'}`}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, y: 8 }}
              animate={{
                opacity: 1,
                y: 0,
                x: swipeDirection === 'left' ? -140 : swipeDirection === 'right' ? 140 : 0,
              }}
              transition={{ duration: 0.18 }}
              onClick={() => setIsFlipped((f) => !f)}
              className="relative min-h-[370px] rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-7 sm:p-9 shadow-xs cursor-grab active:cursor-grabbing flex flex-col justify-between select-none"
            >
              {/* Tiny, almost transparent "R" in the very corner */}
              <ReferenceCornerBadge
                reference={activeCard.reference}
                onSelect={onOpenReference}
              />

              {/* Top Kicker (Clean unboxed text with separators) */}
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] pr-8">
                <span className="capitalize font-medium text-[#C86D3B]">{activeCard.track}</span>
                <span aria-hidden="true">·</span>
                <span>{isFlipped ? 'Literal Apples-to-Apples Breakdown' : 'Concept Prompt'}</span>
                <span aria-hidden="true">·</span>
                <span>Tap card to flip or swipe left/right</span>
              </div>

              {/* Center Content */}
              {!isFlipped ? (
                <div className="my-auto py-8 space-y-4">
                  <p className="text-xs font-mono text-[var(--text-muted)]">
                    Term #{safeIndex + 1} · {activeCard.term}
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] leading-snug">
                    {activeCard.frontQuestion}
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] pt-2">
                    Think in concrete dollars and items—no textbook jargon. Click anywhere on the card to reveal Memo’s literal breakdown.
                  </p>
                </div>
              ) : (
                <div className="my-auto py-5 space-y-5">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                      {activeCard.term}
                    </h3>
                    <p className="mt-2 text-base text-[var(--text-primary)] leading-relaxed">
                      {activeCard.literalAnswer}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[var(--bg-surface)] p-4 space-y-2">
                    <p className="text-xs font-semibold text-[#2E6F40] dark:text-[#4CA965]">
                      Apples to Apples, Pears to Pears Example
                    </p>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {activeCard.applesToApplesExample}
                    </p>
                  </div>

                  <div className="border-t border-[var(--border-hairline)] pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="font-mono text-[var(--text-primary)] font-semibold">
                      {activeCard.formula}
                    </span>
                    <span className="italic text-[var(--text-secondary)]">
                      Memo: “{activeCard.memoWhisper}”
                    </span>
                  </div>
                </div>
              )}

              {/* Bottom Bar inside Card */}
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-4 border-t border-[var(--border-hairline)]">
                <span className="flex items-center gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Swipe left: Review Again
                </span>
                <span className="font-medium text-[var(--text-secondary)]">
                  {isFlipped ? 'Click to flip back to question' : 'Click to flip to literal answer'}
                </span>
                <span className="flex items-center gap-1.5">
                  Swipe right: Got It
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>

            {/* Spaced Repetition SM-2 Rating Controls */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => handleGrade(1)}
                className="flex flex-col items-center justify-center rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] py-3 px-4 hover:border-red-600/50 transition-colors cursor-pointer"
              >
                <span className="text-xs font-semibold text-red-700 dark:text-red-400">
                  1 · Again
                </span>
                <span className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">
                  Reset interval (1d)
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleGrade(3)}
                className="flex flex-col items-center justify-center rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] py-3 px-4 hover:border-[#B87D14]/60 transition-colors cursor-pointer"
              >
                <span className="text-xs font-semibold text-[#B87D14] dark:text-[#E5A93B]">
                  2 · Hard
                </span>
                <span className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">
                  Short repeat (2d)
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleGrade(4)}
                className="flex flex-col items-center justify-center rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] py-3 px-4 hover:border-[#C86D3B] transition-colors cursor-pointer"
              >
                <span className="text-xs font-semibold text-[#C86D3B]">
                  3 · Good (Swipe →)
                </span>
                <span className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">
                  Standard SM-2 step
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleGrade(5)}
                className="flex flex-col items-center justify-center rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] py-3 px-4 hover:border-[#2E6F40] transition-colors cursor-pointer"
              >
                <span className="text-xs font-semibold text-[#2E6F40] dark:text-[#4CA965]">
                  4 · Easy (+25 XP)
                </span>
                <span className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">
                  Mastered boost
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right 4 Columns: Memo's Custom Apples-to-Apples Card Builder & Spaced Repetition Queue */}
      <div className="lg:col-span-4 space-y-6">
        <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 space-y-4">
          <div className="flex items-center gap-3">
            <MemoOwl mood={isGeneratingCard ? 'thinking' : 'welcoming'} size="sm" />
            <div>
              <h3 className="font-display text-base font-semibold text-[var(--text-primary)]">
                Ask Memo to Explain Any Term
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Turn any confusing finance or accounting word into a literal Apples-to-Apples card.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateCustomCard} className="space-y-3">
            <div>
              <label htmlFor="custom-concept-input" className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Financial or Accounting Concept
              </label>
              <input
                id="custom-concept-input"
                type="text"
                value={customConcept}
                onChange={(e) => setCustomConcept(e.target.value)}
                placeholder="e.g., EBITDA, Goodwill, FIFO vs LIFO, Bond Yield..."
                maxLength={80}
                className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-3.5 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-2 focus:outline-[#C86D3B]"
              />
            </div>

            {genError && (
              <p className="text-xs text-red-600 dark:text-red-400">{genError}</p>
            )}

            <button
              type="submit"
              disabled={isGeneratingCard || !customConcept.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#C86D3B] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#b55e2e] disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isGeneratingCard ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Memo is writing your literal card...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Apples-to-Apples Card to Deck</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Deck Index List */}
        <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-display text-sm font-semibold text-[var(--text-primary)]">
              Deck Queue ({filteredCards.length} Cards)
            </h4>
            <span className="text-xs text-[var(--text-muted)]">Click any term to jump</span>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-[var(--border-hairline)] pr-1">
            {filteredCards.map((c, idx) => {
              const st = sm2States[c.id];
              const isMastered = st && st.interval >= 6;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsFlipped(false);
                  }}
                  className={`w-full py-2.5 px-2 text-left flex items-center justify-between gap-2 rounded-md transition-colors cursor-pointer ${
                    idx === safeIndex
                      ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span className="text-xs truncate">{idx + 1}. {c.term}</span>
                  <span className="text-[11px] font-mono tabular-nums text-[var(--text-muted)] shrink-0 flex items-center gap-1">
                    {isMastered && <CheckCircle2 className="w-3 h-3 text-[#2E6F40] dark:text-[#4CA965]" />}
                    {st ? `${st.interval}d` : 'New'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
