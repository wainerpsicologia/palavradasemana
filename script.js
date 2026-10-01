/* =========================
   CONFIGURAÇÕES DO JOGO
========================= */

const PALAVRA = "YOUNG";
const TAMANHO = PALAVRA.length;
const MAX_TENTATIVAS = 6;

let tentativaAtual = 0;
let palavraDigitada = "";
let jogoFinalizado = false;


/* =========================
   ELEMENTOS
========================= */

const tabuleiro = document.getElementById("tabuleiro");
const teclado = document.getElementById("teclado");
const mensagem = document.getElementById("mensagem");
const reiniciar = document.getElementById("reiniciar");


/* =========================
   MODAL COMO JOGAR
========================= */

const modalTutorial = document.getElementById("modalTutorial");
const abrirTutorial = document.getElementById("abrirTutorial");
const fecharTutorial = document.getElementById("fecharTutorial");
const entendiTutorial = document.getElementById("entendiTutorial");


function mostrarTutorial() {
  modalTutorial.classList.add("ativo");
}


function esconderTutorial() {
  modalTutorial.classList.remove("ativo");
}


abrirTutorial.addEventListener("click", mostrarTutorial);
fecharTutorial.addEventListener("click", esconderTutorial);
entendiTutorial.addEventListener("click", esconderTutorial);


modalTutorial.addEventListener("click", function(evento) {

  if (evento.target === modalTutorial) {
    esconderTutorial();
  }

});


/* =========================
   MODAL DICA
========================= */

const modalDica = document.getElementById("modalDica");
const abrirDica = document.getElementById("abrirDica");
const fecharDica = document.getElementById("fecharDica");
const entendiDica = document.getElementById("entendiDica");


function mostrarDica() {
  modalDica.classList.add("ativo");
}


function esconderDica() {
  modalDica.classList.remove("ativo");
}


abrirDica.addEventListener("click", mostrarDica);
fecharDica.addEventListener("click", esconderDica);
entendiDica.addEventListener("click", esconderDica);


modalDica.addEventListener("click", function(evento) {

  if (evento.target === modalDica) {
    esconderDica();
  }

});


/* =========================
   ESC FECHA OS MODAIS
========================= */

document.addEventListener("keydown", function(evento) {

  if (evento.key === "Escape") {

    esconderTutorial();
    esconderDica();

  }

});


/* =========================
   CRIAR TABULEIRO
========================= */

function criarTabuleiro() {

  tabuleiro.innerHTML = "";

  for (let linha = 0; linha < MAX_TENTATIVAS; linha++) {

    const elementoLinha = document.createElement("div");

    elementoLinha.classList.add("linha");

    for (let coluna = 0; coluna < TAMANHO; coluna++) {

      const letra = document.createElement("div");

      letra.classList.add("letra");

      elementoLinha.appendChild(letra);

    }

    tabuleiro.appendChild(elementoLinha);

  }

}


/* =========================
   CRIAR TECLADO
========================= */

const linhasTeclado = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"]
];


function criarTeclado() {

  teclado.innerHTML = "";

  linhasTeclado.forEach(linha => {

    const linhaElemento = document.createElement("div");

    linhaElemento.classList.add("linha-teclado");

    linha.forEach(tecla => {

      const botao = document.createElement("button");

      botao.classList.add("tecla");

      botao.textContent = tecla;

      botao.dataset.tecla = tecla;

      if (tecla === "ENTER") {
        botao.classList.add("tecla-enter");
      }

      if (tecla === "⌫") {
        botao.classList.add("tecla-apagar");
      }

      botao.addEventListener("click", function() {
        processarTecla(tecla);
      });

      linhaElemento.appendChild(botao);

    });

    teclado.appendChild(linhaElemento);

  });

}


/* =========================
   ATUALIZAR LINHA
========================= */

function atualizarLinha() {

  const linha = tabuleiro.children[tentativaAtual];

  const letras = linha.children;

  for (let i = 0; i < TAMANHO; i++) {

    letras[i].textContent = palavraDigitada[i] || "";

  }

}


/* =========================
   DIGITAR
========================= */

function adicionarLetra(letra) {

  if (jogoFinalizado) {
    return;
  }

  if (palavraDigitada.length >= TAMANHO) {
    return;
  }

  palavraDigitada += letra;

  atualizarLinha();

}


