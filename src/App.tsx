/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  Bookmark,
  CheckCircle2,
  Cloud,
  ExternalLink,
  LogOut,
  Moon,
  Sun,
  X,
  ArrowRight,
  DownloadCloud,
  Search,
  Filter,
} from 'lucide-react';
import {
  auth,
  db,
  handleFirestoreError,
  OperationType,
  signInWithGoogle,
  signOutUser,
} from './firebase';
import {
  CURATED_SCENARIO_QUIZZES,
  CURRICULUM_LADDER,
  FlashcardItem,
  INITIAL_FLASHCARDS,
  LadderNode,
  LearningTrack,
  ScenarioQuizItem,
  SM2CardState,
} from './data/curriculumData';
import {
  MemoOwl,
  ReferenceCornerBadge,
  ReferenceInfo,
} from './components/MemoOwl';
import { FlashcardDeckView } from './components/FlashcardDeckView';
import { ScenarioQuizView } from './components/ScenarioQuizView';
import { AnalyticsAndTastingView } from './components/AnalyticsAndTastingView';
import { PeerForumView } from './components/PeerForumView';
import { OfflineIndicator, PWAInstallButton } from './hooks/usePWA';

type ActiveTab = 'ladder' | 'flashcards' | 'scenarios' | 'forum' | 'analytics';

export type MajorCurriculumFilter =
  | 'all'
  | 'accounting'
  | 'finance'
  | 'markets'
  | 'foundations';

export interface MajorFilterOption {
  id: MajorCurriculumFilter;
  label: string;
  shortLabel: string;
  description: string;
}

export const MAJOR_FILTER_OPTIONS: MajorFilterOption[] = [
  {
    id: 'all',
    label: 'All Curriculum',
    shortLabel: 'All',
    description: 'All 16 levels & 250+ subtopics across accounting, finance & markets',
  },
  {
    id: 'accounting',
    label: 'Accounting',
    shortLabel: 'Accounting',
    description: 'Ledgers, journals, bookkeeping, financial statements & cost accounting',
  },
  {
    id: 'finance',
    label: 'Corporate Finance',
    shortLabel: 'Corp Finance',
    description: 'Financial analysis, ROI, DCF valuation, modeling & M&A',
  },
  {
    id: 'markets',
    label: 'Market Study',
    shortLabel: 'Markets',
    description: 'Competitive research, macroeconomic indicators & market risk',
  },
  {
    id: 'foundations',
    label: 'Foundations & Excel',
    shortLabel: 'Foundations',
    description: 'Business math, percentages, margins, interest & Excel data skills',
  },
];

const LOCAL_STORAGE_KEY = 'memo_ledger_local_state_v1';

interface LocalStudyState {
  learningTrack: LearningTrack;
  xp: number;
  streakDays: number;
  dailyMinutesGoal: number;
  dailyMinutesStudied: number;
  quizzesCompleted: number;
  completedNodeIds: string[];
  savedTutorialIds: string[];
  reminderEnabled: boolean;
  reminderTime: string;
  sm2States: Record<string, SM2CardState>;
  tastingScores: Record<string, { attempts: number; correct: number }>;
  darkMode: boolean;
}

