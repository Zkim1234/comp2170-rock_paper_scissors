// Background music handling
const backgroundMusic = document.getElementById("backgroundMusic");
backgroundMusic.muted = false;
backgroundMusic.volume = 0.5;

//Starting game button
document.getElementById("play-button").onclick = function () {
  location.href = "/main-page/game.html";
};
