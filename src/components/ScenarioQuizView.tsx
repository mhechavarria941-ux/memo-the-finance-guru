import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Sliders,
} from 'lucide-react';
import {
  LearningTrack,
  PEDAGOGICAL_TASTING_STYLES,
  ScenarioQuizItem,
} from '../data/curriculumData';
import { MemoOwl, ReferenceCornerBadge, ReferenceInfo } from './MemoOwl';

interface ScenarioQuizViewProps {
  scenarios: ScenarioQuizItem[];
  selectedTrack: LearningTrack;
  onCompleteQuiz: (quizId: string, tastingStyleId: string, isCorrect: boolean) => void;
  onAddGeneratedScenario: (scenario: ScenarioQuizItem) => void;
  onOpenReference: (ref: ReferenceInfo) => void;
}

export const ScenarioQuizView: React.FC<ScenarioQuizViewProps> = ({
  scenarios,
  selectedTrack,
  onCompleteQuiz,
  onAddGeneratedScenario,
  onOpenReference,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // AI Scenario Generator Controls
  const [customTopic, setCustomTopic] = useState('Prime Cost vs. Factory Overhead in a Coffee Roastery');
  const [customDifficulty, setCustomDifficulty] = useState('Foundational');
  const [customTastingId, setCustomTastingId] = useState(PEDAGOGICAL_TASTING_STYLES[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const currentQuiz = scenarios[activeIndex % scenarios.length];

  const handleSubmitAnswer = (idx: number) => {
    if (hasSubmitted) return;
    setSelectedOption(idx);
    setHasSubmitted(true);
    const isCorrect = idx === currentQuiz.correctIndex;
    onCompleteQuiz(currentQuiz.id, currentQuiz.tastingStyleId, isCorrect);
  };

  const handleNextScenario = () => {
    setSelectedOption(null);
    setHasSubmitted(false);
    setActiveIndex((prev) => (prev + 1) % scenarios.length);
  };

  const handleGenerateAIScenario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;
    setIsGenerating(true);
    setGenError(null);

    const styleObj =
      PEDAGOGICAL_TASTING_STYLES.find((s) => s.id === customTastingId) ||
      PEDAGOGICAL_TASTING_STYLES[0];

    try {
      const response = await fetch('/api/gemini/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: customTopic,
          track: selectedTrack,
          difficulty: customDifficulty,
          tastingStyle: `${styleObj.name} — ${styleObj.whatItMeasures}`,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Could not generate AI scenario.');
      }

      const newScenario: ScenarioQuizItem = {
        id: `quiz-ai-${Date.now()}`,
        title: data.title || customTopic,
        track: selectedTrack,
        difficulty: customDifficulty,
        tastingStyleId: styleObj.id,
        memoIntro: data.memoIntro,
        scenarioContext: data.scenarioContext,
        ledgerSnapshot: Array.isArray(data.ledgerSnapshot) ? data.ledgerSnapshot : [],
        question: data.question,
        options: Array.isArray(data.options) && data.options.length >= 2 ? data.options : ['Option A', 'Option B'],
        correctIndex: typeof data.correctIndex === 'number' ? data.correctIndex : 0,
        applesToApplesExplanation: data.applesToApplesExplanation,
        teacherDiagnosticInsight: data.teacherDiagnosticInsight,
        reference: {
          id: `ref-quiz-ai-${Date.now()}`,
          sourceName: data.referenceSource?.documentTitle || 'OpenStax Principles of Accounting',
          organization: data.referenceSource?.organization || 'OpenStax / SEC EDGAR',
          sectionTitle: data.title || customTopic,
          url: data.referenceSource?.url || 'https://openstax.org/details/books/principles-financial-accounting',
          licenseOrApi: data.referenceSource?.licenseNote || 'CC-BY 4.0 Open Educational Resource',
          literalExcerpt: data.applesToApplesExplanation,
          furtherReadingTip: data.teacherDiagnosticInsight,
        },
      };

      onAddGeneratedScenario(newScenario);
      setSelectedOption(null);
      setHasSubmitted(false);
      setActiveIndex(0);
    } catch (err) {
      setGenError(err instanceof Error ? err.message : 'Error generating AI scenario.');
    } finally {
      setIsGenerating(false);
    }
  };

  const isCorrect = selectedOption === currentQuiz.correctIndex;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left 8 Columns: Active Scenario Audit */}
      <div className="lg:col-span-8 space-y-6">
        <div className="relative rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-6 sm:p-8 space-y-6">
          {/* Tiny, almost transparent "R" reference button in top-right corner */}
          <ReferenceCornerBadge
            reference={currentQuiz.reference}
            onSelect={onOpenReference}
          />

          {/* Top Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-muted)] pr-8">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#C86D3B] capitalize">{currentQuiz.track}</span>
              <span aria-hidden="true">·</span>
              <span>{currentQuiz.difficulty}</span>
              <span aria-hidden="true">·</span>
              <span>Scenario {activeIndex + 1} of {scenarios.length}</span>
            </div>
            <button
              type="button"
              onClick={handleNextScenario}
              className="text-xs font-medium text-[var(--text-secondary)] hover:text-[#C86D3B] flex items-center gap-1 cursor-pointer"
            >
              <span>Skip / Next Scenario</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Memo Intro & Title */}
          <div className="flex items-start gap-4">
            <MemoOwl
              mood={
                !hasSubmitted
                  ? 'welcoming'
                  : isCorrect
                  ? 'celebrating'
                  : 'thinking'
              }
              size="sm"
            />
            <div className="space-y-1">
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-[var(--text-primary)]">
                {currentQuiz.title}
              </h2>
              <p className="text-xs italic text-[var(--text-secondary)]">
                {currentQuiz.memoIntro}
              </p>
            </div>
          </div>

          {/* Context */}
          <p className="text-sm sm:text-base text-[var(--text-primary)] leading-relaxed">
            {currentQuiz.scenarioContext}
          </p>

          {/* Literal Ledger Snapshot Table */}
          {currentQuiz.ledgerSnapshot.length > 0 && (
            <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[var(--border-hairline)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span className="font-semibold text-[var(--text-primary)]">Literal Ledger & Cash Figures</span>
                <span className="font-mono">Apples-to-Apples Audit</span>
              </div>
              <div className="divide-y divide-[var(--border-hairline)]">
                {currentQuiz.ledgerSnapshot.map((row, i) => (
                  <div
                    key={i}
                    className="px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                  >
                    <span className="font-medium text-[var(--text-primary)]">{row.lineItem}</span>
                    <div className="flex items-center gap-3 sm:justify-end">
                      <span className="text-[var(--text-muted)]">{row.note}</span>
                      <span className="font-mono font-semibold tabular-nums text-[var(--text-primary)] min-w-[90px] text-right">
                        {row.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Question & Options */}
          <div className="space-y-3 pt-2">
            <h3 className="font-display text-base sm:text-lg font-semibold text-[var(--text-primary)]">
              {currentQuiz.question}
            </h3>

            <div className="space-y-2.5">
              {currentQuiz.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isRightOption = idx === currentQuiz.correctIndex;

                let borderStyle = 'border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:border-[#C86D3B]';
                if (hasSubmitted) {
                  if (isRightOption) {
                    borderStyle = 'border-[#2E6F40] bg-[#2E6F40]/10 text-[var(--text-primary)]';
                  } else if (isSelected && !isRightOption) {
                    borderStyle = 'border-red-600 bg-red-600/10 text-[var(--text-primary)]';
                  } else {
                    borderStyle = 'border-[var(--border-hairline)] bg-[var(--bg-surface)] opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={hasSubmitted}
                    onClick={() => handleSubmitAnswer(idx)}
                    className={`w-full text-left rounded-xl border p-4 transition-colors flex items-start justify-between gap-3 cursor-pointer ${borderStyle}`}
                  >
                    <span className="text-sm text-[var(--text-primary)] leading-snug">
                      <strong className="font-mono mr-2">{String.fromCharCode(65 + idx)}.</strong>
                      {opt}
                    </span>
                    {hasSubmitted && isRightOption && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-[#2E6F40] dark:text-[#4CA965] shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                        Correct
                      </span>
                    )}
                    {hasSubmitted && isSelected && !isRightOption && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400 shrink-0">
                        <XCircle className="w-4 h-4" />
                        Not quite
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Post-Answer Literal Explanation & Teacher Diagnostic */}
          {hasSubmitted && (
            <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#2E6F40] dark:text-[#4CA965]">
                  {isCorrect ? 'Spot on! +40 XP Added to Your Ledger' : 'Let us walk through the exact math:'}
                </span>
                <button
                  type="button"
                  onClick={handleNextScenario}
                  className="rounded-lg bg-[#C86D3B] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#b55e2e] transition-colors cursor-pointer"
                >
                  Next Scenario →
                </button>
              </div>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                {currentQuiz.applesToApplesExplanation}
              </p>
              <div className="border-t border-[var(--border-hairline)] pt-2.5 text-xs text-[var(--text-secondary)]">
                <strong>Curriculum Tasting Diagnostic:</strong> {currentQuiz.teacherDiagnosticInsight}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right 4 Columns: AI Scenario Generator */}
      <div className="lg:col-span-4 space-y-6">
        <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-[#C86D3B]" />
            <h3 className="font-display text-base font-semibold text-[var(--text-primary)]">
              AI Scenario Builder
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Have Memo generate a brand-new interactive accounting or finance scenario tailored to a specific Pedagogical Tasting Style.
          </p>

          <form onSubmit={handleGenerateAIScenario} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Real-World Business Topic
              </label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                maxLength={120}
                className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-2 focus:outline-[#C86D3B]"
                placeholder="e.g., Food truck Prime Cost vs Monthly Permit"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Pedagogical Tasting Style (Teacher Diagnostic)
              </label>
              <select
                value={customTastingId}
                onChange={(e) => setCustomTastingId(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-2 focus:outline-[#C86D3B]"
              >
                {PEDAGOGICAL_TASTING_STYLES.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.shortCode} · {style.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Complexity Level
              </label>
              <select
                value={customDifficulty}
                onChange={(e) => setCustomDifficulty(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-2 focus:outline-[#C86D3B]"
              >
                <option value="Entry">Entry (Zero Jargon, Small Dollars)</option>
                <option value="Foundational">Foundational (Three-Statement Link)</option>
                <option value="Intermediate">Intermediate (Working Capital & Multiples)</option>
                <option value="Advanced Scenario">Advanced (Real-Life CFO Triage)</option>
              </select>
            </div>

            {genError && (
              <p className="text-xs text-red-600 dark:text-red-400">{genError}</p>
            )}

            <button
              type="submit"
              disabled={isGenerating || !customTopic.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#C86D3B] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#b55e2e] disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Memo is drafting ledger numbers...</span>
                </>
              ) : (
                <span>Generate Interactive Scenario</span>
              )}
            </button>
          </form>
        </div>

        {/* Scenario List */}
        <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-5 space-y-2.5">
          <h4 className="font-display text-sm font-semibold text-[var(--text-primary)]">
            Available Scenarios ({scenarios.length})
          </h4>
          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {scenarios.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setActiveIndex(idx);
                  setSelectedOption(null);
                  setHasSubmitted(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                  idx === activeIndex % scenarios.length
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <div className="truncate">{idx + 1}. {s.title}</div>
                <div className="text-[11px] text-[var(--text-muted)] capitalize">
                  {s.track} · {s.difficulty}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