const DEFAULT_STUDY_STATE: LocalStudyState = {
  learningTrack: 'general',
  xp: 120,
  streakDays: 3,
  dailyMinutesGoal: 20,
  dailyMinutesStudied: 12,
  quizzesCompleted: 1,
  completedNodeIds: ['level-1-business-financial-math', 'level-7-cost-accounting-operating-performance'],
  savedTutorialIds: [
    'level-1-business-financial-math',
    'level-5-financial-statements-connections',
    'level-8-financial-analysis-roi-performance',
  ],
  reminderEnabled: true,
  reminderTime: '19:30',
  sm2States: {
    'fc-roi-core': {
      cardId: 'fc-roi-core',
      interval: 6,
      repetition: 2,
      efactor: 2.6,
      nextReviewTimestamp: Date.now() + 86400000 * 6,
    },
    'fc-sales-vs-profit': {
      cardId: 'fc-sales-vs-profit',
      interval: 6,
      repetition: 2,
      efactor: 2.6,
      nextReviewTimestamp: Date.now() + 86400000 * 6,
    },
    'fc-prime-cost': {
      cardId: 'fc-prime-cost',
      interval: 6,
      repetition: 2,
      efactor: 2.6,
      nextReviewTimestamp: Date.now() + 86400000 * 6,
    },
  },
  tastingScores: {
    'taste-ledger-audit': { attempts: 2, correct: 2 },
    'taste-three-statement': { attempts: 2, correct: 1 },
  },
  darkMode: false,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('ladder');
  const [studyState, setStudyState] = useState<LocalStudyState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_STUDY_STATE, ...JSON.parse(saved) };
      }
    } catch {
      // ignore local storage parse error
    }
    return DEFAULT_STUDY_STATE;
  });

  const [flashcards, setFlashcards] = useState<FlashcardItem[]>(INITIAL_FLASHCARDS);
  const [scenarios, setScenarios] = useState<ScenarioQuizItem[]>(CURATED_SCENARIO_QUIZZES);
  const [selectedRungId, setSelectedRungId] = useState<string>(CURRICULUM_LADDER[0].id);
  const [onlyOfflineSavedFilter, setOnlyOfflineSavedFilter] = useState(false);
  const [ladderSearchQuery, setLadderSearchQuery] = useState('');
  const [selectedSubtopicForCard, setSelectedSubtopicForCard] = useState<string>('');
  const [selectedMajorFilter, setSelectedMajorFilter] = useState<MajorCurriculumFilter>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.learningTrack === 'accounting') return 'accounting';
        if (parsed.learningTrack === 'finance') return 'finance';
        if (parsed.learningTrack === 'markets') return 'markets';
      }
    } catch {
      // fallback
    }
    return 'all';
  });

  // Reference Drawer State (Triggered by clicking the tiny "R" in the corner of any card)
  const [activeReference, setActiveReference] = useState<ReferenceInfo | null>(null);

  // Non-intrusive Premium Banner & Modal State
  const [showPremiumBanner, setShowPremiumBanner] = useState(true);
  const [showPremiumInfoModal, setShowPremiumInfoModal] = useState(false);

  // Firebase Auth & Cloud Backup State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (studyState.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [studyState.darkMode]);

  // Save to localStorage for instant offline persistence
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(studyState));
    } catch {
      // ignore storage quota errors
    }
  }, [studyState]);

  // Listen to Firebase Auth state and load/create user cloud profile
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthReady(true);

      if (user) {
        const path = `users/${user.uid}`;
        try {
          const userRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data();
            setStudyState((prev) => ({
              ...prev,
              learningTrack: (data.learningTrack as LearningTrack) || prev.learningTrack,
              xp: typeof data.xp === 'number' ? Math.max(prev.xp, data.xp) : prev.xp,
              streakDays: typeof data.streakDays === 'number' ? Math.max(prev.streakDays, data.streakDays) : prev.streakDays,
              quizzesCompleted:
                typeof data.quizzesCompleted === 'number'
                  ? Math.max(prev.quizzesCompleted, data.quizzesCompleted)
                  : prev.quizzesCompleted,
              completedNodeIds: Array.isArray(data.completedNodeIds)
                ? data.completedNodeIds.slice(0, 50)
                : prev.completedNodeIds,
              savedTutorialIds: Array.isArray(data.savedTutorialIds)
                ? data.savedTutorialIds.slice(0, 50)
                : prev.savedTutorialIds,
              reminderEnabled:
                typeof data.reminderEnabled === 'boolean'
                  ? data.reminderEnabled
                  : prev.reminderEnabled,
              reminderTime:
                typeof data.reminderTime === 'string'
                  ? data.reminderTime
                  : prev.reminderTime,
            }));
            setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          } else {
            const masteredCount = Object.values(studyState.sm2States).filter(
              (s) => s.interval >= 6
            ).length;
            await setDoc(userRef, {
              uid: user.uid,
              displayName: (user.displayName || 'Finance Student').slice(0, 80),
              learningTrack: studyState.learningTrack,
              xp: Math.floor(studyState.xp),
              streakDays: Math.floor(studyState.streakDays),
              cardsMastered: masteredCount,
              quizzesCompleted: Math.floor(studyState.quizzesCompleted),
              completedNodeIds: studyState.completedNodeIds.slice(0, 50),
              savedTutorialIds: studyState.savedTutorialIds.slice(0, 50),
              reminderEnabled: studyState.reminderEnabled,
              reminderTime: studyState.reminderTime.slice(0, 10),
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
            setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, path);
        }
      }
    });
    return () => unsub();
  }, []);

  // Helper to push updated study profile to Firebase Cloud Backup
  const syncToCloudBackup = async (nextState: LocalStudyState) => {
    if (!currentUser) return;
    const path = `users/${currentUser.uid}`;
    const masteredCount = Object.values(nextState.sm2States).filter(
      (s) => s.interval >= 6
    ).length;

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        displayName: (currentUser.displayName || 'Finance Student').slice(0, 80),
        learningTrack: nextState.learningTrack,
        xp: Math.floor(nextState.xp),
        streakDays: Math.floor(nextState.streakDays),
        cardsMastered: masteredCount,
        quizzesCompleted: Math.floor(nextState.quizzesCompleted),
        completedNodeIds: nextState.completedNodeIds.slice(0, 50),
        savedTutorialIds: nextState.savedTutorialIds.slice(0, 50),
        reminderEnabled: nextState.reminderEnabled,
        reminderTime: nextState.reminderTime.slice(0, 10),
        updatedAt: serverTimestamp(),
      });
      setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  // SuperMemo SM-2 Spaced Repetition Update Handler
  const handleRateCard = (cardId: string, quality: 1 | 3 | 4 | 5) => {
    setStudyState((prev) => {
      const existing = prev.sm2States[cardId] || {
        cardId,
        interval: 0,
        repetition: 0,
        efactor: 2.5,
        nextReviewTimestamp: Date.now(),
      };

      let nextRep = existing.repetition;
      let nextInterval = existing.interval;
      let nextEf =
        existing.efactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      if (nextEf < 1.3) nextEf = 1.3;

      if (quality < 3) {
        nextRep = 0;
        nextInterval = 1;
      } else {
        if (nextRep === 0) {
          nextInterval = 1;
        } else if (nextRep === 1) {
          nextInterval = 3;
        } else {
          nextInterval = Math.round(existing.interval * nextEf);
        }
        nextRep += 1;
      }

      const xpGain = quality === 5 ? 25 : quality >= 3 ? 15 : 5;
      const nextState: LocalStudyState = {
        ...prev,
        xp: prev.xp + xpGain,
        dailyMinutesStudied: (prev.dailyMinutesStudied || 0) + 2,
        sm2States: {
          ...prev.sm2States,
          [cardId]: {
            cardId,
            interval: nextInterval,
            repetition: nextRep,
            efactor: nextEf,
            nextReviewTimestamp: Date.now() + nextInterval * 86400000,
            lastQuality: quality,
          },
        },
      };
      syncToCloudBackup(nextState);
      return nextState;
    });
  };

  const handleToggleMasterNode = (nodeId: string) => {
    setStudyState((prev) => {
      const alreadyCompleted = prev.completedNodeIds.includes(nodeId);
      const nextCompleted = alreadyCompleted
        ? prev.completedNodeIds.filter((id) => id !== nodeId)
        : [...prev.completedNodeIds, nodeId].slice(0, 50);
      const nextXp = alreadyCompleted ? prev.xp : prev.xp + 50;
      const nextMinutes = alreadyCompleted
        ? prev.dailyMinutesStudied || 0
        : (prev.dailyMinutesStudied || 0) + 6;

      const nextState: LocalStudyState = {
        ...prev,
        xp: nextXp,
        dailyMinutesStudied: nextMinutes,
        completedNodeIds: nextCompleted,
      };
      syncToCloudBackup(nextState);
      return nextState;
    });
  };

  const handleToggleOfflineSave = (nodeId: string) => {
    setStudyState((prev) => {
      const isSaved = prev.savedTutorialIds.includes(nodeId);
      const nextSaved = isSaved
        ? prev.savedTutorialIds.filter((id) => id !== nodeId)
        : [...prev.savedTutorialIds, nodeId].slice(0, 50);

      const nextState: LocalStudyState = {
        ...prev,
        savedTutorialIds: nextSaved,
      };
      syncToCloudBackup(nextState);
      return nextState;
    });
  };

  const handleCompleteQuiz = (
    _quizId: string,
    tastingStyleId: string,
    isCorrect: boolean
  ) => {
    setStudyState((prev) => {
      const prevTaste = prev.tastingScores[tastingStyleId] || {
        attempts: 0,
        correct: 0,
      };
      const nextState: LocalStudyState = {
        ...prev,
        xp: prev.xp + (isCorrect ? 40 : 10),
        dailyMinutesStudied: (prev.dailyMinutesStudied || 0) + 5,
        quizzesCompleted: prev.quizzesCompleted + 1,
        tastingScores: {
          ...prev.tastingScores,
          [tastingStyleId]: {
            attempts: prevTaste.attempts + 1,
            correct: prevTaste.correct + (isCorrect ? 1 : 0),
          },
        },
      };
      syncToCloudBackup(nextState);
      return nextState;
    });
  };

  const handleUpdateDailyMinutesGoal = (goal: number) => {
    setStudyState((prev) => ({
      ...prev,
      dailyMinutesGoal: Math.max(5, Math.min(180, Math.round(goal))),
    }));
  };

  const handleLogStudyMinutes = (deltaMinutes: number) => {
    setStudyState((prev) => ({
      ...prev,
      dailyMinutesStudied: Math.max(0, (prev.dailyMinutesStudied || 0) + deltaMinutes),
    }));
  };

  const handleSelectTrack = (track: LearningTrack) => {
    setStudyState((prev) => {
      const nextState = { ...prev, learningTrack: track };
      syncToCloudBackup(nextState);
      return nextState;
    });
  };

  const handleSelectMajorFilter = (filter: MajorCurriculumFilter) => {
    setSelectedMajorFilter(filter);

    let nextTrack: LearningTrack = 'general';
    if (filter === 'accounting') nextTrack = 'accounting';
    else if (filter === 'finance') nextTrack = 'finance';
    else if (filter === 'markets') nextTrack = 'markets';
    else nextTrack = 'general';

    handleSelectTrack(nextTrack);

    const matchingNodes = CURRICULUM_LADDER.filter((n) => {
      if (filter === 'all') return true;
      if (filter === 'foundations') return n.track === 'general';
      return n.track === filter;
    });

    if (matchingNodes.length > 0) {
      setSelectedRungId(matchingNodes[0].id);
    }
  };

  const getFilterCounts = (filterId: MajorCurriculumFilter) => {
    const nodes = CURRICULUM_LADDER.filter((n) => {
      if (filterId === 'all') return true;
      if (filterId === 'foundations') return n.track === 'general';
      return n.track === filterId;
    });
    const topicCount = nodes.reduce((sum, n) => sum + (n.subtopics?.length || 0), 0);
    return { levelCount: nodes.length, topicCount };
  };

  const handleUpdateReminders = (enabled: boolean, time: string) => {
    setStudyState((prev) => {
      const nextState = {
        ...prev,
        reminderEnabled: enabled,
        reminderTime: time,
      };
      syncToCloudBackup(nextState);
      return nextState;
    });
  };

  const cardsMasteredCount = Object.values(studyState.sm2States).filter(
    (s) => s.interval >= 6
  ).length;

  const normalizedQuery = ladderSearchQuery.trim().toLowerCase();

  // Major Filter (Button selection is the 1st / major filter)
  const majorFilteredNodes = CURRICULUM_LADDER.filter((n) => {
    if (selectedMajorFilter === 'all') return true;
    if (selectedMajorFilter === 'foundations') return n.track === 'general';
    return n.track === selectedMajorFilter;
  });

  // Second Filter (Search bar is the 2nd filter) + Offline Saved toggle
  const visibleLadderNodes = majorFilteredNodes.filter((n) => {
    if (onlyOfflineSavedFilter && !studyState.savedTutorialIds.includes(n.id)) {
      return false;
    }
    if (!normalizedQuery) return true;
    const inTitle = n.title.toLowerCase().includes(normalizedQuery);
    const inSubtitle = n.subtitle.toLowerCase().includes(normalizedQuery);
    const inRule = n.literalCoreRule.toLowerCase().includes(normalizedQuery);
    const inSubtopics = (n.subtopics || []).some((st) =>
      st.toLowerCase().includes(normalizedQuery)
    );
    return inTitle || inSubtitle || inRule || inSubtopics;
  });

  const totalSubtopicsCount = visibleLadderNodes.reduce(
    (acc, node) => acc + (node.subtopics?.length || 0),
    0
  );

  const activeNode: LadderNode =
    visibleLadderNodes.find((n) => n.id === selectedRungId) ||
    visibleLadderNodes[0] ||
    CURRICULUM_LADDER[0];

  const getFilterSubtitle = () => {
    let base = 'From Business Math & Ledgers to ROI, Valuation, M&A & Strategic Finance';
    if (selectedMajorFilter === 'accounting') {
      base = 'Filtered to Accounting: Ledgers, Journals, Bookkeeping, Financial Statements & Cost Controls';
    } else if (selectedMajorFilter === 'finance') {
      base = 'Filtered to Corporate Finance: Financial Analysis, ROI, DCF Valuation, Modeling & M&A';
    } else if (selectedMajorFilter === 'markets') {
      base = 'Filtered to Market Study: Competitive Research, Financial Markets & Strategic Risk';
    } else if (selectedMajorFilter === 'foundations') {
      base = 'Filtered to Foundations: Business Math, Percentages, Margins & Excel Financial Skills';
    }
    if (normalizedQuery) {
      return `${base} · Matching "${ladderSearchQuery}"`;
    }
    return base;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      {/* Clean, Non-Intrusive Top Banner for Optional Premium Features */}
      {showPremiumBanner && (
        <div className="border-b border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 py-1.5 text-xs">
          <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
            <p className="text-[var(--text-secondary)] truncate">
              All core accounting & finance lessons are 100% free via OpenStax, SEC EDGAR & FRED.{' '}
              <button
                type="button"
                onClick={() => setShowPremiumInfoModal(true)}
                className="font-semibold text-[#C86D3B] hover:underline ml-1 cursor-pointer"
              >
                Explore Memo Plus (CPA/CFA Audit Cases & Teacher Cohort Export) →
              </button>
            </p>
            <button
              type="button"
              onClick={() => setShowPremiumBanner(false)}
              aria-label="Dismiss banner"
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-0.5 cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Bar Contract: Strictly 3 Zones (Wordmark | 5 Nav Links | Primary Actions) */}
      <header className="sticky top-0 z-30 border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)]/95 backdrop-blur-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('ladder');
            }}
            className="font-display text-lg font-semibold tracking-tight text-[var(--text-primary)] whitespace-nowrap shrink-0"
          >
            Memo Ledger
          </a>

          {/* Zone 2: 5 Single-Line Navigation Links */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Primary Navigation">
            {(
              [
                { id: 'ladder', label: 'Study Ladder' },
                { id: 'flashcards', label: 'Flashcards' },
                { id: 'scenarios', label: 'AI Scenarios' },
                { id: 'forum', label: 'Peer Forum' },
                { id: 'analytics', label: 'Analytics & Curriculum' },
              ] as { id: ActiveTab; label: string }[]
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                  activeTab === item.id
                    ? 'border-[#C86D3B] text-[var(--text-primary)] font-semibold'
                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hairline)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Actions (PWA Install, Dark Mode, Cloud Sync) */}
          <div className="flex items-center gap-2 shrink-0">
            <PWAInstallButton />

            <button
              type="button"
              onClick={() =>
                setStudyState((prev) => ({ ...prev, darkMode: !prev.darkMode }))
              }
              aria-label="Toggle warm dark mode"
              title="Toggle light/dark reading mode"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              {studyState.darkMode ? (
                <Sun className="w-4 h-4 text-[#E5A93B]" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {currentUser ? (
              <button
                type="button"
                onClick={signOutUser}
                title={`Cloud Sync Active (${currentUser.displayName || 'Student'}) — Click to sign out`}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:border-[#C86D3B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Cloud className="w-3.5 h-3.5 text-[#2E6F40] dark:text-[#4CA965]" />
                <span className="max-w-[96px] truncate">
                  {currentUser.displayName?.split(' ')[0] || 'Synced'}
                </span>
                <LogOut className="w-3 h-3 text-[var(--text-muted)]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={signInWithGoogle}
                className="flex items-center gap-1.5 rounded-lg bg-[#C86D3B] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#b55e2e] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>Cloud Backup</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Secondary Tab Bar */}
        <div className="flex md:hidden items-center overflow-x-auto border-t border-[var(--border-hairline)] px-4 py-1.5 gap-4">
          {(
            [
              { id: 'ladder', label: 'Study Ladder' },
              { id: 'flashcards', label: 'Flashcards' },
              { id: 'scenarios', label: 'AI Scenarios' },
              { id: 'forum', label: 'Peer Forum' },
              { id: 'analytics', label: 'Analytics' },
            ] as { id: ActiveTab; label: string }[]
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`text-xs font-medium whitespace-nowrap shrink-0 py-1 cursor-pointer ${
                activeTab === item.id
                  ? 'text-[#C86D3B] font-semibold underline underline-offset-4'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 space-y-10">
        {/* Welcome Bar with Memo the Finances Guru Owl */}
        <section className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <MemoOwl mood="welcoming" size="md" />
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)] font-mono tabular-nums">
                  <span>Memo, the Finances Guru</span>
                  <span aria-hidden="true">·</span>
                  <span>{studyState.xp} XP</span>
                  <span aria-hidden="true">·</span>
                  <span>{studyState.streakDays}-Day Streak</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {studyState.completedNodeIds.length}/{CURRICULUM_LADDER.length} Ladder Rungs
                  </span>
                </div>

                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">
                  Hoo there friend! my name is Memo, your accounting and finance guru. I will tell you a thing or two.
                </h1>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  No complex metaphors or expensive books, just your own path to accounting and finance literature.  From what is a Sale to real-world market analysis!
                </p>
              </div>
            </div>

            {/* Sweet & Welcoming Field Selector */}
            <div className="flex flex-col gap-2 shrink-0">
              <span className="text-xs font-medium text-[var(--text-muted)]">
                Choose your focus path anytime:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                {MAJOR_FILTER_OPTIONS.map((trackOption) => {
                  const isSelected = selectedMajorFilter === trackOption.id;
                  const { levelCount } = getFilterCounts(trackOption.id);
                  return (
                    <button
                      key={trackOption.id}
                      type="button"
                      onClick={() => handleSelectMajorFilter(trackOption.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left border cursor-pointer whitespace-nowrap flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'border-[#C86D3B] bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold shadow-xs'
                          : 'border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span className="truncate">{trackOption.label}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-[#C86D3B] text-white'
                            : 'bg-[var(--bg-surface)] text-[var(--text-muted)]'
                        }`}
                      >
                        {levelCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Tab 1: Progressive Study Ladder (Prime Cost -> Three Financial Statements -> Complex Triage) */}
        {activeTab === 'ladder' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 5 Columns: The Dynamic X-Level Progress Ladder */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2 flex-wrap">
                    <span>Complete {visibleLadderNodes.length}-Level Curriculum</span>
                    <span className="text-xs font-mono font-medium text-[#C86D3B] px-2.5 py-0.5 rounded-full bg-[#C86D3B]/10 border border-[#C86D3B]/20">
                      {totalSubtopicsCount} {totalSubtopicsCount === 1 ? 'Topic' : 'Topics'} Related
                    </span>
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {getFilterSubtitle()}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setOnlyOfflineSavedFilter((f) => !f)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium border transition-colors cursor-pointer shrink-0 ${
                    onlyOfflineSavedFilter
                      ? 'border-[#C86D3B] bg-[var(--bg-elevated)] text-[#C86D3B]'
                      : 'border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
                  }`}
                >
                  <DownloadCloud className="w-3.5 h-3.5" />
                  <span>
                    {onlyOfflineSavedFilter
                      ? `Saved (${studyState.savedTutorialIds.length})`
                      : 'Saved Only'}
                  </span>
                </button>
              </div>

              {/* 1. Major Filter (Domain Selection Buttons) */}
              <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[var(--text-primary)] flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-[#C86D3B]" />
                    <span>Major Filter: Select Domain</span>
                  </span>
                  {selectedMajorFilter !== 'all' && (
                    <button
                      type="button"
                      onClick={() => handleSelectMajorFilter('all')}
                      className="text-[11px] text-[#C86D3B] hover:underline cursor-pointer font-medium"
                    >
                      Reset to All (16 Levels)
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {MAJOR_FILTER_OPTIONS.map((opt) => {
                    const isSelected = selectedMajorFilter === opt.id;
                    const { levelCount, topicCount } = getFilterCounts(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectMajorFilter(opt.id)}
                        title={`${opt.description} (${topicCount} topics)`}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#C86D3B] text-white shadow-xs font-semibold'
                            : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)] border border-[var(--border-hairline)] hover:text-[var(--text-primary)] hover:border-[#C86D3B]/40'
                        }`}
                      >
                        <span>{opt.label}</span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                            isSelected
                              ? 'bg-black/25 text-white'
                              : 'bg-[var(--bg-surface)] text-[var(--text-muted)]'
                          }`}
                        >
                          {levelCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Second Filter: Search Bar across Topics */}
              <div className="space-y-1">
                <div className="text-[11px] text-[var(--text-muted)] font-medium flex items-center justify-between">
                  <span>Second Filter: Refine by Keyword</span>
                  {ladderSearchQuery && (
                    <span className="text-[#C86D3B] font-mono">
                      {visibleLadderNodes.length} {visibleLadderNodes.length === 1 ? 'level' : 'levels'} matched
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={ladderSearchQuery}
                    onChange={(e) => setLadderSearchQuery(e.target.value)}
                    placeholder={
                      selectedMajorFilter === 'all'
                        ? 'Search 250+ topics across all 16 levels (e.g., ROI, DuPont, T-accounts, XLOOKUP, LBO)...'
                        : `Search within ${visibleLadderNodes.length} ${selectedMajorFilter} levels (${totalSubtopicsCount} topics)...`
                    }
                    className="w-full rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] pl-9 pr-8 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-2 focus:outline-[#C86D3B]"
                  />
                  {ladderSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setLadderSearchQuery('')}
                      aria-label="Clear search"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3 max-h-[780px] overflow-y-auto pr-1">
                {visibleLadderNodes.length === 0 ? (
                  <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-8 text-center space-y-3">
                    <MemoOwl mood="thinking" size="md" />
                    <h3 className="font-display text-base font-semibold text-[var(--text-primary)]">
                      No levels found matching your filters
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
                      No levels in this domain match &ldquo;{ladderSearchQuery}&rdquo;. Try clearing your search keyword or switching domain buttons.
                    </p>
                    <div className="flex justify-center gap-2 pt-2">
                      {ladderSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setLadderSearchQuery('')}
                          className="rounded-lg bg-[#C86D3B] text-white px-3 py-1.5 text-xs font-semibold cursor-pointer"
                        >
                          Clear Search
                        </button>
                      )}
                      {selectedMajorFilter !== 'all' && (
                        <button
                          type="button"
                          onClick={() => handleSelectMajorFilter('all')}
                          className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--text-primary)] px-3 py-1.5 text-xs font-medium cursor-pointer"
                        >
                          Show All 16 Levels
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  visibleLadderNodes.map((node) => {
                    const isSelected = node.id === activeNode.id;
                    const isCompleted = studyState.completedNodeIds.includes(node.id);
                    const isSavedOffline = studyState.savedTutorialIds.includes(node.id);
                    const matchesTrack =
                      studyState.learningTrack === 'general' ||
                      node.track === studyState.learningTrack ||
                      node.track === 'general';

                    // Reorder subtopics if search query is active so matching topics appear first
                    const matchingSubtopics = (node.subtopics || []).filter((st) =>
                      normalizedQuery ? st.toLowerCase().includes(normalizedQuery) : false
                    );
                    const nonMatchingSubtopics = (node.subtopics || []).filter((st) =>
                      normalizedQuery ? !st.toLowerCase().includes(normalizedQuery) : true
                    );
                    const displaySubtopics = normalizedQuery
                      ? [...matchingSubtopics, ...nonMatchingSubtopics]
                      : (node.subtopics || []);

                    return (
                      <div
                        key={node.id}
                        onClick={() => setSelectedRungId(node.id)}
                        className={`relative rounded-2xl border p-5 transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-[#C86D3B] bg-[var(--bg-elevated)] shadow-xs'
                            : 'border-[var(--border-hairline)] bg-[var(--bg-surface)]/70 hover:bg-[var(--bg-elevated)]'
                        }`}
                      >
                        {/* Tiny, almost transparent "R" in the very corner */}
                        <ReferenceCornerBadge
                          reference={node.reference}
                          onSelect={setActiveReference}
                        />

                        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] pr-6">
                          <span className="font-mono font-semibold text-[#C86D3B]">
                            Level {String(node.rungNumber).padStart(2, '0')}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="capitalize">{node.track}</span>
                          <span aria-hidden="true">·</span>
                          <span>{node.subtopics?.length || 12} topics</span>
                          {matchesTrack && studyState.learningTrack !== 'general' && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-[#2E6F40] dark:text-[#4CA965] font-medium">
                                Selected Track
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="mt-1.5 font-display text-base font-semibold text-[var(--text-primary)]">
                          {node.title}
                        </h3>
                        <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
                          {node.subtitle}
                        </p>

                        {displaySubtopics && displaySubtopics.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-1">
                            {displaySubtopics.slice(0, 5).map((topic, tIdx) => {
                              const isMatch =
                                normalizedQuery &&
                                topic.toLowerCase().includes(normalizedQuery);
                              return (
                                <span
                                  key={tIdx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSubtopicForCard(topic);
                                    setActiveTab('flashcards');
                                  }}
                                  title="Click to generate an AI flashcard for this topic"
                                  className={`rounded-md border px-2 py-0.5 text-[11px] transition-colors hover:border-[#C86D3B] ${
                                    isMatch
                                      ? 'bg-[#C86D3B]/15 border-[#C86D3B]/40 text-[#C86D3B] font-medium'
                                      : 'bg-[var(--bg-canvas)] border-[var(--border-hairline)] text-[var(--text-secondary)]'
                                  }`}
                                >
                                  {topic}
                                </span>
                              );
                            })}
                            {displaySubtopics.length > 5 && (
                              <span className="px-1.5 py-0.5 text-[11px] font-mono text-[#C86D3B]">
                                +{displaySubtopics.length - 5} more
                              </span>
                            )}
                          </div>
                        )}

                        <div className="mt-3 pt-2.5 border-t border-[var(--border-hairline)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                          <span className="flex items-center gap-1.5">
                            {isCompleted ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6F40] dark:text-[#4CA965]" />
                                <span className="text-[#2E6F40] dark:text-[#4CA965] font-medium">
                                  Completed
                                </span>
                              </>
                            ) : (
                              <span>In Progress</span>
                            )}
                          </span>

                          {isSavedOffline && (
                            <span className="font-mono text-[11px] text-[var(--text-secondary)]">
                              Saved Offline
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right 7 Columns: Active Rung Interactive Literal Tutorial */}
            <div className="lg:col-span-7">
              <article className="relative rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-6 sm:p-9 space-y-7">
                {/* Tiny, almost transparent "R" in the very corner */}
                <ReferenceCornerBadge
                  reference={activeNode.reference}
                  onSelect={setActiveReference}
                />

                {/* Top Metadata & Offline Save Toggle */}
                <div className="flex flex-wrap items-center justify-between gap-3 pr-8 border-b border-[var(--border-hairline)] pb-4">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <span className="font-mono font-semibold text-[#C86D3B]">
                      Level {String(activeNode.rungNumber).padStart(2, '0')} of{' '}
                      {CURRICULUM_LADDER.length}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize font-medium">{activeNode.track}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeNode.difficulty}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeNode.estimatedMinutes} min read</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleOfflineSave(activeNode.id)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                      studyState.savedTutorialIds.includes(activeNode.id)
                        ? 'border-[#2E6F40] bg-[#2E6F40]/10 text-[#2E6F40] dark:text-[#4CA965]'
                        : 'border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>
                      {studyState.savedTutorialIds.includes(activeNode.id)
                        ? 'Saved for Offline Access'
                        : 'Save Tutorial Offline'}
                    </span>
                  </button>
                </div>

                {/* Title & Memo Quote */}
                <div className="space-y-3">
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">
                    {activeNode.title}
                  </h2>
                  <p className="text-sm italic text-[var(--text-secondary)] border-l-2 border-[#C86D3B] pl-3.5 py-0.5">
                    Memo: “{activeNode.memoVoiceNote}”
                  </p>
                </div>

                {/* Complete Level Subtopics Syllabus (Click any topic to create an AI Flashcard) */}
                {activeNode.subtopics && activeNode.subtopics.length > 0 && (
                  <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-xs font-semibold text-[var(--text-primary)]">
                        Complete Syllabus Covered in {activeNode.title} ({activeNode.subtopics.length} Topics)
                      </h3>
                      <span className="text-[11px] text-[#C86D3B] font-medium">
                        Click any topic to study or generate a Flashcard →
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeNode.subtopics.map((topic, idx) => {
                        const isMatch =
                          normalizedQuery &&
                          topic.toLowerCase().includes(normalizedQuery);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSelectedSubtopicForCard(topic);
                              setActiveTab('flashcards');
                            }}
                            className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                              isMatch
                                ? 'border-[#C86D3B] bg-[#C86D3B]/10 text-[var(--text-primary)] font-medium shadow-xs'
                                : 'border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:border-[#C86D3B]'
                            }`}
                          >
                            <span className="truncate">
                              <span className="font-mono text-[11px] text-[#C86D3B] mr-1.5">
                                {String(idx + 1).padStart(2, '0')}.
                              </span>
                              {topic}
                            </span>
                            <ArrowRight className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Literal Core Rule */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-[#C86D3B]">
                    The Plain-English Rule (Zero Analogies)
                  </h3>
                  <p className="text-base text-[var(--text-primary)] leading-relaxed">
                    {activeNode.literalCoreRule}
                  </p>
                </div>

                {/* Apples to Apples, Pears to Pears Comparison */}
                <div className="rounded-xl bg-[var(--bg-surface)] p-5 space-y-3.5">
                  <h3 className="font-display text-base font-semibold text-[var(--text-primary)]">
                    Apples to Apples · Pears to Pears Breakdown
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs leading-relaxed">
                    <div className="rounded-lg bg-[var(--bg-elevated)] p-3.5 border border-[var(--border-hairline)]">
                      <p className="text-[var(--text-primary)]">
                        {activeNode.applesToApplesBreakdown.itemA}
                      </p>
                    </div>
                    <div className="rounded-lg bg-[var(--bg-elevated)] p-3.5 border border-[var(--border-hairline)]">
                      <p className="text-[var(--text-primary)]">
                        {activeNode.applesToApplesBreakdown.itemB}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-[#2E6F40] dark:text-[#4CA965] font-medium">
                    Why it matters: {activeNode.applesToApplesBreakdown.plainTruth}
                  </p>
                </div>

                {/* Concrete Dollar Ledger Table */}
                <div className="rounded-xl border border-[var(--border-hairline)] overflow-hidden">
                  <div className="bg-[var(--bg-surface)] px-4 py-2.5 border-b border-[var(--border-hairline)] flex items-center justify-between text-xs">
                    <span className="font-semibold text-[var(--text-primary)]">
                      {activeNode.ledgerExample.header}
                    </span>
                    <span className="font-mono text-[var(--text-muted)]">
                      Exact Dollar Ledger
                    </span>
                  </div>
                  <div className="divide-y divide-[var(--border-hairline)]">
                    {activeNode.ledgerExample.rows.map((r, i) => (
                      <div
                        key={i}
                        className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                      >
                        <span className="font-medium text-[var(--text-primary)]">
                          {r.label}
                        </span>
                        <div className="flex items-center gap-4 sm:justify-end">
                          <span className="text-[var(--text-muted)]">{r.note}</span>
                          <span className="font-mono font-semibold tabular-nums text-[var(--text-primary)] min-w-[95px] text-right">
                            {r.amount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Takeaway Checklist */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-[var(--text-secondary)]">
                    Key Checklist Before Climbing to the Next Rung:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                    {activeNode.takeawayChecklist.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="font-mono text-[#C86D3B] font-semibold">
                          0{idx + 1}.
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Action Bar */}
                <div className="pt-4 border-t border-[var(--border-hairline)] flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleMasterNode(activeNode.id)}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                      studyState.completedNodeIds.includes(activeNode.id)
                        ? 'bg-[#2E6F40] text-white'
                        : 'bg-[#C86D3B] text-white hover:bg-[#b55e2e]'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {studyState.completedNodeIds.includes(activeNode.id)
                        ? 'Rung Mastered (Completed)'
                        : 'Mark Rung Mastered (+50 XP)'}
                    </span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('flashcards')}
                      className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[#C86D3B] flex items-center gap-1 cursor-pointer"
                    >
                      <span>Swipe Flashcards for this Rung</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('scenarios')}
                      className="text-xs font-semibold text-[#C86D3B] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Test with AI Scenario</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            </div>
          </div>
        )}

        {/* Tab 2: Swipeable Spaced-Repetition Flashcards */}
        {activeTab === 'flashcards' && (
          <FlashcardDeckView
            cards={flashcards}
            sm2States={studyState.sm2States}
            selectedTrack={studyState.learningTrack}
            onSelectTrack={handleSelectTrack}
            onRateCard={handleRateCard}
            onAddCustomCard={(newCard) =>
              setFlashcards((prev) => [newCard, ...prev])
            }
            onOpenReference={setActiveReference}
            initialCustomConcept={selectedSubtopicForCard}
          />
        )}

        {/* Tab 3: Interactive AI Scenarios */}
        {activeTab === 'scenarios' && (
          <ScenarioQuizView
            scenarios={scenarios}
            selectedTrack={studyState.learningTrack}
            onCompleteQuiz={handleCompleteQuiz}
            onAddGeneratedScenario={(newScen) =>
              setScenarios((prev) => [newScen, ...prev])
            }
            onOpenReference={setActiveReference}
          />
        )}

        {/* Tab 4: Community Peer Support Forum */}
        {activeTab === 'forum' && (
          <PeerForumView currentUser={currentUser} authReady={authReady} />
        )}

        {/* Tab 5: Real-Time Progress Analytics & Teacher Tasting Styles */}
        {activeTab === 'analytics' && (
          <AnalyticsAndTastingView
            xp={studyState.xp}
            streakDays={studyState.streakDays}
            cardsMastered={cardsMasteredCount}
            totalCards={flashcards.length}
            quizzesCompleted={studyState.quizzesCompleted}
            completedNodeIds={studyState.completedNodeIds}
            savedTutorialIds={studyState.savedTutorialIds}
            tastingScores={studyState.tastingScores}
            learningTrack={studyState.learningTrack}
            dailyMinutesGoal={studyState.dailyMinutesGoal ?? 20}
            dailyMinutesStudied={studyState.dailyMinutesStudied ?? 12}
            onUpdateDailyMinutesGoal={handleUpdateDailyMinutesGoal}
            onLogStudyMinutes={handleLogStudyMinutes}
            reminderEnabled={studyState.reminderEnabled}
            reminderTime={studyState.reminderTime}
            onUpdateReminders={handleUpdateReminders}
            onJumpToNode={(nodeId) => {
              setSelectedRungId(nodeId);
              setActiveTab('ladder');
            }}
            isCloudSynced={!!currentUser}
            lastSyncedAt={lastSyncedAt}
          />
        )}
      </main>

      {/* Reference Source & Further Reading Modal (Opened via the tiny "R" in the corner of any card) */}
      {activeReference && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setActiveReference(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-6 sm:p-7 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-mono text-[#C86D3B]">
                  Reference Citation [R] · Open Educational Source
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold text-[var(--text-primary)]">
                  {activeReference.sourceName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveReference(null)}
                className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] cursor-pointer"
                aria-label="Close reference modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-[var(--text-secondary)]">
              <p>
                <strong>Institution / Provider:</strong> {activeReference.organization}
              </p>
              <p>
                <strong>Section / Chapter:</strong> {activeReference.sectionTitle}
              </p>
              <p>
                <strong>Open License & API:</strong> {activeReference.licenseOrApi}
              </p>
            </div>

            <div className="rounded-xl bg-[var(--bg-surface)] p-4 space-y-2 text-xs">
              <p className="font-semibold text-[var(--text-primary)]">
                Primary Source Excerpt:
              </p>
              <p className="text-[var(--text-secondary)] italic leading-relaxed">
                “{activeReference.literalExcerpt}”
              </p>
              <p className="text-[#2E6F40] dark:text-[#4CA965] pt-1">
                <strong>Further Reading Tip:</strong> {activeReference.furtherReadingTip}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={activeReference.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C86D3B] hover:underline"
              >
                <span>Open Full Public Textbook / Filing</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setActiveReference(null)}
                className="rounded-lg bg-[var(--bg-surface)] px-4 py-2 text-xs font-medium text-[var(--text-primary)] hover:border-[#C86D3B] cursor-pointer"
              >
                Close & Continue Studying
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Non-Intrusive Memo Plus Info Modal */}
      {showPremiumInfoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setShowPremiumInfoModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-6 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <MemoOwl mood="celebrating" size="sm" />
                <div>
                  <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                    Memo Plus · Optional Exam & Classroom Suite
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Core finance & accounting courses remain 100% free forever.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPremiumInfoModal(false)}
                className="rounded-lg p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
              <li>• <strong>CPA & CFA Level I Multi-Exhibit Simulations:</strong> Full 10-K footnote auditing labs.</li>
              <li>• <strong>Teacher Classroom Cohort Dashboard:</strong> Export class-wide Pedagogical Tasting Style rubrics to CSV.</li>
              <li>• <strong>Bulk Offline Audio Packs:</strong> Listen to Memo’s sleepy-wise ledger walkthroughs on flights.</li>
            </ul>

            <button
              type="button"
              onClick={() => setShowPremiumInfoModal(false)}
              className="w-full rounded-lg bg-[#C86D3B] py-2.5 text-xs font-semibold text-white hover:bg-[#b55e2e] transition-colors cursor-pointer"
            >
              Continue Free Open-Source Study
            </button>
          </div>
        </div>
      )}

      {/* Quiet Footer with Open Educational Attribution */}
      <footer className="border-t border-[var(--border-hairline)] py-6 px-4 sm:px-6 text-xs text-[var(--text-muted)]">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Memo Ledger · Open Finance & Accounting Education · Sources: OpenStax (CC-BY 4.0), SEC EDGAR, Federal Reserve FRED, MIT OCW
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className="hover:text-[var(--text-primary)] cursor-pointer"
            >
              API & Source Credits
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className="hover:text-[var(--text-primary)] cursor-pointer"
            >
              Study Reminders ({studyState.reminderTime})
            </button>
          </div>
        </div>
      </footer>

      <OfflineIndicator />
    </div>
  );
}
