function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var prodId = getParameterByName('prodId');
var nombre = getParameterByName('name')

function mayusculaPrimeraLetra(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

if (prodId == 1){
    var body = document.getElementById("container")
    body.innerHTML = "<h1>Grácias por suscribirte!</h1><p>" + mayusculaPrimeraLetra(nombre) + ", bienvenido a nuestra suscripción básica. Con este nivel, podrás disfrutar de las siguientes características:</p><div class='features'><h2>Características Incluidas:</h2><ul><li>Acceso a contenido limitado.</li><li>Soporte estándar por correo electrónico.</li><li>Actualizaciones mensuales de contenido.</li><li>Compatible con múltiples dispositivos.</li></ul></div><div class='button-container'><button onclick='confirmarCompra()'>Comprar</button><button onclick='goBack()'>Volver Atrás</button></div>"
} else if(prodId == 2){
    var body = document.getElementById("container")
    body.innerHTML = "<h1>Grácias por suscribirte!</h1><p>" + mayusculaPrimeraLetra(nombre) + ", bienvenido a nuestra suscripción avanzada, diseñada para ofrecer más beneficios que la básica sin llegar al nivel premium. Ideal para usuarios exigentes.</p><div class='features'><h2>Características Incluidas:</h2><ul><li>Acceso a la mayoría del contenido.</li><li>Soporte ampliado en horario laboral.</li><li>Actualizaciones quincenales de contenido exclusivo.</li><li>Experiencia con anuncios mínimos.</li><li>Compatibilidad en hasta 3 dispositivos simultáneamente.</li></ul></div><div class='button-container'><button onclick='confirmarCompra()'>Comprar</button><button onclick='goBack()'>Volver Atrás</button></div>"
} else if (prodId == 3){
    var body = document.getElementById("container")
    body.innerHTML = "<h1>Grácias por suscribirte!</h1><p>" + mayusculaPrimeraLetra(nombre) + ", bienvenido a nuestra suscripción premium. Disfruta de una experiencia completa con las siguientes ventajas exclusivas:</p><div class='features'><h2>Características Incluidas:</h2><ul><li>Acceso ilimitado a todo el contenido.</li><li>Soporte prioritario 24/7.</li><li>Actualizaciones semanales de contenido exclusivo.</li><li>Acceso sin anuncios.</li><li>Descargas offline en alta calidad.</li></ul></div><div class='button-container'><button onclick='confirmarCompra()'>Comprar</button><button onclick='goBack()'>Volver Atrás</button></div>"
}

function confirmarCompra() {
    document.getElementById("alertContainer").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function realizarCompra() {
    document.getElementById("alertContainer").style.display = "none"
    document.getElementById("overlay").style.display = "none"

    document.getElementById("container").style.display = "none"
    document.getElementById("thanksMessage").style.display = "block"

    const nuevosDatos = {
        userId: nombre,
        prodId: prodId
    }

    fetch('http://localhost:3000/update-compra', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },  
        body: JSON.stringify({ nuevosDatos }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })
    .catch(error => {
        console.error('Error:', error);
    });

    setTimeout(function() {
        window.location.href = "../index.html?name=" + nombre
    }, 3000)
}

function cancelarCompra() {
    document.getElementById("alertContainer").style.display = "none"
    document.getElementById("overlay").style.display = "none"
}

function goBack(){
    window.location.href = "../index.html?name=" + nombre
}