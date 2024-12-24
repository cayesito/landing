window.addEventListener("scroll", function () {
  let header = document.getElementById("primary_text");
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    header.style.opacity = 1 - scrollTop / 500;
});

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

let lastScrollTop = 0; // Variable para almacenar la última posición del scroll

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
});

let currentIndex = 0;
const slides = document.querySelector('.slides');
const thumbnails = document.querySelectorAll('.thumbnail');
const totalSlides = document.querySelectorAll('.slide').length;
let autoSlideInterval;

// Function to navigate to a specific slide
function goToSlide(index) {
  currentIndex = index;
  slides.style.transform = `translateX(-${currentIndex * 100}%)`;

  // Update active thumbnail
  thumbnails.forEach(thumb => thumb.classList.remove('active'));
  thumbnails[currentIndex].classList.add('active');
}

// Start the auto-slide
function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % totalSlides;
    goToSlide(currentIndex);
  }, 5000);
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

function manualChange(index) {
  stopAutoSlide();
  goToSlide(index);
  setTimeout(startAutoSlide, 5000);
}

// Initialize
thumbnails[0].classList.add('active');
startAutoSlide();