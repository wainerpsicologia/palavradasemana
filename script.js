const palavraDoDia = "ESQUEMA";

const maxTentativas = 6;

let tentativaAtual = 0;

let palavraDigitada = "";

let jogoFinalizado = false;

const tabuleiro =
  document.getElementById("tabuleiro");

const mensagem =
  document.getElementById("mensagem");

const teclado =
  document.getElementById("teclado");


/* =========================
   CRIAR TABULEIRO
========================= */

function criarTabuleiro() {

  tabuleiro.innerHTML = "";

  for (let i = 0; i < maxTentativas; i++) {

    const linha =
      document.createElement("div");

    linha.classList.add("linha");

    for (
      let j = 0;
      j < palavraDoDia.length;
      j++
    ) {

      const letra =
        document.createElement("div");

      letra.classList.add("letra");

      linha.appendChild(letra);
    }

    tabuleiro.appendChild(linha);
  }
}


/* =========================
   CRIAR TECLADO
========================= */

const linhasTeclado = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","⌫"]
];

function criarTeclado() {

  teclado.innerHTML = "";

  linhasTeclado.forEach((linhaLetras) => {

    const linha =
      document.createElement("div");

    linha.classList.add("linha-teclado");

    linhaLetras.forEach((letra) => {

      const tecla =
        document.createElement("button");

      tecla.textContent = letra;

      tecla.classList.add("tecla");

      tecla.dataset.tecla = letra;

      if (letra === "ENTER") {

        tecla.classList.add(
          "tecla-enter"
        );
      }

      if (letra === "⌫") {

        tecla.classList.add(
          "tecla-apagar"
        );
      }

      tecla.addEventListener(
        "click",
        () => clicarTecla(letra)
      );

      linha.appendChild(tecla);
    });

    teclado.appendChild(linha);
  });
}


/* =========================
   CLIQUE NO TECLADO
========================= */

function clicarTecla(tecla) {

  if (jogoFinalizado) return;

  if (tecla === "ENTER") {

    verificarPalavra();

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
  controlarTeclado
);

function controlarTeclado(evento) {

  if (jogoFinalizado) return;

  if (evento.key === "Backspace") {

    apagarLetra();

    return;
  }

  if (evento.key === "Enter") {

    verificarPalavra();

    return;
  }

  if (
    /^[a-zA-ZÀ-ÿ]$/.test(evento.key)
  ) {

    adicionarLetra(
      evento.key.toUpperCase()
    );
  }
}


/* =========================
   ADICIONAR LETRA
========================= */

function adicionarLetra(letra) {

  if (
    palavraDigitada.length >=
    palavraDoDia.length
  ) {
    return;
  }

  palavraDigitada += letra;

  atualizarLinha();
}


/* =========================
   APAGAR LETRA
========================= */

function apagarLetra() {

  palavraDigitada =
    palavraDigitada.slice(0, -1);

  atualizarLinha();
}


/* =========================
   ATUALIZAR LINHA
========================= */

function atualizarLinha() {

  const linha =
    tabuleiro.children[
      tentativaAtual
    ];

  if (!linha) return;

  const letras =
    linha.children;

  for (
    let i = 0;
    i < letras.length;
    i++
  ) {

    letras[i].textContent =
      palavraDigitada[i] || "";
  }
}


/* =========================
   VERIFICAR PALAVRA
========================= */

function verificarPalavra() {

  if (jogoFinalizado) return;

  if (
    palavraDigitada.length !==
    palavraDoDia.length
  ) {

    mensagem.textContent =
      "Digite uma palavra com 7 letras.";

    return;
  }

  mensagem.textContent = "";

  const linha =
    tabuleiro.children[
      tentativaAtual
    ];

  const letras =
    linha.children;

  const resultado =
    Array(
      palavraDoDia.length
    ).fill("incorreta");

  const letrasDisponiveis =
    palavraDoDia.split("");


  /* PRIMEIRO:
     LETRAS NO LUGAR CERTO
  */

  for (
    let i = 0;
    i < palavraDoDia.length;
    i++
  ) {

    if (
      palavraDigitada[i] ===
      palavraDoDia[i]
    ) {

      resultado[i] = "correta";

      letrasDisponiveis[i] = null;
    }
  }


  /* DEPOIS:
     LETRAS CERTAS
     NO LUGAR ERRADO
  */

  for (
    let i = 0;
    i < palavraDoDia.length;
    i++
  ) {

    if (
      resultado[i] === "correta"
    ) {
      continue;
    }

    const indice =
      letrasDisponiveis.indexOf(
        palavraDigitada[i]
      );

    if (indice !== -1) {

      resultado[i] =
        "posicao-errada";

      letrasDisponiveis[indice] =
        null;
    }
  }


  /* APLICAR CORES */

  for (
    let i = 0;
    i < resultado.length;
    i++
  ) {

    letras[i].classList.add(
      resultado[i]
    );

    atualizarCorTeclado(
      palavraDigitada[i],
      resultado[i]
    );
  }


  /* ACERTOU */

  if (
    palavraDigitada ===
    palavraDoDia
  ) {

    mensagem.textContent =
      "🎉 Você acertou a palavra do dia!";

    jogoFinalizado = true;

    return;
  }


  tentativaAtual++;

  palavraDigitada = "";


  /* ACABARAM AS TENTATIVAS */

  if (
    tentativaAtual >=
    maxTentativas
  ) {

    mensagem.textContent =
      `A palavra era: ${palavraDoDia}`;

    jogoFinalizado = true;
  }
}


/* =========================
   COR DAS TECLAS
========================= */

function atualizarCorTeclado(
  letra,
  resultado
) {

  const tecla =
    document.querySelector(
      `[data-tecla="${letra}"]`
    );

  if (!tecla) return;


  /*
    PRIORIDADE:

    VERDE
    ↓
    AMARELO
    ↓
    CINZA
  */

  if (
    tecla.classList.contains(
      "correta"
    )
  ) {

    return;
  }


  if (
    resultado === "correta"
  ) {

    tecla.classList.remove(
      "posicao-errada",
      "incorreta"
    );

    tecla.classList.add(
      "correta"
    );

    return;
  }


  if (
    resultado ===
    "posicao-errada"
  ) {

    if (
      !tecla.classList.contains(
        "correta"
      )
    ) {

      tecla.classList.remove(
        "incorreta"
      );

      tecla.classList.add(
        "posicao-errada"
      );
    }

    return;
  }


  if (
    resultado === "incorreta"
  ) {

    if (
      !tecla.classList.contains(
        "correta"
      ) &&
      !tecla.classList.contains(
        "posicao-errada"
      )
    ) {

      tecla.classList.add(
        "incorreta"
      );
    }
  }
}


/* =========================
   REINICIAR
========================= */

document
  .getElementById("reiniciar")
  .addEventListener(
    "click",
    reiniciarJogo
  );

function reiniciarJogo() {

  tentativaAtual = 0;

  palavraDigitada = "";

  jogoFinalizado = false;

  mensagem.textContent = "";

  criarTabuleiro();

  criarTeclado();
}


/* =========================
   INICIAR
========================= */

criarTabuleiro();

criarTeclado();