/* =========================
   APAGAR
========================= */

function apagarLetra() {

  if (jogoFinalizado) {
    return;
  }

  palavraDigitada = palavraDigitada.slice(0, -1);

  atualizarLinha();

}


/* =========================
   VERIFICAR TENTATIVA
========================= */

function verificarTentativa() {

  if (jogoFinalizado) {
    return;
  }

  if (palavraDigitada.length !== TAMANHO) {

    mensagem.textContent =
      `Digite uma palavra com ${TAMANHO} letras.`;

    return;

  }

  mensagem.textContent = "";

  const linha =
    tabuleiro.children[tentativaAtual];

  const resultado =
    new Array(TAMANHO).fill("incorreta");

  const letrasDisponiveis =
    PALAVRA.split("");


  /* PRIMEIRO: LETRAS CERTAS */

  for (let i = 0; i < TAMANHO; i++) {

    if (palavraDigitada[i] === PALAVRA[i]) {

      resultado[i] = "correta";

      letrasDisponiveis[i] = null;

    }

  }


  /* SEGUNDO: LETRAS NA POSIÇÃO ERRADA */

  for (let i = 0; i < TAMANHO; i++) {

    if (resultado[i] === "correta") {
      continue;
    }

    const indice =
      letrasDisponiveis.indexOf(
        palavraDigitada[i]
      );

    if (indice !== -1) {

      resultado[i] = "posicao-errada";

      letrasDisponiveis[indice] = null;

    }

  }


  /* APLICAR CORES */

  for (let i = 0; i < TAMANHO; i++) {

    linha.children[i]
      .classList.add(resultado[i]);

    atualizarTeclado(
      palavraDigitada[i],
      resultado[i]
    );

  }


  /* GANHOU */

  if (palavraDigitada === PALAVRA) {

    mensagem.textContent =
      "Você acertou! 🎉";

    jogoFinalizado = true;

    return;

  }


  tentativaAtual++;

  palavraDigitada = "";


  /* PERDEU */

  if (tentativaAtual >= MAX_TENTATIVAS) {

    mensagem.textContent =
      `A palavra era ${PALAVRA}.`;

    jogoFinalizado = true;

  }

}


/* =========================
   ATUALIZAR TECLADO
========================= */

function atualizarTeclado(
  letra,
  resultado
) {

  const tecla =
    document.querySelector(
      `[data-tecla="${letra}"]`
    );

  if (!tecla) {
    return;
  }


  const prioridade = {
    "incorreta": 1,
    "posicao-errada": 2,
    "correta": 3
  };


  const estadoAtual =
    tecla.dataset.estado;


  if (
    !estadoAtual ||
    prioridade[resultado] >
    prioridade[estadoAtual]
  ) {

    tecla.classList.remove(
      "correta",
      "posicao-errada",
      "incorreta"
    );

    tecla.classList.add(resultado);

    tecla.dataset.estado = resultado;

  }

}


/* =========================
   PROCESSAR TECLA
========================= */

function processarTecla(tecla) {

  if (tecla === "ENTER") {

    verificarTentativa();

    return;

  }


  if (tecla === "⌫") {

    apagarLetra();

    return;

  }


  adicionarLetra(tecla);

}


/* =========================
   TECLADO FÍSICO
========================= */

document.addEventListener(
  "keydown",
  function(evento) {

    if (
      modalTutorial.classList.contains("ativo") ||
      modalDica.classList.contains("ativo")
    ) {
      return;
    }


    const tecla =
      evento.key.toUpperCase();


    if (/^[A-Z]$/.test(tecla)) {

      adicionarLetra(tecla);

    }


    if (evento.key === "Backspace") {

      apagarLetra();

    }


    if (evento.key === "Enter") {

      verificarTentativa();

    }

  }
);


/* =========================
   REINICIAR
========================= */

function reiniciarJogo() {

  tentativaAtual = 0;

  palavraDigitada = "";

  jogoFinalizado = false;

  mensagem.textContent = "";

  criarTabuleiro();

  criarTeclado();

}


reiniciar.addEventListener(
  "click",
  reiniciarJogo
);


/* =========================
   INICIAR
========================= */

criarTabuleiro();
criarTeclado();
