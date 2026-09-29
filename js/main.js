const WHATSAPP_NUMBER = "556133783039";
const IMG_BASE = "assets/imgs";

// Fotos de cada imóvel (a thumbnail é a capa)
const GALLERIES = {
  apt: {
    alt: "AP 2 quartos no Riacho Fundo II",
    files: [
      "thumbnail.jpg",
      "3962820705192946881_3962820690965881440.jpg",
      "3962820705192946881_3962820691058134629.jpg",
      "3962820705192946881_3962820691058158565.jpg",
      "3962820705192946881_3962820691091713244.jpg",
      "3962820705192946881_3962820691100049276.jpg",
      "3962820705192946881_3962820691150394104.jpg",
      "3962820705192946881_3962820691234318360.jpg",
      "3962820705192946881_3962820691251087240.jpg",
    ],
  },
  casa: {
    alt: "Casa 3 quartos em Ceilândia Norte",
    files: [
      "thumbnail.jpg",
      "3997068324931977048_3997068309790534057.jpg",
      "3997068324931977048_3997068309790583840.jpg",
      "3997068324931977048_3997068309798915761.jpg",
      "3997068324931977048_3997068309840890768.jpg",
      "3997068324931977048_3997068309840901645.jpg",
      "3997068324931977048_3997068309891203261.jpg",
      "3997068324931977048_3997068310000257139.jpg",
      "3997068324931977048_3997068310084160896.jpg",
    ],
  },
};

function createCarousel(root) {
  const gallery = GALLERIES[root.dataset.carousel];
  if (!gallery) return;

  const total = gallery.files.length;
  let index = 0;

  const track = document.createElement("div");
  track.className = "carousel__track";
  gallery.files.forEach((file, i) => {
    const img = document.createElement("img");
    img.src = `${IMG_BASE}/${root.dataset.carousel}/${file}`;
    img.alt = `${gallery.alt} - foto ${i + 1} de ${total}`;
    img.loading = i === 0 ? "eager" : "lazy";
    track.appendChild(img);
  });

  const prev = document.createElement("button");
  prev.className = "carousel__btn carousel__btn--prev";
  prev.setAttribute("aria-label", "Foto anterior");
  prev.innerHTML = "&#8249;";

  const next = document.createElement("button");
  next.className = "carousel__btn carousel__btn--next";
  next.setAttribute("aria-label", "Próxima foto");
  next.innerHTML = "&#8250;";

  const counter = document.createElement("span");
  counter.className = "carousel__counter";

  const dots = document.createElement("div");
  dots.className = "carousel__dots";
  const dotButtons = gallery.files.map((_, i) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Ir para foto ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dots.appendChild(dot);
    return dot;
  });

  root.append(track, prev, next, counter, dots);

  function goTo(i) {
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
    dotButtons.forEach((dot, d) => dot.classList.toggle("is-active", d === index));
    counter.textContent = `${index + 1} / ${total}`;
  }

  prev.addEventListener("click", () => goTo(index - 1));
  next.addEventListener("click", () => goTo(index + 1));

  // Navegação por teclado quando o carrossel está em foco
  root.tabIndex = 0;
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goTo(index - 1);
    if (e.key === "ArrowRight") goTo(index + 1);
  });

  // Swipe no celular
  let startX = null;
  track.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 40) goTo(diff < 0 ? index + 1 : index - 1);
    startX = null;
  });

  goTo(0);
}

document.querySelectorAll("[data-carousel]").forEach(createCarousel);

// Vídeo começa sem controles para a thumbnail aparecer inteira
const tourVideo = document.querySelector(".video-tour__player video");
if (tourVideo) {
  const startVideo = () => {
    if (tourVideo.controls) return;
    tourVideo.controls = true;
    tourVideo.play();
  };
  tourVideo.addEventListener("click", startVideo);
  tourVideo.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      startVideo();
    }
  });
}

// Header muda de estilo ao rolar a página
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Menu mobile
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
function setNavOpen(open) {
  nav.classList.toggle("is-open", open);
  header.classList.toggle("nav-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
}
navToggle.addEventListener("click", () => setNavOpen(!nav.classList.contains("is-open")));
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setNavOpen(false)));

// Formulário de contato abre o WhatsApp com a mensagem preenchida
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const text = [
    `Olá! Meu nome é ${data.get("nome")}.`,
    `Tenho interesse em: ${data.get("interesse")}.`,
    data.get("mensagem"),
  ].filter(Boolean).join("\n");
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
});

// Animação de entrada das seções
const revealTargets = document.querySelectorAll(".section__head, .service, .property, .video-tour, .review, .contact__info, .contact__form");
revealTargets.forEach((el) => el.classList.add("reveal"));
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealTargets.forEach((el) => observer.observe(el));

document.getElementById("year").textContent = new Date().getFullYear();
