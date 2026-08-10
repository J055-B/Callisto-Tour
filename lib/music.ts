// Placeholder audio (short test tones) — swap these files in
// public/audio/ for the real ones and this file doesn't need to change,
// as long as the filenames match. See MusicPlayer.tsx for how these are used.
export const ENTRANCE_THEME = '/audio/entrance-theme.mp3'

// Empty until Joss sends the real shuffle tracks — MusicPlayer.tsx handles
// this gracefully (just stops after the entrance theme, no crash/no
// leftover placeholder beeps). Add real filenames here once the files are
// dropped into public/audio/playlist/.
export const PLAYLIST: string[] = []
