
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
  
  const usuarioLogged = getParameterByName("name")
  let menu = document.getElementById("menu")
  
  if(usuarioLogged !== ""){
    menu.innerHTML = `
      <a href="views/user.html?name=${usuarioLogged}">${usuarioLogged}</a>
      <img src="img/avatar.png" alt="Login Icon">
      <a href="index.html">Log Out</a>
      <img src="img/quitar-usuario.png" alt="Register Icon">
      <a href="#footer">Contacto</a>
      <img src="img/reenviar-mensaje.png" alt="Contacto Icon">
      <div class="dropdown">
          <a href="#" class="dropbtn">Idioma</a>
          <div class="dropdown-content">
              <a href="index.html">Español</a>
              <a href="index-en.html">English</a>
          </div>
          <img src="img/espana.png" alt="Bandera Icon">
      </div>
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
  
  function mostrarSuscripciones(){
    let subBody = document.getElementById("three")
    subBody.innerText = ""
    subBody.innerHTML = `
    <div class='newCont'>
        <div class='planContainer'>
            <h1 class='planText h1'>Choose Your Subscription Plan</h1>
            <div class='plans'>
            <div class='plan'>
                <h2>Basic</h2>
                <p>Free shipping and a 10% discount on one of our products each month all year.</p>
                <p class='price'>5,15$ / month</p>
                <a href='${alredyLogged(1)}' class='buttonPlan'>Subscribe</a>
            </div>
            <div class='plan'>
                <h2>Advanced</h2>
                <p>One free product of your choice and a 50% discount on any monthly purchase.</p>
                <p class='price'>15,46$ / month</p>
                <a href='${alredyLogged(2)}' class='buttonPlan'>Subscribe</a>
            </div>
            <div class='plan'>
                <h2>Premium</h2>
                <p>Everything included in the Advanced plan plus a 50% discount on all new products.</p>
                <p class='price'>30,91$ / month</p>
                <a href='${alredyLogged(3)}' class='buttonPlan'>Subscribe</a>
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

  const shirtSelect = document.getElementById('shirt-select');
  const shirtMockup = document.getElementById('shirt-mockup');
  const fileInput = document.querySelector('.file-upload');
  const logoPreview = document.querySelector('.logo-preview');
  const logoContainer = document.querySelector('.custom-logo');
  const moveXSlider = document.getElementById('logo-left');
  const moveYSlider = document.getElementById('logo-top');
  const sizeSlider = document.getElementById('logo-size');
    
  let logoPosition = { top: 50, left: 50 };
  let logoSize = 50;
  let logoRotation = 0;

  shirtSelect.addEventListener('change', function () {
    const selectedShirt = shirtSelect.value;
    shirtMockup.src = selectedShirt;
  });
  
  fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
  
    if (file) {
      const objectURL = URL.createObjectURL(file);
      logoPreview.src = objectURL;
      logoContainer.classList.add('visible');
      logoContainer.style.top = `${logoPosition.top}%`;
      logoContainer.style.left = `${logoPosition.left}%`;
      logoContainer.style.width = `${logoSize}%`; 
      logoContainer.style.transform = `rotate(${logoRotation}deg)`;
    } else {
      logoContainer.classList.remove('visible');
    }
  });
  
  function updateLogoPosition() {
    logoContainer.style.left = `${moveXSlider.value}%`;
    logoContainer.style.top = `${moveYSlider.value}%`;
    logoPosition.left = moveXSlider.value;
    logoPosition.top = moveYSlider.value;
  }
  
  function updateLogoSize() {
    logoSize = sizeSlider.value;
    logoContainer.style.width = `${logoSize}%`;
  }
  
  function updateLogoRotation() {
    logoRotation = rotateSlider.value;
    logoContainer.style.transform = `rotate(${logoRotation}deg)`;
  }
  
  moveXSlider.addEventListener('input', updateLogoPosition);
  moveYSlider.addEventListener('input', updateLogoPosition);
  sizeSlider.addEventListener('input', updateLogoSize);
  const rotateSlider = document.getElementById('logo-rotate');
  rotateSlider.addEventListener('input', updateLogoRotation); 
  