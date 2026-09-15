# 🎵 Genius

O clássico jogo de memória de cores e sons (Simon), em HTML, CSS e JavaScript puro. Sem dependências, sem build.

**Jogar online:** https://condedeveloper.github.io/genius/

## Rodar local

```bash
npx serve -l 5192 .
```

## Como jogar

1. Clique em **Iniciar**
2. Observe a sequência de cores e sons
3. Repita na mesma ordem, clicando nos botões ou nas teclas `1` `2` `3` `4`
4. Cada rodada acrescenta um passo. Chegue à rodada 20 para vencer

## Funcionalidades

- Quatro tons senoidais afinados como no aparelho original (Mi, Dó, Lá, Mi grave)
- Som toca enquanto o botão está pressionado
- Reprodução acelera a partir das rodadas 6, 10 e 14
- Modo normal: errou, a sequência repete. **Modo rígido**: errou, acabou
- Tempo limite de 5 segundos por toque
- Display vermelho com contador de rodadas, melhor rodada no `localStorage`
- Evita três cores iguais seguidas

## Estrutura

```
js/config.js     # tons, velocidades
js/sequence.js   # sequência e verificação
js/audio.js      # tons contínuos com WebAudio
js/render.js     # DOM
js/game.js       # fluxo assíncrono do jogo
```

## Licença

MIT
