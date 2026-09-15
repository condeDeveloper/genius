// Fluxo: reproduzir sequência → esperar jogador → acrescentar passo
const sleep = ms => new Promise(r => setTimeout(r, ms));

class Game {
  constructor() {
    Render.init();
    this.seq = new Sequence();
    this.state = 'idle'; // idle | playing (mostrando) | input | over
    this.best = Number(localStorage.getItem(BEST_KEY) || 0);
    this.strict = false;
    Render.bestText(this.best);
    Render.enable(false);
    this.bind();
  }

  bind() {
    Render.startBtn.addEventListener('click', () => this.start());
    document.getElementById('strict').addEventListener('change', e => { this.strict = e.target.checked; });
    Render.pads.forEach((p, i) => {
      p.addEventListener('pointerdown', e => { e.preventDefault(); this.press(i); });
      p.addEventListener('pointerup', () => this.release(i));
      p.addEventListener('pointerleave', () => this.release(i));
    });
    window.addEventListener('keydown', e => {
      const n = Number(e.key);
      if (n >= 1 && n <= 4 && !e.repeat) this.press(n - 1);
      if (e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); if (this.state === 'idle' || this.state === 'over') this.start(); }
    });
    window.addEventListener('keyup', e => { const n = Number(e.key); if (n >= 1 && n <= 4) this.release(n - 1); });
  }

  async start() {
    if (this.state === 'playing') return;
    this.seq = new Sequence();
    this.state = 'playing';
    Render.setLabel('Prepare-se');
    await Render.flashAll(2, 150);
    this.nextRound();
  }

  async nextRound() {
    this.seq.extend();
    Render.show(String(this.seq.round).padStart(2, '0'));
    Render.setLabel('Observe');
    Render.enable(false);
    this.state = 'playing';
    const { on, off } = speedFor(this.seq.round);
    await sleep(400);
    for (const pad of this.seq.steps) {
      if (this.state !== 'playing') return;
      Render.light(pad, true); Sound.start(pad);
      await sleep(on);
      Render.light(pad, false); Sound.stop();
      await sleep(off);
    }
    Render.setLabel('Sua vez');
    Render.enable(true);
    this.state = 'input';
    this.armTimeout();
  }

  // O jogador tem alguns segundos para cada toque
  armTimeout() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => { if (this.state === 'input') this.mistake(); }, 5000);
  }

  press(pad) {
    if (this.state !== 'input' || this.held !== undefined) return;
    this.held = pad;
    Render.light(pad, true); Sound.start(pad);
  }

  async release(pad) {
    if (this.held !== pad) return;
    this.held = undefined;
    Render.light(pad, false); Sound.stop();
    if (this.state !== 'input') return;
    const r = this.seq.input(pad);
    if (r === 'wrong') return this.mistake();
    this.armTimeout();
    if (r === 'done') {
      clearTimeout(this.timeout);
      this.state = 'playing';
      Render.enable(false);
      if (this.seq.round > this.best) { this.best = this.seq.round; localStorage.setItem(BEST_KEY, this.best); Render.bestText(this.best); }
      if (this.seq.round >= WIN_ROUND) return this.win();
      await sleep(600);
      this.nextRound();
    }
  }

  async mistake() {
    clearTimeout(this.timeout);
    this.state = 'playing';
    Render.enable(false);
    Sound.error();
    Render.show('!!', true);
    await Render.flashAll(3, 120);
    if (this.strict) return this.gameOver();
    // modo normal: repete a mesma sequência
    Render.setLabel('De novo');
    this.seq.restart();
    await sleep(500);
    Render.show(String(this.seq.round).padStart(2, '0'));
    Render.setLabel('Observe');
    const { on, off } = speedFor(this.seq.round);
    this.state = 'playing';
    for (const pad of this.seq.steps) {
      Render.light(pad, true); Sound.start(pad); await sleep(on);
      Render.light(pad, false); Sound.stop(); await sleep(off);
    }
    Render.setLabel('Sua vez');
    Render.enable(true);
    this.state = 'input';
    this.armTimeout();
  }

  gameOver() {
    this.state = 'over';
    Render.show(String(this.seq.round).padStart(2, '0'), true);
    Render.setLabel('Fim de jogo');
    Render.enable(false);
  }

  async win() {
    this.state = 'over';
    Render.show('WIN');
    Render.setLabel('Você venceu!');
    Sound.win();
    await Render.flashAll(6, 90);
  }
}

window.addEventListener('DOMContentLoaded', () => { window.game = new Game(); });
