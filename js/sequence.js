// Sequência de cores e verificação da entrada do jogador
class Sequence {
  constructor() { this.steps = []; this.pos = 0; }
  get round() { return this.steps.length; }

  // Acrescenta um passo aleatório, evitando três iguais seguidos para não ficar monótono
  extend() {
    let n;
    do { n = Math.floor(Math.random() * PADS); }
    while (this.steps.length >= 2 && this.steps.at(-1) === n && this.steps.at(-2) === n);
    this.steps.push(n);
    this.pos = 0;
  }

  // Verifica a próxima entrada. Retorna 'ok' | 'done' | 'wrong'
  input(pad) {
    if (pad !== this.steps[this.pos]) return 'wrong';
    this.pos++;
    return this.pos === this.steps.length ? 'done' : 'ok';
  }

  restart() { this.pos = 0; }
}
