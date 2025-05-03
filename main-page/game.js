document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded");

  // Card variables
  const paper = document.querySelector(".paper-bottom-right");
  const scissors = document.querySelector(".scissors-bottom-right");
  const rock = document.querySelector(".rock-bottom-right");
  // Score variables
  const aiScoreStars = document.querySelectorAll(".ai-score.stars .star");
  const playerScoreStars = document.querySelectorAll(
    ".player-score.stars .star"
  );
  const playerPlayedCard = document.querySelector(".player-played-card");
  // AI variables
  const aiPlayedCard = document.querySelector(".ai-played-card");
  const aiCards = document.querySelectorAll(".cards-container .card");
  // Speech bubble variables
  const speechBubble = document.querySelector(".speech-bubble");
  // Overlay variables
  const youWinOverlay = document.getElementById("you-win-overlay");
  const youLoseOverlay = document.getElementById("you-lose-overlay");
  const pauseOverlay = document.getElementById("pause-game-overlay");
  const exitButton = document.querySelector(".exit-button");
  // Button variables
  const replayButton = document.querySelector(".replay-game");
  const playAgainButtons = document.querySelectorAll(".play-again");

  // Card types and Score variables
  const cardTypes = ["paper", "scissors", "rock"];
  let playerScore = 0;
  let aiScore = 0;
  let gameOver = false;

  // Generates a random card type for the AI
  function computerChoice() {
    const randomIndex = Math.floor(Math.random() * cardTypes.length);
    return cardTypes[randomIndex];
  }

  //Resets the game
  function resetGame() {
    // Reset scores
    playerScore = 0;
    aiScore = 0;
    gameOver = false;

    // Reset stars
    updateStars();

    // Show all AI cards
    aiCards.forEach((card) => {
      card.style.display = "block";
    });

    // Reset played cards
    playerPlayedCard.style.display = "none";
    aiPlayedCard.style.display = "none";

    // Show speech bubble
    speechBubble.style.display = "block";

    // Hide gameover overlays
    youWinOverlay.style.display = "none";
    youLoseOverlay.style.display = "none";
    pauseOverlay.style.display = "none";

    // Re-enable card clicks makes card clickable
    paper.style.pointerEvents = "auto";
    scissors.style.pointerEvents = "auto";
    rock.style.pointerEvents = "auto";
  }

  // Add event listeners for Play Again buttons
  playAgainButtons.forEach((button) => {
    button.addEventListener("click", resetGame);
  });

  replayButton.addEventListener("click", resetGame);

  function determineWinner(playerType, aiType) {
    if (playerType === aiType) return "tie";
    if (
      (playerType === "rock" && aiType === "scissors") ||
      (playerType === "paper" && aiType === "rock") ||
      (playerType === "scissors" && aiType === "paper")
    ) {
      return "player";
    }
    return "ai";
  }

  // Freezes the cards when overlays are shown
  function freezeCards() {
    paper.style.pointerEvents = "none";
    scissors.style.pointerEvents = "none";
    rock.style.pointerEvents = "none";
  }

  function showPlayedCards(playerType, aiType, clickedCard) {
    // Hide the speech bubble
    speechBubble.style.display = "none";

    // Hide the clicked player card
    clickedCard.style.display = "none";

    // Show the player's card immediately
    playerPlayedCard.innerHTML = `<img src="../images/cards/${playerType}_blue.png" style="width:220px; height:220px; object-fit: contain;">`;
    playerPlayedCard.style.display = "flex";

    // Delay showing the AI's card by 1 second
    setTimeout(() => {
      // Hide one of the AI cards at the same time as showing the AI's played card
      const aiCardToHide = aiCards[Math.floor(Math.random() * aiCards.length)];
      aiCardToHide.style.display = "none";

      aiPlayedCard.innerHTML = `<img src="../images/cards/${aiType}_red.png" style="width:220px; height:220px; object-fit: contain;">`;
      aiPlayedCard.style.display = "flex";

      // Determine winner and update score
      const winner = determineWinner(playerType, aiType);
      if (winner === "player") {
        playerScore++;
      } else if (winner === "ai") {
        aiScore++;
      }

      // Update stars
      updateStars();

      // Check for win/lose
      if (playerScore === 3) {
        gameOver = true;
        setTimeout(() => {
          youWinOverlay.style.display = "flex";
          freezeCards();
        }, 1000);
      } else if (aiScore === 3) {
        gameOver = true;
        setTimeout(() => {
          youLoseOverlay.style.display = "flex";
          freezeCards();
        }, 1000);
      }

      // After a short delay, reset the cards
      setTimeout(() => {
        // Clear the played cards
        playerPlayedCard.style.display = "none";
        aiPlayedCard.style.display = "none";

        // Generate a random card type for the player
        const newCardType =
          cardTypes[Math.floor(Math.random() * cardTypes.length)];

        // Show the clicked player card again with a new random card
        clickedCard.style.display = "flex";
        clickedCard.querySelector(
          "img"
        ).src = `../images/cards/${newCardType}_blue.png`;

        // Show the AI card again
        aiCardToHide.style.display = "block";
      }, 1000);
    }, 500); // 1 second delay for AI's card
  }

  paper.addEventListener("click", function () {
    const currentType = this.querySelector("img")
      .src.split("/")
      .pop()
      .split("_")[0];
    const aiType = computerChoice();
    showPlayedCards(currentType, aiType, this);
  });

  scissors.addEventListener("click", function () {
    const currentType = this.querySelector("img")
      .src.split("/")
      .pop()
      .split("_")[0];
    const aiType = computerChoice();
    showPlayedCards(currentType, aiType, this);
  });

  rock.addEventListener("click", function () {
    const currentType = this.querySelector("img")
      .src.split("/")
      .pop()
      .split("_")[0];
    const aiType = computerChoice();
    showPlayedCards(currentType, aiType, this);
  });

  function updateStars() {
    aiScoreStars.forEach((star, i) => {
      star.src =
        i < aiScore
          ? "../images/lose-win/coloured_star.png"
          : "../images/lose-win/uncoloured_star.png";
    });
    playerScoreStars.forEach((star, i) => {
      star.src =
        i < playerScore
          ? "../images/lose-win/coloured_star.png"
          : "../images/lose-win/uncoloured_star.png";
    });
  }

  // Pause game when clicking X button
  exitButton.addEventListener("click", function (e) {
    e.preventDefault();
    pauseOverlay.style.display = "flex";
    paper.style.pointerEvents = "none";
    scissors.style.pointerEvents = "none";
    rock.style.pointerEvents = "none";
  });

  // Resume game when clicking replay button
  replayButton.addEventListener("click", function () {
    pauseOverlay.style.display = "none";
    if (!gameOver) {
      paper.style.pointerEvents = "auto";
      scissors.style.pointerEvents = "auto";
      rock.style.pointerEvents = "auto";
    }
  });

  // Close pause overlay when clicking outside
  pauseOverlay.addEventListener("click", function (e) {
    if (e.target === pauseOverlay) {
      pauseOverlay.style.display = "none";
      if (!gameOver) {
        paper.style.pointerEvents = "auto";
        scissors.style.pointerEvents = "auto";
        rock.style.pointerEvents = "auto";
      }
    }
  });

  function unfreezeCards() {
    paper.style.pointerEvents = "auto";
    scissors.style.pointerEvents = "auto";
    rock.style.pointerEvents = "auto";
  }
});
