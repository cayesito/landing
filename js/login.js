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
let userCreated = false
let username
let password

const authContainer = document.getElementById('auth-container');

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
        const username2 = document.getElementById('username').value;
        const password2 = document.getElementById('password').value;

        if (username2 && password2) {
            // Solicitar los datos del servidor (usuarios registrados)
            fetch('http://localhost:3000/obtener-datos')
                .then(response => response.json())
                .then(data => {
                    let usuarioValido = false;
    
                    // Compara con los usuarios guardados en datos.json
                    data.forEach(user => {
                        if (user.usuario === username2 && user.password === password2) {
                            usuarioValido = true;
                            window.location.href = "pago.html?prodId=" + prodId + "&name=" + user.usuario;
                        }
                    });
    
                    // Si no se encontró el usuario, muestra un mensaje
                    if (!usuarioValido) {
                        showAlert("El usuario y la contraseña no coinciden con los que has creado.", 'error');
                    }
                })
                .catch(error => {
                    console.error('Error al obtener los datos de los usuarios:', error);
                });
        } else {
            showAlert('Por favor, completa todos los campos.', 'warning');
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
            <button type="submit" class="btn" id="button">Crear Cuenta</button>
        </form>
        <p>¿Ya tienes una cuenta? <a href="#" id="back-to-login">Inicia sesión</a></p>
    `;

    document.getElementById('back-to-login').addEventListener('click', function(event) {
        event.preventDefault();
        showLogin();
    });

    document.getElementById('register-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const btn = document.getElementById('button');

        username = document.getElementById('name_of').value;
        const email = document.getElementById('reply_to').value;
        password = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }
        userCreated = true
        await sendInfo(username, email, password, btn);
            
    });
}

// Mostrar la pantalla de inicio de sesión al cargar
showLogin();



function sendInfo(user, mail, pass, btn){
    btn.innerText = 'Sending...';

    const datos = {
        usuario: user,
        email: mail,
        password: pass
    };

    fetch('http://localhost:3000/guardar-datos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        sendEmail();
    })
    .catch(error => {
        console.error('Error al guardar los datos:', error);
    });
}

function sendEmail(){
    const form = document.getElementById('register-form');
    const serviceID = 'default_service';
    const templateID = 'template_npq3u3r';
    emailjs.sendForm(serviceID, templateID, form)
    .then(() => {

        authContainer.innerHTML = `
        <div class="message">¡Cuenta creada exitosamente! Se te ha enviado un correo de confirmación</div>
        `;

        setTimeout(() => {
            showLogin();
        }, 2000); // Regresar a inicio de sesión después de 2 segundos
    }, (err) => {
        alert(JSON.stringify(err));
        returnToStart()
    });
}

// Función para mostrar la alerta personalizada
// Función para mostrar la alerta
function showAlert(message, type = 'error') {
    const alertBox = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('alert-message');
    const alertIcon = document.getElementById('alert-icon');

    // Establecer el mensaje en la alerta
    alertMessage.textContent = message;

    // Limpiar clases previas
    alertBox.classList.remove('error', 'success', 'warning');
    alertIcon.textContent = ''; // Limpiar icono previo

    // Agregar la clase correspondiente para el tipo de alerta
    alertBox.classList.add(type);

    // Cambiar el icono según el tipo de alerta
    if (type === 'error') {
        alertIcon.innerHTML = '❌';  // Icono de error
    } else if (type === 'success') {
        alertIcon.innerHTML = '✅';  // Icono de éxito
    } else if (type === 'warning') {
        alertIcon.innerHTML = '⚠️';  // Icono de advertencia
    }

    // Mostrar la alerta con animación
    alertBox.classList.add('show');
    alertBox.style.display = "flex";  // Asegurarse de que el display sea flex cuando se muestre

    // Verifica si la alerta tiene las clases correctas
    console.log(alertBox.classList);
}

// Función para cerrar la alerta con animación
function closeAlert() {
    const alertBox = document.getElementById('custom-alert');

    // Inicia la animación de cierre
    alertBox.classList.add('close');

    // Espera a que la animación de opacidad termine para poner display: none
    setTimeout(() => {
        alertBox.style.display = 'none';  // Después de la animación, oculta el elemento
        alertBox.classList.remove('close');  // Limpia la clase para futuras animaciones
    }, 400); // El tiempo debe coincidir con la duración de la animación
}