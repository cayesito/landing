function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

const userLogged = getParameterByName("name")
let allData = ""
let estado
let buttonCancelar = document.getElementById("cancelSubscriptionButton")

document.addEventListener("DOMContentLoaded", () => {

    let header = document.getElementById("user")
    const saveButton = document.getElementById("saveButton");

    header.innerText = "Usuario: " + userLogged
    const backButton = document.querySelector(".back-button");
    
    // Define la URL a la que quieres que redirija
    const previousPageUrl = "../index.html?name=" + userLogged; 
    
    // Establece el enlace
    backButton.setAttribute("href", previousPageUrl);

    fetch('http://localhost:3000/buscar-usuario?userId=' + userLogged)
    .then(response => response.json())
    .then(data => {
        populateForm("personalInfoForm", data);
        populateForm("addressForm", data);
        populateForm("subForm",data)
        
        allData = data

        if(allData.estado === "Activa"){
            buttonCancelar.innerText = "Dar de baja la suscripción"
        } else if(allData.estado === "Dado de baja"){
            buttonCancelar.innerText = "Reanudar la suscripción periodica"
        } else {
            let dis = document.getElementById("dissapear")
            dis.innerHTML = ""
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    saveButton.addEventListener("click", () => {
        const nuevosDatos = {
            usuario: userLogged,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            city: document.getElementById("city").value,
            zip: document.getElementById("zip").value,
        };

        if (nuevosDatos.password === document.getElementById("confirmPassword").value) {
            fetch('http://localhost:3000/updateAll', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nuevosDatos }),
            })
            .then(response => response.json())
            .then(data => {
                if(data.error === "samePassword"){
                    showAlert("La contraseña nueva no puede ser la misma que la anterior", "warning")
                } else {
                    showSuccessMessage();
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            showAlert('Las contraseñas no coinciden', 'warning');
        }        
    })

    const populateForm = (formId, data) => {
        const form = document.getElementById(formId);
        for (const [key, value] of Object.entries(data)) {
            const input = form.elements[key];
            if (input) input.value = value;
        }
    };
});

const showSuccessMessage = () => {

    const formContainer = document.querySelector('.container');
    formContainer.innerHTML = `
        <div class="success-message">
            <h2>¡Cambios guardados con éxito!</h2>
            <p>Serás redirigido en 3 segundos...</p>
        </div>
    `;
    
    setTimeout(() => {
        window.location.href = "../index.html?name=" + userLogged;
    }, 3000); 
};

function confirmarBaja() {
    document.getElementById("confirmationPopup").style.display = "flex";
}

function darDeBaja() {
    const popupContent = document.getElementById("popupContent");
    let datosUpdate = ""
    popupContent.innerHTML = "<h3>Lo lamentamos, esperamos que vuelva a usar nuestros servicios pronto.</h3>";

    if(allData.estado === "Activa"){
        datosUpdate = {
            userId: userLogged,
            estado: "Dado de baja"
        }
        popupContent.innerHTML = "<h3>Lo lamentamos, esperamos que vuelva a usar nuestros servicios pronto.</h3>";
    } else{
        datosUpdate = {
            userId: userLogged,
            estado: "Activa"
        }
        popupContent.innerHTML = "<h3>Muchas gracias por volver a confiar en nosotros, esperemos que se quede por mucho tiempo.</h3>";
    }

    fetch('http://localhost:3000/update-estado', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ datosUpdate }),
    })
    .then(response => response.json())
    .then(data => {
        setTimeout(() => {
            cerrarPopup();
        }, 3000);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function cerrarPopup() {
    document.getElementById("confirmationPopup").style.display = "none";
    location.reload()
}

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