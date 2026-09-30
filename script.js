const palavraDoDia = "MENTE";

const maxTentativas = 6;

let tentativaAtual = 0;

const tabuleiro = document.getElementById("tabuleiro");
const mensagem = document.getElementById("mensagem");

function criarTabuleiro() {
  tabuleiro.innerHTML = "";

  for (let i = 0; i < maxTentativas; i++) {
    const linha = document.createElement("div");
    linha.classList.add("linha");

    for (let j = 0; j < palavraDoDia.length; j++) {
      const letra = document.createElement("div");
      letra.classList.add("letra");
      linha.appendChild(letra);
    }

    tabuleiro.appendChild(linha);
  }
}

criarTabuleiro();

document.addEventListener("keydown", controlarTeclado);

let palavraDigitada = "";

function controlarTeclado(evento) {
  if (tentativaAtual >= maxTentativas) return;

  if (evento.key === "Backspace") {
    palavraDigitada = palavraDigitada.slice(0, -1);
    atualizarLinha();
    return;
  }

  if (evento.key === "Enter") {
    verificarPalavra();
    return;
  }

  if (
    /^[a-zA-ZÀ-ÿ]$/.test(evento.key) &&
    palavraDigitada.length < palavraDoDia.length
  ) {
    palavraDigitada += evento.key.toUpperCase();
    atualizarLinha();
  }
}

function atualizarLinha() {
  const linha = tabuleiro.children[tentativaAtual];
  const letras = linha.children;

  for (let i = 0; i < letras.length; i++) {
    letras[i].textContent = palavraDigitada[i] || "";
  }
}

function verificarPalavra() {
  if (palavraDigitada.length !== palavraDoDia.length) {
    mensagem.textContent = "Digite uma palavra completa.";
    return;
  }

  const linha = tabuleiro.children[tentativaAtual];
  const letras = linha.children;

  for (let i = 0; i < palavraDoDia.length; i++) {
    if (palavraDigitada[i] === palavraDoDia[i]) {
      letras[i].classList.add("correta");
    } else if (palavraDoDia.includes(palavraDigitada[i])) {
      letras[i].classList.add("posicao-errada");
    } else {
      letras[i].classList.add("incorreta");
    }
  }

  if (palavraDigitada === palavraDoDia) {
    mensagem.textContent = "🎉 Você acertou a palavra do dia!";

    document.removeEventListener(
      "keydown",
      controlarTeclado
    );

    return;
  }

  tentativaAtual++;
  palavraDigitada = "";

  if (tentativaAtual === maxTentativas) {
    mensagem.textContent = `A palavra era: ${palavraDoDia}`;
  }
}

document
  .getElementById("reiniciar")
  .addEventListener("click", () => {
    tentativaAtual = 0;
    palavraDigitada = "";
    mensagem.textContent = "";

    document.addEventListener(
      "keydown",
      controlarTeclado
    );

    criarTabuleiro();
  });
