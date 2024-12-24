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

const authContainer = document.getElementById('auth-container');

document.getElementById('create-account-link').addEventListener('click', function(event) {
    event.preventDefault();

    authContainer.innerHTML = `
        <h1>Crear Cuenta</h1>
        <form id="register-form">
            <div class="form-group">
                <label for="new-username">Usuario</label>
                <input type="text" name="name_of" id="name_of" placeholder="Elige un usuario" required>
            </div>
            <div class="form-group">
                <label for="email">Correo Electrónico</label>
                <input type="email" name="reply_to" id="reply_to" placeholder="Ingresa tu correo electrónico" required>
            </div>
            <div class="form-group">
                <label for="new-password">Contraseña</label>
                <input type="password" id="new-password" name="new-password" placeholder="Elige una contraseña" required>
            </div>
            <div class="form-group">
                <label for="confirm-password">Confirmar Contraseña</label>
                <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirma tu contraseña" required>
            </div>
            <button type="submit" class="btn">Crear Cuenta</button>
        </form>
        <p>¿Ya tienes una cuenta? <a href="#" id="back-to-login">Inicia sesión</a></p>
    `;

    document.getElementById('back-to-login').addEventListener('click', function(event) {
        event.preventDefault();
        location.reload();
    });

    document.getElementById('register-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('name_of').value;
        const email = document.getElementById('reply_to').value;
        const password = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        const btn = document.getElementById('button');

        document.getElementById('register-form')
        .addEventListener('submit', function(event) {
        event.preventDefault();

        const serviceID = 'default_service';
        const templateID = 'template_npq3u3r';

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                alert('Sent!');
            }, (err) => {
                alert(JSON.stringify(err));
            });
        });
    });
});

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        window.location.href = "pago.html" + "?prodId=" + prodId;
    } else {
        alert('Por favor, completa todos los campos.');
    }
});
