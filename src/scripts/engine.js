const state = {
  view: {
    squares: document.querySelectorAll(".square"),
    enemy: document.querySelector(".enemy"),
    timeLeft: document.querySelector("#time-left"),
    score: document.querySelector("#score"),
    lives: document.querySelector(".menu-lives h2"),
    retryButton: document.querySelector("#retry-button"),
    gameOverModal: document.querySelector("#game-over-modal"),
    finalScore: document.querySelector("#final-score"),
  },
  values: {
    gameVelocity: 700,
    hitPosition: null,
    result: 0,
    curreTime: 60,
    livesCount: 3,
    clickDisabled: false,
  },
  actions: {
    timeId: null,
    countDownTimeId: null,
  },
};

function countDown() {
  state.values.curreTime--;
  state.view.timeLeft.textContent = state.values.curreTime;

  if (state.values.curreTime <= 0) {
    gameOver();
  }
}

function gameOver() {
  clearInterval(state.actions.timeId);
  clearInterval(state.actions.countDownTimeId);
  state.view.finalScore.textContent = state.values.result;
  state.view.gameOverModal.style.display = "flex";
}

function playSound(audioName) {
  let audio = new Audio(`/src/audios/${audioName}.mp3`);
  audio.volume = 0.2;
  audio.play().catch((error) => {
    console.error("Erro ao reproduzir o áudio:", error);
  });
}

function randomSquare() {
  state.view.squares.forEach((square) => {
    square.classList.remove("enemy");
  });

  let randomNumber = Math.floor(Math.random() * 9);
  let randomSquare = state.view.squares[randomNumber];
  randomSquare.classList.add("enemy");
  state.values.hitPosition = randomSquare.id;
  state.values.clickDisabled = false;
}

function addListenerHitBox() {
  state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", () => {
      if (state.values.clickDisabled) return;

      if (square.id === state.values.hitPosition) {
        state.values.result++;
        state.view.score.textContent = state.values.result;
        playSound("hit");
        square.classList.add("explode");

        setTimeout(() => {
          square.classList.remove("explode");
          square.classList.remove("enemy");
          state.values.hitPosition = null;
        }, 300);

        state.values.clickDisabled = true;
      } else {
        if (!isNaN(state.values.livesCount) && state.values.livesCount > 0) {
          state.values.livesCount--;
          state.view.lives.textContent = `x${state.values.livesCount}`;
          playSound("miss");

          if (state.values.livesCount <= 0) {
            gameOver();
          }
        }
      }
    });
  });
}

function resetGame() {
  state.values.livesCount = 3;
  state.values.result = 0;
  state.values.curreTime = 60;
  state.values.clickDisabled = false;

  state.view.lives.textContent = `x${state.values.livesCount}`;
  state.view.score.textContent = state.values.result;
  state.view.timeLeft.textContent = state.values.curreTime;

  state.view.gameOverModal.style.display = "none";

  state.actions.timeId = setInterval(randomSquare, 1000);
  state.actions.countDownTimeId = setInterval(countDown, 1000);
}

function initialize() {
  addListenerHitBox();
  resetGame();
}

state.view.retryButton.addEventListener("click", () => {
  resetGame();
});

initialize();
