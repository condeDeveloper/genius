// DOM
const Render = {
  init() {
    this.pads = [...document.querySelectorAll('.pad')];
    this.display = document.getElementById('display');
    this.label = document.getElementById('label');
    this.best = document.getElementById('best');
    this.startBtn = document.getElementById('start');
  },
  light(pad, on) { this.pads[pad].classList.toggle('on', on); },
  allOff() { this.pads.forEach(p => p.classList.remove('on')); },
  enable(on) { this.pads.forEach(p => { p.disabled = !on; }); },
  show(text, err = false) { this.display.textContent = text; this.display.classList.toggle('err', err); },
  setLabel(t) { this.label.textContent = t; },
  bestText(n) { this.best.textContent = n ? `Melhor rodada: ${n}` : 'Sem recorde ainda'; },
  flashAll(times, ms) {
    return new Promise(res => {
      let i = 0;
      const tick = () => {
        this.pads.forEach(p => p.classList.toggle('on', i % 2 === 0));
        i++;
        if (i < times * 2) setTimeout(tick, ms); else { this.allOff(); res(); }
      };
      tick();
    });
  },
};
