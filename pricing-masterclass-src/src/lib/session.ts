/** Stored classroom state: results-wall submissions, challenge room code, and the saved slide position. */
const EPOCH = '2026-11-18'

export function resetClassData() {
  try {
    Object.keys(localStorage).filter((k) => k.startsWith('subs:')).forEach((k) => localStorage.removeItem(k))
  } catch { /* ignore */ }
  try {
    sessionStorage.removeItem('challengeRoom')
    Object.keys(sessionStorage).filter((k) => /^deck:.*:index$/.test(k)).forEach((k) => sessionStorage.removeItem(k))
  } catch { /* ignore */ }
}

/** One-time clean slate: data saved in this browser before EPOCH belongs to an earlier class. */
export function purgeOldClass() {
  try {
    if (localStorage.getItem('deck:epoch') !== EPOCH) {
      resetClassData()
      localStorage.setItem('deck:epoch', EPOCH)
    }
  } catch { /* ignore */ }
}
