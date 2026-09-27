import React, { useEffect, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  limit,
} from 'firebase/firestore';
import { MessageSquare, ThumbsUp, Send, Lock } from 'lucide-react';
import { User } from 'firebase/auth';
import {
  db,
  handleFirestoreError,
  OperationType,
  signInWithGoogle,
} from '../firebase';
import {
  INITIAL_FORUM_POSTS,
  LearningTrack,
  SeedForumPost,
} from '../data/curriculumData';
import { MemoOwl } from './MemoOwl';

interface PeerForumViewProps {
  currentUser: User | null;
  authReady: boolean;
}

export const PeerForumView: React.FC<PeerForumViewProps> = ({
  currentUser,
  authReady,
}) => {
  const [cloudPosts, setCloudPosts] = useState<SeedForumPost[]>([]);
  const [localUpvotedIds, setLocalUpvotedIds] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<LearningTrack | 'all'>('all');

  // New Post Form State
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<LearningTrack>('accounting');
  const [conceptTag, setConceptTag] = useState('Prime Cost');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  useEffect(() => {
    if (!authReady || !currentUser) {
      setCloudPosts([]);
      return;
    }

    const path = 'forumPosts';
    const q = query(
      collection(db, path),
      orderBy('createdAt', 'desc'),
      limit(30)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loaded: SeedForumPost[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            authorId: data.authorId || '',
            authorName: data.authorName || 'Student',
            title: data.title || '',
            body: data.body || '',
            category: (data.category as LearningTrack) || 'general',
            conceptTag: data.conceptTag || 'General',
            helpfulCount: typeof data.helpfulCount === 'number' ? data.helpfulCount : 0,
            createdAtLabel: 'Synced Live',
          };
        });
        setCloudPosts(loaded);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );

    return () => unsubscribe();
  }, [authReady, currentUser]);

  const combinedPosts = [...cloudPosts, ...INITIAL_FORUM_POSTS];
  const visiblePosts =
    filterCategory === 'all'
      ? combinedPosts
      : combinedPosts.filter((p) => p.category === filterCategory);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const cleanTitle = title.trim().slice(0, 160);
    const cleanBody = body.trim().slice(0, 2000);
    const cleanTag = conceptTag.trim().slice(0, 60) || 'Accounting';

    if (cleanTitle.length < 3 || cleanBody.length < 5) {
      setPostError('Please provide a clear title (min 3 chars) and explanation/question (min 5 chars).');
      return;
    }

    setIsSubmitting(true);
    setPostError(null);
    const postId = `post_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const path = `forumPosts/${postId}`;

    try {
      await setDoc(doc(db, 'forumPosts', postId), {
        authorId: currentUser.uid,
        authorName: (currentUser.displayName || 'Finance Student').slice(0, 80),
        title: cleanTitle,
        body: cleanBody,
        category,
        conceptTag: cleanTag,
        helpfulCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setTitle('');
      setBody('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelpfulVote = async (post: SeedForumPost) => {
    if (localUpvotedIds.includes(post.id)) return;
    setLocalUpvotedIds((prev) => [...prev, post.id]);

    // If it's a live cloud post and user is signed in, persist +1 in Firestore
    if (currentUser && !post.id.startsWith('seed-')) {
      const path = `forumPosts/${post.id}`;
      try {
        await updateDoc(doc(db, 'forumPosts', post.id), {
          helpfulCount: post.helpfulCount + 1,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left 8 Columns: Peer Discussions */}
      <div className="lg:col-span-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-hairline)] pb-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
              Peer Study Forum & Apples-to-Apples Notes
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Explain concepts in plain numbers to fellow students or ask for a literal breakdown.
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-[var(--bg-surface)] p-1">
            {(['all', 'accounting', 'finance', 'markets', 'general'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {visiblePosts.map((post) => {
            const isUpvoted = localUpvotedIds.includes(post.id);
            const displayCount =
              post.helpfulCount + (isUpvoted && post.id.startsWith('seed-') ? 1 : 0);

            return (
              <article
                key={post.id}
                className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-6 space-y-3"
              >
                <div className="flex items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#C86D3B] capitalize">
                      {post.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{post.conceptTag}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.authorName}</span>
                  </div>
                  <span>{post.createdAtLabel}</span>
                </div>

                <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                  {post.title}
                </h3>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {post.body}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-[var(--border-hairline)] text-xs">
                  <button
                    type="button"
                    onClick={() => handleHelpfulVote(post)}
                    className={`flex items-center gap-1.5 font-mono transition-colors cursor-pointer ${
                      isUpvoted
                        ? 'text-[#2E6F40] dark:text-[#4CA965] font-semibold'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({displayCount})</span>
                  </button>
                  <span className="text-[var(--text-muted)]">
                    Verified Literal Explanation
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Right 4 Columns: Share a Question or Literal Breakdown */}
      <div className="lg:col-span-4">
        <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 space-y-4">
          <div className="flex items-center gap-3">
            <MemoOwl mood="welcoming" size="sm" />
            <div>
              <h3 className="font-display text-base font-semibold text-[var(--text-primary)]">
                Post to Peer Forum
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Ask a study question or share an Apples-to-Apples tip.
              </p>
            </div>
          </div>

          {!currentUser ? (
            <div className="rounded-xl bg-[var(--bg-elevated)] p-4 space-y-3 border border-[var(--border-hairline)]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
                <Lock className="w-3.5 h-3.5 text-[#C86D3B]" />
                <span>Sign in to post & sync live</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                You can read all curated study notes offline anytime. Sign in with Google to post new questions to the live student cloud forum.
              </p>
              <button
                type="button"
                onClick={signInWithGoogle}
                className="w-full rounded-lg bg-[#C86D3B] py-2 text-xs font-semibold text-white hover:bg-[#b55e2e] transition-colors cursor-pointer"
              >
                Sign In with Google
              </button>
            </div>
          ) : (
            <form onSubmit={handleCreatePost} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Topic Track & Concept Tag
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as LearningTrack)}
                    className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-2.5 py-2 text-xs text-[var(--text-primary)]"
                  >
                    <option value="accounting">Accounting</option>
                    <option value="finance">Finance</option>
                    <option value="markets">Markets</option>
                    <option value="general">General</option>
                  </select>
                  <input
                    type="text"
                    value={conceptTag}
                    onChange={(e) => setConceptTag(e.target.value)}
                    placeholder="e.g., Prime Cost"
                    maxLength={60}
                    className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-2.5 py-2 text-xs text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Question or Note Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., How does prepaid rent affect the Balance Sheet?"
                  maxLength={160}
                  className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Literal Explanation or Question
                </label>
                <textarea
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write in plain numbers (apples to apples, pears to pears)..."
                  maxLength={2000}
                  className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-primary)]"
                />
              </div>

              {postError && (
                <p className="text-xs text-red-600 dark:text-red-400">{postError}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#C86D3B] py-2.5 text-xs font-semibold text-white hover:bg-[#b55e2e] disabled:opacity-50 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Posting to Forum...' : 'Publish Study Note'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
