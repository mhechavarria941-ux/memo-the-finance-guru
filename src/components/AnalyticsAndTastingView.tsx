import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Cloud,
  ExternalLink,
  RotateCcw,
  Compass,
  BookMarked,
  Clock,
  Plus,
} from 'lucide-react';
import {
  CURRICULUM_LADDER,
  LearningTrack,
  OPEN_EDUCATIONAL_SOURCES,
  PEDAGOGICAL_TASTING_STYLES,
} from '../data/curriculumData';
import { MemoOwl } from './MemoOwl';

interface GeneratedPlanStep {
  stepNumber: number;
  title: string;
  literalObjective: string;
  concreteExercise: string;
  estimatedMinutes: number;
  openSourceReading: string;
}

interface GeneratedLessonPlan {
  planTitle: string;
  memoGreeting: string;
  steps: GeneratedPlanStep[];
  teacherCurriculumNote: string;
}

interface AnalyticsAndTastingViewProps {
  xp: number;
  streakDays: number;
  cardsMastered: number;
  totalCards: number;
  quizzesCompleted: number;
  completedNodeIds: string[];
  savedTutorialIds: string[];
  tastingScores: Record<string, { attempts: number; correct: number }>;
  learningTrack: LearningTrack;
  dailyMinutesGoal: number;
  dailyMinutesStudied: number;
  onUpdateDailyMinutesGoal: (goal: number) => void;
  onLogStudyMinutes: (deltaMinutes: number) => void;
  reminderEnabled: boolean;
  reminderTime: string;
  onUpdateReminders: (enabled: boolean, time: string) => void;
  onJumpToNode: (nodeId: string) => void;
  isCloudSynced: boolean;
  lastSyncedAt: string | null;
}

