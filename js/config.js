// Constantes
const PADS = 4;
const TONES = [329.63, 261.63, 220.0, 164.81]; // Mi4, Dó4, Lá3, Mi3 (verde, vermelho, amarelo, azul)
const ERROR_TONE = 80;
const BEST_KEY = 'genius-best';
const WIN_ROUND = 20;

// Velocidade da reprodução conforme a rodada: [até rodada, ms aceso, ms pausa]
const SPEEDS = [
  [5, 500, 250],
  [9, 380, 190],
  [13, 300, 150],
  [Infinity, 220, 120],
];
function speedFor(round) {
  const s = SPEEDS.find(([max]) => round <= max);
  return { on: s[1], off: s[2] };
}
