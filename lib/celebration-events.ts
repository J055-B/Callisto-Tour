// Dispatched by the admin-only "Test celebration" button on the leaderboard
// pages; listened to by LeaderChangeCelebration.tsx (in the root layout) to
// preview the leader-change video/message on demand, without waiting for a
// real leader change.
export const TEST_CELEBRATION_EVENT = 'callisto:test-leader-celebration'
