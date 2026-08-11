// Shared by IntroGate.tsx (sets the role on login), Sidebar.tsx (Logout),
// and anywhere else that needs to know/react to admin vs guest — e.g. the
// admin-only TEST MODE panel on /map and the admin-only "test celebration"
// button on the leaderboard.
export const ROLE_STORAGE_KEY = 'callisto:role'
export const ROLE_CHANGED_EVENT = 'callisto:role-changed'

// Same values IntroGate.tsx checks at login — centralized here so the
// editable-content API route (app/api/content/route.ts) can verify the
// same password server-side before saving an edit. As noted elsewhere,
// this is a casual gate, not real auth: it ships inside the client bundle,
// so anyone who opens dev tools can read it. Good enough to stop someone
// from stumbling into admin actions by accident; not a defense against
// someone who goes looking.
export const ADMIN_USER = 'Admin'
export const ADMIN_PASS = 'Callisto2026'

export function getRole(): 'admin' | 'guest' {
  if (typeof window === 'undefined') return 'guest'
  return localStorage.getItem(ROLE_STORAGE_KEY) === 'admin' ? 'admin' : 'guest'
}

export function clearRole() {
  localStorage.removeItem(ROLE_STORAGE_KEY)
  window.dispatchEvent(new Event(ROLE_CHANGED_EVENT))
}
