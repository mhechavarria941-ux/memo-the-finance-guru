# Security Specification (`security_spec.md`)

## 1. Data Invariants & Relationship Mapping

1. **UserProfile (`/users/{userId}`)**:
   - **Master Source of Truth**: Document ID `{userId}` MUST strictly match `request.auth.uid` and `incoming().uid == userId`.
   - **PII & Isolation**: No email, phone, or physical address is stored in `/users/{userId}`. Access (`get`, `create`, `update`, `delete`) is strictly isolated to the authenticated owner (`request.auth.uid == userId`). `list` is completely denied (`allow list: if false;`) to prevent user enumeration.
   - **Bounded Arrays**: `completedNodeIds` and `savedTutorialIds` are bounded to `<= 50` items, and if non-empty, element `[0]` must be a bounded string (`<= 64` chars).
   - **Temporal Integrity**: `createdAt` must equal `request.time` on creation and remain immutable on update. `updatedAt` must equal `request.time` on creation and update.
   - **Verified Identity**: All writes require `request.auth.token.email_verified == true`.

2. **ForumPost (`/forumPosts/{postId}`)**:
   - **Ownership**: `incoming().authorId == request.auth.uid` on creation; `authorId` and `createdAt` are immutable on update.
   - **Action-Based Updates**:
     - *Action 1 (Author Edit)*: Only the original author (`existing().authorId == request.auth.uid`) can update `title`, `body`, `category`, `conceptTag`, and `updatedAt`.
     - *Action 2 (Peer Helpful Increment)*: Any verified signed-in user can increment `helpfulCount` by exactly `+1` along with `updatedAt == request.time`, using `affectedKeys().hasOnly(['helpfulCount', 'updatedAt'])`.
   - **Query Enforcement (`allow list`)**: `allow list` verifies `isSignedIn() && resource.data.helpfulCount >= 0 && resource.data.category in ['accounting', 'finance', 'markets', 'general']`.

---

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Payload 1 (Identity Spoofing on UserProfile)**: Authenticated user `uid_attacker` attempts to create `/users/uid_victim` or set `uid: "uid_victim"`. -> `PERMISSION_DENIED`.
2. **Payload 2 (Unverified Email Write)**: User with `email_verified: false` attempts to create a `UserProfile` or `ForumPost`. -> `PERMISSION_DENIED`.
3. **Payload 3 (Shadow Field Injection on UserProfile)**: Client sends valid `UserProfile` fields plus `"isAdmin": true`. Rejected by `.keys().hasOnly(...)`. -> `PERMISSION_DENIED`.
4. **Payload 4 (Denial of Wallet / Oversized String)**: Client sends a 50,000-character string in `ForumPost.body` (exceeds max 2000). -> `PERMISSION_DENIED`.
5. **Payload 5 (ID Poisoning Attack)**: Client attempts to create `/forumPosts/invalid$id!with*spaces`. Rejected by `isValidId(postId)`. -> `PERMISSION_DENIED`.
6. **Payload 6 (Unbounded Array Exhaustion)**: Client sends 500 items in `completedNodeIds` (exceeds max 50). -> `PERMISSION_DENIED`.
7. **Payload 7 (Array Type Poisoning)**: Client sends `[12345]` (number instead of string) in `savedTutorialIds`. Rejected by `data.savedTutorialIds[0] is string`. -> `PERMISSION_DENIED`.
8. **Payload 8 (Timestamp Forgery)**: Client supplies a past or future timestamp for `createdAt` or `updatedAt` instead of `request.time`. -> `PERMISSION_DENIED`.
9. **Payload 9 (Immortal Field Mutation)**: Author updates a `ForumPost` and attempts to mutate `createdAt` or `authorId`. -> `PERMISSION_DENIED`.
10. **Payload 10 (Arbitrary Vote Manipulation)**: User attempts to add `+500` to `helpfulCount` in a single update instead of `existing().helpfulCount + 1`. -> `PERMISSION_DENIED`.
11. **Payload 11 (Cross-User Profile Read / Enumeration)**: Authenticated user `uid_attacker` attempts `get` on `/users/uid_victim` or `list` on `/users`. -> `PERMISSION_DENIED`.
12. **Payload 12 (Update-Gap Value Poisoning)**: Author updates `ForumPost.title` to a boolean `true` or 5,000-char string during partial update. Blocked because `isValidForumPost(incoming())` wraps the entire `allow update` rule. -> `PERMISSION_DENIED`.
