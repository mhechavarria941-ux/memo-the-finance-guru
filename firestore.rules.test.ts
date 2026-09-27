/**
 * Firestore Security Rules Verification Suite
 * Verifies that all "Dirty Dozen" adversarial payloads return PERMISSION_DENIED.
 */

export interface DirtyDozenTestCase {
  id: number;
  name: string;
  collection: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  expectedResult: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_TESTS: DirtyDozenTestCase[] = [
  { id: 1, name: 'Identity Spoofing on UserProfile', collection: 'users', operation: 'create', expectedResult: 'PERMISSION_DENIED' },
  { id: 2, name: 'Unverified Email Write', collection: 'users', operation: 'create', expectedResult: 'PERMISSION_DENIED' },
  { id: 3, name: 'Shadow Field Injection on UserProfile', collection: 'users', operation: 'create', expectedResult: 'PERMISSION_DENIED' },
  { id: 4, name: 'Denial of Wallet / Oversized String', collection: 'forumPosts', operation: 'create', expectedResult: 'PERMISSION_DENIED' },
  { id: 5, name: 'ID Poisoning Attack', collection: 'forumPosts', operation: 'create', expectedResult: 'PERMISSION_DENIED' },
  { id: 6, name: 'Unbounded Array Exhaustion', collection: 'users', operation: 'update', expectedResult: 'PERMISSION_DENIED' },
  { id: 7, name: 'Array Type Poisoning', collection: 'users', operation: 'update', expectedResult: 'PERMISSION_DENIED' },
  { id: 8, name: 'Timestamp Forgery', collection: 'forumPosts', operation: 'create', expectedResult: 'PERMISSION_DENIED' },
  { id: 9, name: 'Immortal Field Mutation', collection: 'forumPosts', operation: 'update', expectedResult: 'PERMISSION_DENIED' },
  { id: 10, name: 'Arbitrary Vote Manipulation', collection: 'forumPosts', operation: 'update', expectedResult: 'PERMISSION_DENIED' },
  { id: 11, name: 'Cross-User Profile Read / Enumeration', collection: 'users', operation: 'get', expectedResult: 'PERMISSION_DENIED' },
  { id: 12, name: 'Update-Gap Value Poisoning', collection: 'forumPosts', operation: 'update', expectedResult: 'PERMISSION_DENIED' },
];