export const AnalyticsAndTastingView: React.FC<AnalyticsAndTastingViewProps> = ({
  xp,
  streakDays,
  cardsMastered,
  totalCards,
  quizzesCompleted,
  completedNodeIds,
  savedTutorialIds,
  tastingScores,
  learningTrack,
  dailyMinutesGoal,
  dailyMinutesStudied,
  onUpdateDailyMinutesGoal,
  onLogStudyMinutes,
  reminderEnabled,
  reminderTime,
  onUpdateReminders,
  onJumpToNode,
  isCloudSynced,
  lastSyncedAt,
}) => {
  const [goalInput, setGoalInput] = useState(
    'Understand Sales, Gross vs Net Profit, Prime Cost, and the 3 Financial Statements'
  );
  const [weeklyHours, setWeeklyHours] = useState(4);
  const [customPlan, setCustomPlan] = useState<GeneratedLessonPlan | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [reminderNotice, setReminderNotice] = useState<string | null>(null);

  const ladderCompletionPct = Math.round(
    (completedNodeIds.length / CURRICULUM_LADDER.length) * 100
  );
  const cardMasteryPct = Math.round((cardsMastered / Math.max(1, totalCards)) * 100);

  // Circular Progress Ring calculations for Daily Learning Minutes Goal
  const safeGoal = Math.max(5, dailyMinutesGoal || 20);
  const safeStudied = Math.max(0, dailyMinutesStudied || 0);
  const minutesGoalPct = Math.min(100, Math.round((safeStudied / safeGoal) * 100));
  const isDailyGoalMet = safeStudied >= safeGoal;
  const ringRadius = 56;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringStrokeDashoffset =
    ringCircumference - (minutesGoalPct / 100) * ringCircumference;

  const handleGenerateLessonPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGeneratingPlan) return;
    setIsGeneratingPlan(true);
    setPlanError(null);

    // Identify lowest-scoring tasting styles for targeted curriculum improvement
    const weakAreas = PEDAGOGICAL_TASTING_STYLES.filter((s) => {
      const st = tastingScores[s.id];
      if (!st || st.attempts === 0) return true;
      return st.correct / st.attempts < 0.75;
    }).map((s) => s.name);

    try {
      const response = await fetch('/api/gemini/lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: goalInput,
          track: learningTrack,
          weeklyHours,
          weakAreas,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Could not generate personalized lesson plan.');
      }
      setCustomPlan(data);
    } catch (err) {
      setPlanError(err instanceof Error ? err.message : 'Failed to generate lesson plan.');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleTestReminder = async () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Memo Ledger Study Reminder', {
          body: `Hoo! It is ${reminderTime}. Ready for 5 minutes of literal Apples-to-Apples flashcards?`,
        });
        setReminderNotice(`Browser notification sent! Daily reminder active for ${reminderTime}.`);
        return;
      } else if (Notification.permission !== 'denied') {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          new Notification('Memo Ledger Study Reminder', {
            body: `Hoo! Daily study reminder set for ${reminderTime}.`,
          });
          setReminderNotice(`Notifications enabled! Scheduled for ${reminderTime} daily.`);
          return;
        }
      }
    }
    setReminderNotice(
      `In-app study reminder saved for ${reminderTime} daily (synced to your profile).`
    );
  };

  return (
    <div className="space-y-12">
      {/* Section 1: Real-Time Academic Improvement Metrics */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[var(--border-hairline)] pb-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
              01. Academic Progress & Spaced Repetition Analytics
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Real-time measurement of your concept retention, ladder completion, and cross-device cloud backup.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-mono">
            <Cloud className="w-3.5 h-3.5 text-[#2E6F40] dark:text-[#4CA965]" />
            <span>
              {isCloudSynced
                ? `Cloud Backup Active ${lastSyncedAt ? `· Synced ${lastSyncedAt}` : ''}`
                : 'Local Offline Storage Active · Sign in to sync across devices'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-5">
            <p className="text-xs text-[var(--text-muted)]">Ledger XP Earned</p>
            <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-[var(--text-primary)]">
              {xp.toLocaleString()} XP
            </p>
            <p className="mt-1 text-xs text-[#C86D3B]">
              Level {Math.floor(xp / 150) + 1} Analyst
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-5">
            <p className="text-xs text-[var(--text-muted)]">Study Streak</p>
            <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-[var(--text-primary)]">
              {streakDays} {streakDays === 1 ? 'Day' : 'Days'}
            </p>
            <p className="mt-1 text-xs text-[#2E6F40] dark:text-[#4CA965]">
              Consistent daily recall
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-5">
            <p className="text-xs text-[var(--text-muted)]">Ladder Mastery</p>
            <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-[var(--text-primary)]">
              {ladderCompletionPct}%
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              {completedNodeIds.length} of {CURRICULUM_LADDER.length} rungs mastered
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-5">
            <p className="text-xs text-[var(--text-muted)]">SM-2 Cards Mastered</p>
            <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-[var(--text-primary)]">
              {cardsMastered} / {totalCards}
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              {cardMasteryPct}% long-term interval
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-5">
            <p className="text-xs text-[var(--text-muted)]">Offline Tutorials Saved</p>
            <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-[var(--text-primary)]">
              {savedTutorialIds.length} Packs
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              {quizzesCompleted} scenarios audited
            </p>
          </div>
        </div>

        {/* Daily Learning Minutes Goal & Circular Progress Ring */}
        <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-6 sm:p-7">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Circular Progress Ring Visualization (4 cols) */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-4 border-b lg:border-b-0 lg:border-r border-[var(--border-hairline)] pb-5 lg:pb-0 lg:pr-6">
              <div className="relative flex items-center justify-center w-36 h-36 shrink-0">
                <svg
                  className="w-36 h-36 -rotate-90 transform"
                  viewBox="0 0 140 140"
                  role="img"
                  aria-label={`Daily Learning Minutes progress: ${safeStudied} of ${safeGoal} minutes (${minutesGoalPct}%)`}
                >
                  {/* Background Track Ring */}
                  <circle
                    cx="70"
                    cy="70"
                    r={ringRadius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-[var(--bg-surface)]"
                  />
                  {/* Animated Progress Arc */}
                  <circle
                    cx="70"
                    cy="70"
                    r={ringRadius}
                    fill="transparent"
                    stroke={isDailyGoalMet ? '#2E6F40' : '#C86D3B'}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringStrokeDashoffset}
                    className="transition-all duration-500 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-mono text-2xl font-semibold tabular-nums text-[var(--text-primary)]">
                    {minutesGoalPct}%
                  </span>
                  <span className="font-mono text-xs tabular-nums text-[var(--text-secondary)]">
                    {safeStudied}/{safeGoal} min
                  </span>
                </div>
              </div>

              <div className="text-center space-y-1">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                    isDailyGoalMet
                      ? 'text-[#2E6F40] dark:text-[#4CA965]'
                      : 'text-[#C86D3B]'
                  }`}
                >
                  {isDailyGoalMet ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Daily Goal Reached!</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{Math.max(0, safeGoal - safeStudied)} min left today</span>
                    </>
                  )}
                </span>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Auto-tracks flashcards, quizzes & rungs
                </p>
              </div>
            </div>

            {/* Goal Configuration & Quick Session Logging (8 cols) */}
            <div className="lg:col-span-8 space-y-5">
              <div className="space-y-1">
                <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                  Daily Learning Minutes Goal
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Set your daily target for focused accounting & finance study. Completing flashcards (+2 min), AI scenarios (+5 min), or mastering a ladder rung (+6 min) automatically advances your ring—or log offline reading minutes below.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Set Daily Target */}
                <div className="rounded-xl bg-[var(--bg-surface)] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="daily-minutes-goal-input"
                      className="text-xs font-semibold text-[var(--text-primary)]"
                    >
                      Set Daily Goal (Minutes)
                    </label>
                    <span className="font-mono text-xs font-semibold text-[#C86D3B] tabular-nums">
                      Target: {safeGoal} min/day
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {[10, 15, 20, 30, 45, 60].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => onUpdateDailyMinutesGoal(preset)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                          safeGoal === preset
                            ? 'bg-[#C86D3B] text-white font-semibold'
                            : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-hairline)]'
                        }`}
                      >
                        {preset}m
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-[var(--text-muted)]">Custom:</span>
                    <input
                      id="daily-minutes-goal-input"
                      type="number"
                      min={5}
                      max={180}
                      value={safeGoal}
                      onChange={(e) => {
                        const val = Math.max(5, Math.min(180, Number(e.target.value) || 5));
                        onUpdateDailyMinutesGoal(val);
                      }}
                      className="w-24 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-2.5 py-1 text-xs font-mono tabular-nums text-[var(--text-primary)] focus:outline-2 focus:outline-[#C86D3B]"
                    />
                    <span className="text-xs text-[var(--text-muted)]">minutes / day</span>
                  </div>
                </div>

                {/* Log Study Minutes */}
                <div className="rounded-xl bg-[var(--bg-surface)] p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[var(--text-primary)]">
                        Track Today’s Study Time
                      </span>
                      <span className="font-mono text-xs text-[var(--text-secondary)] tabular-nums">
                        Logged: {safeStudied} min
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Add time spent reviewing ledger tables or offline tutorials:
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {[5, 10, 15].map((addMin) => (
                      <button
                        key={addMin}
                        type="button"
                        onClick={() => onLogStudyMinutes(addMin)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs font-mono font-medium text-[var(--text-primary)] hover:border-[#C86D3B] transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-[#C86D3B]" />
                        <span>{addMin} min</span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => onLogStudyMinutes(-safeStudied)}
                      className="ml-auto text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] underline cursor-pointer"
                    >
                      Reset Today
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Teacher & Curriculum "Tastings Styles" Diagnostic Matrix */}
      <section className="space-y-5">
        <div className="border-b border-[var(--border-hairline)] pb-4">
          <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
            02. Finance & Accounting “Tasting Styles” (Teacher & Curriculum Diagnostics)
          </h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)] max-w-3xl">
            In accounting and finance pedagogy, diagnostic “tasting styles” sample how a student reasons through four distinct cognitive tasks—helping teachers spot exact blindspots and tailor the curriculum to individual student needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PEDAGOGICAL_TASTING_STYLES.map((style) => {
            const stat = tastingScores[style.id] || { attempts: 0, correct: 0 };
            const accuracy =
              stat.attempts > 0 ? Math.round((stat.correct / stat.attempts) * 100) : null;
            const statusText =
              accuracy === null
                ? 'Needs Diagnostic Sample'
                : accuracy >= 80
                ? 'Strong Mastery'
                : 'Room for Curriculum Improvement';

            return (
              <div
                key={style.id}
                className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span className="font-mono font-semibold text-[#C86D3B]">
                      {style.shortCode} · {style.focusDomain}
                    </span>
                    <span className="font-mono tabular-nums">
                      {accuracy !== null ? `${accuracy}% (${stat.correct}/${stat.attempts})` : 'Unassessed'} · {statusText}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                    {style.name}
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    <strong>What it measures:</strong> {style.whatItMeasures}
                  </p>

                  <div className="rounded-xl bg-[var(--bg-surface)] p-3.5 space-y-1.5 text-xs">
                    <p className="text-[var(--text-primary)]">
                      <strong>Common Student Blindspot:</strong> {style.commonStudentBlindspot}
                    </p>
                    <p className="text-[#2E6F40] dark:text-[#4CA965]">
                      <strong>Teacher Curriculum Fix:</strong> {style.teacherActionableFix}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--border-hairline)] flex items-center justify-between gap-2">
                  <span className="text-xs text-[var(--text-muted)] truncate">
                    Probe: “{style.sampleProbe}”
                  </span>
                  <button
                    type="button"
                    onClick={() => onJumpToNode(style.recommendedNodeIds[0])}
                    className="text-xs font-semibold text-[#C86D3B] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Review Rung →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Personalized AI Lesson Plan Generator & Study Reminders */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Personalized Lesson Plan Builder (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-6 sm:p-8 space-y-5">
          <div className="flex items-start gap-3.5">
            <MemoOwl mood={isGeneratingPlan ? 'thinking' : 'welcoming'} size="sm" />
            <div>
              <h3 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                03. Personalized Lesson Plan Generator
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Memo combines your learning goal and Tasting Style diagnostics to build a custom, zero-cost study syllabus.
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerateLessonPlan} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Your Specific Learning Goal
                </label>
                <input
                  type="text"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  maxLength={150}
                  className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs text-[var(--text-primary)] focus:outline-2 focus:outline-[#C86D3B]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Hours / Week
                </label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value) || 4)}
                  className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-2 text-xs font-mono text-[var(--text-primary)] focus:outline-2 focus:outline-[#C86D3B]"
                />
              </div>
            </div>

            {planError && (
              <p className="text-xs text-red-600 dark:text-red-400">{planError}</p>
            )}

            <button
              type="submit"
              disabled={isGeneratingPlan}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#C86D3B] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#b55e2e] disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isGeneratingPlan ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Memo is tailoring your curriculum...</span>
                </>
              ) : (
                <>
                  <Compass className="w-3.5 h-3.5" />
                  <span>Build Tailored Lesson Plan</span>
                </>
              )}
            </button>
          </form>

          {customPlan && (
            <div className="mt-5 space-y-4 border-t border-[var(--border-hairline)] pt-5">
              <div>
                <h4 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                  {customPlan.planTitle}
                </h4>
                <p className="mt-1 text-xs italic text-[var(--text-secondary)]">
                  Memo: “{customPlan.memoGreeting}”
                </p>
              </div>

              <div className="space-y-3">
                {customPlan.steps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="rounded-xl bg-[var(--bg-surface)] p-4 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[var(--text-primary)]">
                        Step 0{step.stepNumber}. {step.title}
                      </span>
                      <span className="font-mono text-[var(--text-muted)]">
                        {step.estimatedMinutes} mins
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {step.literalObjective}
                    </p>
                    <p className="text-xs text-[#2E6F40] dark:text-[#4CA965]">
                      <strong>Apples-to-Apples Drill:</strong> {step.concreteExercise}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Free Source: {step.openSourceReading}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-xs text-[var(--text-secondary)] bg-[var(--bg-surface)] p-3 rounded-lg">
                <strong>Teacher Adaptation Note:</strong> {customPlan.teacherCurriculumNote}
              </p>
            </div>
          )}
        </div>

        {/* Customizable Study Reminders & Open Educational Sources (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-[#C86D3B]" />
              <h3 className="font-display text-base font-semibold text-[var(--text-primary)]">
                Customizable Study Reminders
              </h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Spaced repetition works best with a calm 10-minute daily habit. Customize when Memo nudges you.
            </p>

            <div className="flex items-center justify-between gap-4 pt-1">
              <label className="flex items-center gap-2.5 text-xs font-medium text-[var(--text-primary)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminderEnabled}
                  onChange={(e) => onUpdateReminders(e.target.checked, reminderTime)}
                  className="h-4 w-4 accent-[#C86D3B] rounded"
                />
                <span>Enable Daily Study Reminder</span>
              </label>

              <input
                type="time"
                value={reminderTime}
                onChange={(e) => onUpdateReminders(reminderEnabled, e.target.value)}
                aria-label="Daily reminder time"
                className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-2.5 py-1.5 text-xs font-mono text-[var(--text-primary)]"
              />
            </div>

            <button
              type="button"
              onClick={handleTestReminder}
              className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] py-2 text-xs font-medium text-[var(--text-primary)] hover:border-[#C86D3B] transition-colors cursor-pointer"
            >
              Save & Test Notification Now
            </button>

            {reminderNotice && (
              <p className="text-xs text-[#2E6F40] dark:text-[#4CA965]">{reminderNotice}</p>
            )}
          </div>

          {/* Open Educational Sources & API Attribution */}
          <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-[#C86D3B]" />
              <h3 className="font-display text-base font-semibold text-[var(--text-primary)]">
                Open Educational Sources & API Credits
              </h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Every lesson and flashcard in Memo Ledger is built from free, open-access public financial institutions and universities:
            </p>

            <div className="divide-y divide-[var(--border-hairline)]">
              {OPEN_EDUCATIONAL_SOURCES.map((src) => (
                <div key={src.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-[var(--text-primary)] hover:text-[#C86D3B] flex items-center gap-1"
                    >
                      <span>{src.name}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                    <span className="text-[11px] font-mono text-[#2E6F40] dark:text-[#4CA965] shrink-0 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Offline Ready
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {src.provider} · {src.apiOrLicense}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">{src.coverage}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
