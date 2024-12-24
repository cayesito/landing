/**
 * @param String name
 * @return String
 */
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var prodId = getParameterByName('prodId');

if (prodId == 1){
    var body = document.getElementById("container")
    body.innerHTML = "<h1>Suscripción básica</h1><p>Bienvenido a nuestra Suscripción Básica. Con este nivel, podrás disfrutar de las siguientes características:</p><div class='features'><h2>Características Incluidas:</h2><ul><li>Acceso a contenido limitado.</li><li>Soporte estándar por correo electrónico.</li><li>Actualizaciones mensuales de contenido.</li><li>Compatible con múltiples dispositivos.</li></ul></div><p>Gracias por elegir nuestra suscripción. ¡Disfruta del servicio!</p>"
} else if(prodId == 2){
    var body = document.getElementById("container")
    body.innerHTML = "<h1>Suscripción avanzada</h1><p>Descubre nuestra Suscripción Avanzada, diseñada para ofrecer más beneficios que la básica sin llegar al nivel premium. Ideal para usuarios exigentes.</p><div class='features'><h2>Características Incluidas:</h2><ul><li>Acceso a la mayoría del contenido.</li><li>Soporte ampliado en horario laboral.</li><li>Actualizaciones quincenales de contenido exclusivo.</li><li>Experiencia con anuncios mínimos.</li><li>Compatibilidad en hasta 3 dispositivos simultáneamente.</li></ul></div><p>Perfecta para quienes buscan más opciones sin comprometer su presupuesto. ¡Gracias por elegirnos!</p>"
} else if (prodId == 3){
    var body = document.getElementById("container")
    body.innerHTML = "<h1>Suscripción premium</h1><p>Gracias por elegir nuestra Suscripción Premium. Disfruta de una experiencia completa con las siguientes ventajas exclusivas:</p><div class='features'><h2>Características Incluidas:</h2><ul><li>Acceso ilimitado a todo el contenido.</li><li>Soporte prioritario 24/7.</li><li>Actualizaciones semanales de contenido exclusivo.</li><li>Acceso sin anuncios.</li><li>Descargas offline en alta calidad.</li></ul></div><p>Prepárate para disfrutar de lo mejor que ofrecemos. ¡Bienvenido a la experiencia Premium!</p>"
}