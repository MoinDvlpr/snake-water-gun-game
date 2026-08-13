import { useCallback, useRef } from 'react';

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio not available
  }
}

export function useSounds() {
  const enabledRef = useRef(true);

  const playSelect = useCallback(() => {
    if (!enabledRef.current) return;
    playTone(600, 0.08, 'sine', 0.1);
  }, []);

  const playWin = useCallback(() => {
    if (!enabledRef.current) return;
    playTone(523, 0.12, 'sine', 0.12);
    setTimeout(() => playTone(659, 0.12, 'sine', 0.12), 100);
    setTimeout(() => playTone(784, 0.2, 'sine', 0.15), 200);
  }, []);

  const playLose = useCallback(() => {
    if (!enabledRef.current) return;
    playTone(300, 0.15, 'sawtooth', 0.08);
    setTimeout(() => playTone(200, 0.3, 'sawtooth', 0.06), 150);
  }, []);

  const playDraw = useCallback(() => {
    if (!enabledRef.current) return;
    playTone(440, 0.15, 'triangle', 0.1);
  }, []);

  const playCountdown = useCallback(() => {
    if (!enabledRef.current) return;
    playTone(880, 0.05, 'sine', 0.06);
  }, []);

  return { playSelect, playWin, playLose, playDraw, playCountdown };
}
