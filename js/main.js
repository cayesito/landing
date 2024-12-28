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

document.addEventListener("DOMContentLoaded", () => {
  let currentIndex = 0;
  const slides = document.querySelector(".slides");
  const slideCount = document.querySelectorAll(".slide").length;
  const thumbnails = document.querySelectorAll(".thumbnail");
  let autoSlideInterval;

  // Función para ir a un slide específico
  const goToSlide = (index) => {
    // Asegúrate de que el índice esté dentro del rango
    if (index < 0) {
      currentIndex = slideCount - 1; // Ir al último slide
      slides.style.transition = "none"; // Desactivar la transición
      slides.style.transform = `translateX(-${currentIndex * 100}%)`; // Mover a la última imagen
      setTimeout(() => {
        slides.style.transition = "transform 0.5s ease-in-out"; // Reactivar la transición
      }, 50);
    } else if (index >= slideCount) {
      currentIndex = 0; // Volver al primer slide
      slides.style.transition = "none"; // Desactivar la transición
      slides.style.transform = `translateX(0)`;
      setTimeout(() => {
        slides.style.transition = "transform 0.5s ease-in-out"; // Reactivar la transición
      }, 50);
    } else {
      currentIndex = index;
      slides.style.transform = `translateX(-${currentIndex * 100}%)`; // Mover al slide deseado
    }

    // Actualizar miniaturas
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle("active", i === currentIndex);
      thumb.setAttribute("aria-selected", i === currentIndex);
    });
  };

  // Función para iniciar el auto-slide
  const startAutoSlide = () => {
    autoSlideInterval = setInterval(() => {
      goToSlide((currentIndex + 1) % slideCount);
    }, 5000);
  };

  // Función para reiniciar el temporizador del auto-slide
  const restartAutoSlide = () => {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  };

  // Configurar eventos de clic en miniaturas
  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      goToSlide(index);
      restartAutoSlide();
    });
  });

  // Soporte para teclas de navegación
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      goToSlide((currentIndex + 1) % slideCount);
      restartAutoSlide();
    } else if (e.key === "ArrowLeft") {
      goToSlide((currentIndex - 1 + slideCount) % slideCount);
      restartAutoSlide();
    }
  });

  // Iniciar auto-slide
  goToSlide(0); // Configurar el primer slide como activo
  startAutoSlide();
});

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