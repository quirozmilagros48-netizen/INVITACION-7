const cover = document.getElementById("cover");
const invitation = document.getElementById("invitation");
const openInvitation = document.getElementById("openInvitation");
const music = document.getElementById("music");
const favoriteButton = document.getElementById("favoriteButton");
const previousButton = document.getElementById("previousButton");
const playButton = document.getElementById("playButton");
const nextButton = document.getElementById("nextButton");
const volumeButton = document.getElementById("volumeButton");
const confirmButton = document.getElementById("confirmButton");

const WHATSAPP_URL = "https://wa.me/51952388205?text=Hola%20soy%20%5BNOMBRE%5D%2C%20confirmo%20mi%20asistencia%20para%20los%2015%20a%C3%B1os%20de%20Graciela";
const target = new Date("2026-10-18T12:00:00-05:00");

function updateCountdown() {
  const now = new Date();
  let diff = target.getTime() - now.getTime();
  if (diff <= 0) diff = 0;

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

async function startMusic() {
  try {
    await music.play();
  } catch (error) {
    // El navegador puede bloquear la reproducción fuera de una interacción.
  }
}

openInvitation.addEventListener("click", async () => {
  cover.hidden = true;
  invitation.hidden = false;
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  await startMusic();
});

function safePlay() {
  const promise = music.play();
  if (promise && typeof promise.catch === "function") {
    promise.catch(() => {
      // Si el navegador bloquea la reproducción, el siguiente toque/clic vuelve a intentarlo.
    });
  }
}

function toggleMusic(event) {
  event.preventDefault();
  event.stopPropagation();

  if (music.paused) {
    safePlay();
  } else {
    music.pause();
  }
}

function restartMusic(event) {
  event.preventDefault();
  event.stopPropagation();
  music.currentTime = 0;
  safePlay();
}

function skipMusic(event) {
  event.preventDefault();
  event.stopPropagation();
  const duration = Number.isFinite(music.duration) ? music.duration : 0;
  music.currentTime = duration
    ? Math.min(duration, music.currentTime + 10)
    : music.currentTime + 10;
  safePlay();
}

function louder(event) {
  event.preventDefault();
  event.stopPropagation();
  music.muted = false;
  music.volume = Math.min(1, Math.round((music.volume + 0.1) * 10) / 10);
}

function favorite(event) {
  event.preventDefault();
  event.stopPropagation();
  favoriteButton.classList.toggle("is-active");
  favoriteButton.setAttribute(
    "aria-pressed",
    favoriteButton.classList.contains("is-active") ? "true" : "false"
  );
}

/* Se usan click y pointerup para que funcionen tanto con mouse como con pantalla táctil. */
playButton.addEventListener("click", toggleMusic);
previousButton.addEventListener("click", restartMusic);
nextButton.addEventListener("click", skipMusic);
volumeButton.addEventListener("click", louder);
favoriteButton.addEventListener("click", favorite);

[playButton, previousButton, nextButton, volumeButton, favoriteButton].forEach((button) => {
  button.addEventListener("pointerup", (event) => event.stopPropagation());
});

music.addEventListener("play", () => {
  playButton.classList.add("is-playing");
  playButton.setAttribute("aria-label", "Pausar la canción");
});

music.addEventListener("pause", () => {
  playButton.classList.remove("is-playing");
  playButton.setAttribute("aria-label", "Reproducir la canción");
});

confirmButton.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
});

music.volume = 0.9;
updateCountdown();
setInterval(updateCountdown, 1000);
