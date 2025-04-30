document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded");

  const paper = document.querySelector(".paper-bottom-right");
  const scissors = document.querySelector(".scissors-bottom-right");
  const rock = document.querySelector(".rock-bottom-right");
  const aiScoreStars = document.querySelectorAll(".ai-score.stars .star");
  const playerScoreStars = document.querySelectorAll(
    ".player-score.stars .star"
  );
  const playerPlayedCard = document.querySelector(".player-played-card");
  const aiPlayedCard = document.querySelector(".ai-played-card");
  const aiCards = document.querySelectorAll(".cards-container .card");
  const speechBubble = document.querySelector(".speech-bubble");
  const youWinOverlay = document.getElementById("you-win-overlay");
  const youLoseOverlay = document.getElementById("you-lose-overlay");
  const pauseOverlay = document.getElementById("pause-game-overlay");
  const exitButton = document.querySelector(".exit-button");
  const replayGameButton = document.querySelector(".replay-game");
  const playAgainButtons = document.querySelectorAll(".play-again");

  // Card types
  const cardTypes = ["paper", "scissors", "rock"];
  let playerScore = 0;
  let aiScore = 0;
  let gameOver = false;

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

    // Hide overlays
    youWinOverlay.style.display = "none";
    youLoseOverlay.style.display = "none";
    pauseOverlay.style.display = "none";
    // Re-enable card clicks
    paper.style.pointerEvents = "auto";
    scissors.style.pointerEvents = "auto";
    rock.style.pointerEvents = "auto";
  }

  // Add event listeners for Play Again buttons
  playAgainButtons.forEach((button) => {
    button.addEventListener("click", resetGame);
  });

  replayGameButton.addEventListener("click", resetGame);

  function freezeCards() {
    paper.style.pointerEvents = "none";
    scissors.style.pointerEvents = "none";
    rock.style.pointerEvents = "none";
  }

  function computerChoice() {
    const randomIndex = Math.floor(Math.random() * cardTypes.length);
    return cardTypes[randomIndex];
  }

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

  function showPlayedCards(playerType, aiType) {
    // Hide the speech bubble
    speechBubble.style.display = "none";

    // Hide the selected player card
    const selectedCard = document.querySelector(`.${playerType}-bottom-right`);
    selectedCard.style.display = "none";

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

        // Show the selected player card again
        selectedCard.style.display = "flex";
        selectedCard.innerHTML = `<img src="../images/cards/${playerType}_blue.png" style="width:200%; height:200%; object-fit: contain;">`;

        // Show the AI card again
        aiCardToHide.style.display = "block";
      }, 1000);
    }, 500); // 1 second delay for AI's card
  }

  paper.addEventListener("click", function () {
    const aiType = computerChoice();
    showPlayedCards("paper", aiType);
  });

  scissors.addEventListener("click", function () {
    const aiType = computerChoice();
    showPlayedCards("scissors", aiType);
  });

  rock.addEventListener("click", function () {
    const aiType = computerChoice();
    showPlayedCards("rock", aiType);
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

  // Add pause game functionality
  exitButton.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default link behavior
    pauseOverlay.style.display = "flex";
    freezeCards();
  });

  // Close pause overlay when clicking outside
  pauseOverlay.addEventListener("click", (e) => {
    // Check if the click was directly on the overlay (not its children)
    if (e.target === pauseOverlay) {
      pauseOverlay.style.display = "none";
      if (!gameOver) {
        unfreezeCards();
      }
    }
  });

  function unfreezeCards() {
    paper.style.pointerEvents = "auto";
    scissors.style.pointerEvents = "auto";
    rock.style.pointerEvents = "auto";
  }
});
