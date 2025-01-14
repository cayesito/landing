
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