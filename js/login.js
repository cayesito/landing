function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

let prodId = getParameterByName('prodId');
let mode = getParameterByName('mode')
let notSub = getParameterByName('notSub')
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
        <p>¿Te has olvidado la contraseña? <a href="#" id="recover-password-link"><br>Recuperala aquí</a></p>
    `;
    document.getElementById('create-account-link').addEventListener('click', function(event) {
        event.preventDefault();
        showRegister();
    });

    document.getElementById('recover-password-link').addEventListener('click', function(event) {
        event.preventDefault();
        showRecoverUser();
    });

    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const username2 = document.getElementById('username').value;
        const password2 = document.getElementById('password').value;

        if (username2 && password2) {
            fetch('http://localhost:3000/obtener-datos')
            .then(response => response.json())
            .then(data => {
                let usuarioValido = false;

                data.forEach(user => {
                    if (user.usuario === username2 && user.password === password2 || user.email === username2 && user.password === password2) {
                        usuarioValido = true;
                        if(prodId == ""){
                            window.location.href = "../index.html?name=" + user.usuario
                        } else{
                            if(notSub == 1){
                                window.location.href = "buy.html?prodId=" + prodId + "&name=" + user.usuario;
                            } else {
                                window.location.href = "pago.html?prodId=" + prodId + "&name=" + user.usuario;
                            }
                        } 
                    }
                });

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

function showRecoverUser() {
    authContainer.innerHTML = `
        <h1>Crear Cuenta</h1>
        <form id="register-form">
            <div class="form-group">
                <label for="new-username">Usuario</label>
                <input type="text" name="name_of" id="name_of" placeholder="Elige un usuario" required>
            </div>
        <button type="submit" class="btn">Recuperar</button>
        <p>¿Ya tienes una cuenta? <a href="#" id="back-to-login">Inicia sesión</a></p>
    `;

    document.getElementById('back-to-login').addEventListener('click', function(event) {
        event.preventDefault();
        showLogin();
    });

    document.getElementById('register-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const username2 = document.getElementById('name_of').value;

        fetch('http://localhost:3000/obtener-datos')
        .then(response => response.json())
        .then(data => {
            let usuarioValido = false;

            data.forEach(user => {
                if (user.usuario === username2 || user.email === username2) {
                    usuarioValido = true;
                    showRecoverPassword(username2)
                }
            });

            if (!usuarioValido) {
                showAlert("Ese usuario no existe.", 'error');
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos de los usuarios:', error);
        });
    });
}

function showRecoverPassword(user){
    authContainer.innerHTML = `
        <h1>Crear Cuenta</h1>
        <form id="register-form">
            <div class="form-group">
                <label for="new-password">Nueva contraseña</label>
                <input type="password" id="new-password" name="new-password" placeholder="Elige una contraseña" required>
            </div>
            <div class="form-group">
                <label for="confirm-password">Confirmar nueva contraseña</label>
                <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirma tu contraseña" required>
            </div>
            <button type="submit" class="btn" id="button">Cambiar contraseña</button>
        </form>
    `;

    document.getElementById('register-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const newPassword = document.getElementById("new-password").value;
        const confirmNewPassword = document.getElementById("confirm-password").value;
        const userId = user

        if (newPassword === confirmNewPassword) {
            fetch('http://localhost:3000/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, newPassword }) 
            })
            .then(response => response.json())
            .then(data => {
                if(data.error === "samePassword"){
                    showAlert("La contraseña nueva no puede ser la misma que la anterior", "warning")
                } else {
                    authContainer.innerHTML = `
                    <div class="message">¡Contraseña cambiada con éxito!</div>
                    `;
                    setTimeout(() => {
                        showLogin();
                    }, 2000);
                }
            })
            .catch(error => {
                console.error('Error al actualizar la contraseña:', error);
                showAlert('Hubo un problema al cambiar la contraseña. Inténtalo de nuevo.', 'error');
            });
        } else {
            showAlert('Las contraseñas no coinciden', 'warning');
        }
    });
}

if(mode == 1){
    showLogin()
} else if(mode == 2){
    showRegister()
} else {
    showLogin()
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
            <button type="submit" class="btn" id="button")">Crear Cuenta</button>
        </form>
        <p>¿Ya tienes una cuenta? <a href="#" id="back-to-login">Inicia sesión</a></p>
    `;

    document.getElementById('back-to-login').addEventListener('click', function(event) {
        event.preventDefault();
        showLogin();
    });

    document.getElementById('button').addEventListener('click', function(event) {
        event.preventDefault();
        
        const nombre = document.getElementById("name_of").value
        const email = document.getElementById("reply_to").value
        const pass = document.getElementById("new-password").value
        const confirmPass = document.getElementById("confirm-password").value
        const button = document.getElementById("button").value

        if (pass === confirmPass) {
            sendInfo(nombre, email, pass, button)
        } else {
            showAlert('Las contraseñas no coinciden', 'warning');
        }
    });
}

function sendInfo(user, mail, pass, btn){
    btn.innerText = 'Sending...';

    const datos = {
        usuario: user,
        email: mail,
        password: pass,
        compras: 0,
        totalGastado: 0
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
        if (data.error === 'userAlreadyExists'){
            showAlert("Ese nombre de usuario ya exite, intenta iniciar sesión", "warning")
        } else if(data.error === 'emailAlreadyExists'){
            showAlert("Ese email ya esta en uso, intenta iniciar sesión", "warning")
        } else if(data.message === 'Datos guardados correctamente'){
            sendEmail();
        }
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
        }, 2000);
    }, (err) => {
        alert(JSON.stringify(err));
        returnToStart()
    });
}

function showAlert(message, type = 'error') {
    const alertBox = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('alert-message');
    const alertIcon = document.getElementById('alert-icon');

    alertMessage.textContent = message;

    alertBox.classList.remove('error', 'success', 'warning');
    alertIcon.textContent = ''; 

    alertBox.classList.add(type);

    if (type === 'error') {
        alertIcon.innerHTML = '❌'; 
    } else if (type === 'success') {
        alertIcon.innerHTML = '✅'; 
    } else if (type === 'warning') {
        alertIcon.innerHTML = '⚠️'; 
    }

    alertBox.classList.add('show');
    alertBox.style.display = "flex";
}

function closeAlert() {
    const alertBox = document.getElementById('custom-alert');

    alertBox.classList.add('close');

    setTimeout(() => {
        alertBox.style.display = 'none'; 
        alertBox.classList.remove('close'); 
    }, 400);
}