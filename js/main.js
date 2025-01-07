/*window.addEventListener("scroll", function () {
  let header = document.getElementById("primary_text");
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    header.style.opacity = 1 - scrollTop / 500;
});*/

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
  results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

const usuarioLogged = getParameterByName("name")
let menu = document.getElementById("menu")

document.addEventListener('DOMContentLoaded', function() {
  let currentIndex = 0;
  const images = [
    { src: "img/sudadera.png", caption: "Escape the Ordinary" },
    { src: "img/cascoMoto.png", caption: "Experience Great Adventures" },
    { src: "img/bambas.png", caption: "Discover New Horizons" },
    { src: "img/Logo.png", caption: "Start your brand" },
  ];

  const slidesContainer = document.querySelector(".slides");
  const thumbnailsContainer = document.querySelector(".thumbnails");
  let autoSlideInterval;

  // Generar contenido dinámicamente
  const createSlidesAndThumbnails = () => {
    slidesContainer.innerHTML = "";
    thumbnailsContainer.innerHTML = "";

    images.forEach((image, index) => {
      // Crear slide
      const slide = document.createElement("div");
      slide.classList.add("slide");
      slide.innerHTML = `
        <a href="#" id="prod${index + 1}">
          <img src="${image.src}" alt="Slide ${index + 1}">
        </a>
        <div class="caption">${image.caption}</div>
      `;
      slidesContainer.appendChild(slide);

      // Crear miniatura
      const thumbnail = document.createElement("div");
      thumbnail.classList.add("thumbnail");
      thumbnail.innerHTML = `<img src="${image.src}" alt="Thumbnail ${index + 1}">`;
      thumbnail.addEventListener("click", () => {
        goToSlide(index);
        restartAutoSlide();
      });
      thumbnailsContainer.appendChild(thumbnail);
    });
  };

  // Cambiar a la imagen correspondiente al índice
  const goToSlide = (index) => {
    if (index < 0) {
      currentIndex = images.length - 1;
    } else if (index >= images.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    // Cambiar a la imagen correspondiente sin animación
    slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateThumbnails();
  };

  // Actualizar las miniaturas según la imagen activa
  const updateThumbnails = () => {
    const thumbnails = document.querySelectorAll(".thumbnail");
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle("active", i === currentIndex);
    });
  };

  // Iniciar el deslizador automático
  const startAutoSlide = () => {
    autoSlideInterval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000); // Cambia cada 5 segundos
  };

  // Reiniciar el deslizador automático al interactuar con las miniaturas
  const restartAutoSlide = () => {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  };

  // Soporte para teclas de navegación
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      goToSlide(currentIndex + 1);
      restartAutoSlide();
    } else if (e.key === "ArrowLeft") {
      goToSlide(currentIndex - 1);
      restartAutoSlide();
    }
  });

  // Inicializar
  createSlidesAndThumbnails();
  goToSlide(0);
  startAutoSlide();

  const productButton1 = document.getElementById("prod1");
  const productButton2 = document.getElementById("prod2");
  const productButton3 = document.getElementById("prod3");
  const productButton4 = document.getElementById("prod4");
  if(usuarioLogged !== ""){
    const pageUrl1 = "views/buy.html?prodId=1&name=" + usuarioLogged;
    productButton1.setAttribute("href", pageUrl1);
    const pageUrl2 = "views/buy.html?prodId=2&name=" + usuarioLogged;
    productButton2.setAttribute("href", pageUrl2);
    const pageUrl3 = "views/buy.html?prodId=3&name=" + usuarioLogged;
    productButton3.setAttribute("href", pageUrl3);
    const pageUrl4 = "views/buy.html?prodId=4&name=" + usuarioLogged;
    productButton4.setAttribute("href", pageUrl4);
  } else{
    const pageUrl1 = "views/login.html?prodId=1&notSub=1"
    productButton1.setAttribute("href", pageUrl1);
    const pageUrl2 = "views/login.html?prodId=2&notSub=1";
    productButton2.setAttribute("href", pageUrl2);
    const pageUrl3 = "views/login.html?prodId=3&notSub=1";
    productButton3.setAttribute("href", pageUrl3);
    const pageUrl4 = "views/login.html?prodId=4&notSub=1";
    productButton4.setAttribute("href", pageUrl4);
  }
})

if(usuarioLogged !== ""){
  menu.innerHTML = `
    <a href="views/user.html?name=${usuarioLogged}">${usuarioLogged}</a>
    <img src="img/avatar.png" alt="Login Icon">
    <a href="index.html">Log Out</a>
    <img src="img/quitar-usuario.png" alt="Register Icon">
  `
}

const btn = document.getElementById('button');

document.getElementById('footer-form')
 .addEventListener('submit', function(event) {
   event.preventDefault();

   btn.value = 'Sending...';

   const serviceID = 'default_service';
   const templateID = 'template_r2eagi7';

   emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
      btn.value = 'Send Email';
      alert('Sent!');
    }, (err) => {
      btn.value = 'Send Email';
      alert(JSON.stringify(err));
    });
});

/*let lastScrollTop = 0; // Variable para almacenar la última posición del scroll

window.addEventListener('scroll', function() {
  const footer = document.getElementById('footer');
  const scrollPosition = window.scrollY; // Posición actual del scroll

  if (scrollPosition < lastScrollTop) {
    // Si el usuario está desplazándose hacia arriba
    const opacityValue = Math.max(0.1, 1 - (scrollPosition / 500)); // Disminuye la opacidad conforme sube
    footer.style.opacity = opacityValue;
  } else {
    // Si el usuario está desplazándose hacia abajo
    footer.style.opacity = 1; // Mantiene la opacidad normal
  }

  // Actualizar la última posición del scroll
  lastScrollTop = scrollPosition <= 0 ? 0 : scrollPosition; // Evitar valores negativos
});*/

function mostrarSuscripciones(){
  let subBody = document.getElementById("three")
  subBody.innerText = ""
  subBody.innerHTML = `
  <div class='newCont'>
    <div class='planContainer'>
    <h1 class='planText h1'>Escoge tu plan de suscripción</h1>
      <div class='plans'>
        <div class='plan'>
          <h2>Basico</h2>
          <p>Envios gratuitos y un descuento del 10% en uno de nuestros productos mensualmente.</p>
          <p class='price'>5€ / mes</p>
          <a href='${alredyLogged(1)}' class='buttonPlan'>Suscribete</a>
        </div>
        <div class='plan'>
          <h2>Avanzado</h2>
          <p>Un produco gratuito a su eleccion y un descuento del 50% en cualquier compra mensual.</p>
          <p class='price'>15€ / month</p>
          <a href='${alredyLogged(2)}' class='buttonPlan'>Suscribete</a>
        </div>
        <div class='plan'>
          <h2>Premium</h2>
          <p>Lo mismo que en el avanzado pero añadiendo un 50% de descuento en todos los nuevos productos</p>
          <p class='price'>30€ / month</p>
          <a href='${alredyLogged(3)}' class='buttonPlan'>Suscribete</a>
        </div>
      </div>
    </div>
  </div>
  `
}
  
function alredyLogged(num){
  if(usuarioLogged !== ""){
    return `views/pago.html?prodId=${num}&name=${usuarioLogged}`
  } else {
    return `views/login.html?prodId=${num}`
  }
}