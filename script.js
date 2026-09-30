/* =========================
   COMO JOGAR
========================= */

const modalTutorial =
  document.getElementById("modalTutorial");

const abrirTutorial =
  document.getElementById("abrirTutorial");

const fecharTutorial =
  document.getElementById("fecharTutorial");

const entendiTutorial =
  document.getElementById("entendiTutorial");


function mostrarTutorial() {

  modalTutorial.classList.add("ativo");
}


function esconderTutorial() {

  modalTutorial.classList.remove("ativo");
}


abrirTutorial.addEventListener(
  "click",
  mostrarTutorial
);


fecharTutorial.addEventListener(
  "click",
  esconderTutorial
);


entendiTutorial.addEventListener(
  "click",
  esconderTutorial
);


/* FECHAR CLICANDO FORA */

modalTutorial.addEventListener(
  "click",
  function(evento) {

    if (
      evento.target === modalTutorial
    ) {

      esconderTutorial();
    }
  }
);


/* FECHAR COM ESC */

document.addEventListener(
  "keydown",
  function(evento) {

    if (
      evento.key === "Escape" &&
      modalTutorial.classList.contains("ativo")
    ) {

      esconderTutorial();
    }
  }
);
