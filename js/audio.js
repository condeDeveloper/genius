// Tons contínuos por botão, com início e fim controlados
const Sound = (() => {
  let ctx, current = null;
  function ensure() { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); return ctx; }

  return {
    // liga o tom do botão até stop() ser chamado
    start(pad) {
      try {
        const c = ensure();
        this.stop();
        const o = c.createOscillator(), g = c.createGain();
        o.type = 'sine'; o.frequency.value = TONES[pad];
        g.gain.setValueAtTime(0.0001, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.12, c.currentTime + 0.02);
        o.connect(g).connect(c.destination); o.start();
        current = { o, g };
      } catch (_) {}
    },
    stop() {
      if (!current) return;
      try {
        const { o, g } = current, c = ensure();
        g.gain.cancelScheduledValues(c.currentTime);
        g.gain.setValueAtTime(g.gain.value, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.05);
        o.stop(c.currentTime + 0.06);
      } catch (_) {}
      current = null;
    },
    error() {
      try {
        const c = ensure();
        const o = c.createOscillator(), g = c.createGain();
        o.type = 'sawtooth'; o.frequency.value = ERROR_TONE;
        g.gain.setValueAtTime(0.1, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.6);
        o.connect(g).connect(c.destination); o.start(); o.stop(c.currentTime + 0.6);
      } catch (_) {}
    },
    win() {
      [0, 1, 2, 3, 0, 1, 2, 3].forEach((p, i) => { setTimeout(() => this.start(p), i * 90); setTimeout(() => this.stop(), i * 90 + 80); });
    },
  };
})();
