/*window.addEventListener("scroll", function () {
  let header = document.getElementById("primary_text");
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    header.style.opacity = 1 - scrollTop / 500;
});*/

const btn = document.getElementById('button');

document.getElementById('form')
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

let currentIndex = 0;
  let slides = document.querySelector('.slides');
  let slideCount = document.querySelectorAll('.slide').length;
  let autoSlideInterval;

  // Función para ir a un slide específico
  function goToSlide(index) {

    if (index === slideCount) {
      currentIndex = 0;
      slides.style.transition = 'none'; // Desactivar la transición
      slides.style.transform = `translateX(0)`;
      setTimeout(() => {
        slides.style.transition = 'transform 0.5s ease-in-out'; // Volver a activar la transición
        currentIndex = 1; // Ir al segundo slide (lo cual hará que se vean bien los slides)
        slides.style.transform = `translateX(-${currentIndex * 100}%)`;
      }, 50); // Esperar que la transición sin movimiento haya terminado
    } else if (index === -1) {
      // Volver a la última imagen sin intermedios
      currentIndex = slideCount - 1;
      slides.style.transition = 'none';
      slides.style.transform = `translateX(-${(currentIndex) * 100}%)`;
      setTimeout(() => {
        slides.style.transition = 'transform 0.5s ease-in-out'; // Reestablecer la transición
      }, 50);
    } else {
      currentIndex = index;
      slides.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    // Actualizar miniaturas
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnails[currentIndex].classList.add('active');
  }

  // Función para iniciar el cambio automático de imágenes
  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      currentIndex++;
      if (currentIndex >= slideCount) {
        currentIndex = 0; // Volver al primer slide al llegar al final
      }
      goToSlide(currentIndex);
    }, 5000); // Cambiar cada 5 segundos
  }

  // Detener el auto-slide y reiniciar el temporizador
  function restartAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  // Configurar la primera miniatura como activa por defecto
  document.querySelectorAll('.thumbnail')[0].classList.add('active');
  
  // Iniciar el auto-slide al cargar la página
  startAutoSlide();

  // Detectar clics en las miniaturas y reiniciar el temporizador
  const thumbnails = document.querySelectorAll('.thumbnail');
  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      goToSlide(index);
      restartAutoSlide(); // Reiniciar el temporizador al hacer clic en una miniatura
    });
  });

function mostrarSuscripciones(){
  let subBody = document.getElementById("three")
  subBody.innerText = ""
  subBody.innerHTML = "<div class='newCont'><div class='planContainer'><h1 class='planText'>Escoge tu plan de suscripción</h1><div class='plans'><div class='plan'><h2>Basico</h2><p>Envios gratuitos y un descuento del 10% en uno de nuestros productos mensualmente.</p><p class='price'>5€ / mes</p><a href='login.html?prodId=1' class='buttonPlan'>Suscribete</a></div><div class='plan'><h2>Avanzado</h2><p>Un produco gratuito a su eleccion y un descuento del 50% en cualquier compra mensual.</p><p class='price'>15€ / month</p><a href='login.html?prodId=2' class='buttonPlan'>Suscribete</a></div><div class='plan'><h2>Premium</h2><p>Lo mismo que en el avanzado pero añadiendo un 50% de descuento en todos los nuevos productos</p><p class='price'>30€ / month</p><a href='login.html?prodId=3' class='buttonPlan'>Suscribete</a></div></div></div>"
}