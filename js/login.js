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

function sendEmail(email) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 3000);
    });
}

function showLogin() {
    authContainer.innerHTML = `
        <h1>Iniciar Sesión</h1>
        <form id="login-form">
            <div class="form-group">
                <label for="username">Usuario</label>
                <input type="text" id="username" name="username" placeholder="Ingresa tu usuario" required>
            </div>
            <div class="form-group">
                <label for="password">Contraseña</label>
                <input type="password" id="password" name="password" placeholder="Ingresa tu contraseña" required>
            </div>
            <button type="submit" class="btn">Ingresar</button>
        </form>
        <p>¿No tienes una cuenta? <a href="#" id="create-account-link">Regístrate aquí</a></p>
    `;
    document.getElementById('create-account-link').addEventListener('click', function(event) {
        event.preventDefault();
        showRegister();
    });

    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username && password) {
            window.location.href = "dashboard.html"; // Redirige a otra página
        } else {
            alert('Por favor, completa todos los campos.');
        }
    });
}

function showRegister() {
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
        showLogin();
    });

    document.getElementById('register-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const username = document.getElementById('name_of').value;
        const email = document.getElementById('reply_to').value;
        const password = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        document.getElementById('register-form')
        .addEventListener('submit', function(event) {
        event.preventDefault();

        const serviceID = 'default_service';
        const templateID = 'template_npq3u3r';
        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                
            }, (err) => {
                alert(JSON.stringify(err));
                returnToStart()
            });
        });
        await sendEmail(email);

        // Mostrar mensaje de cuenta creada
        authContainer.innerHTML = `
            <div class="message">¡Cuenta creada exitosamente! Se te ha enviado un correo de confirmación</div>
        `;

        setTimeout(() => {
            showLogin();
        }, 2000); // Regresar a inicio de sesión después de 2 segundos
    });
}

// Mostrar la pantalla de inicio de sesión al cargar
showLogin();