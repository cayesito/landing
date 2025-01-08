function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),  
    results = regex.exec(location.search)
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "))
}

let prodId = getParameterByName('prodId')
let userLogged = getParameterByName('name')

document.addEventListener('DOMContentLoaded', function() {

    const backButton = document.getElementById("homeButton")
    const previousPageUrl = "../index.html?name=" + userLogged;
    backButton.setAttribute("href", previousPageUrl);
    const contactButton = document.getElementById("contactButton")
    const previousPageUrlContact = previousPageUrl + "#footer"
    contactButton.setAttribute("href", previousPageUrlContact)

    fetch('http://localhost:3000/buscar-producto?prodId=' + prodId)
    .then(response => response.json())
    .then(data => {
        populateForm("prodForm", data)
        populateForm("imageForm", data)
    })
    .catch(error => {
        console.error('Error:', error);
    });

    const populateForm = (formId, data) => {
        const form = document.getElementById(formId)
        for (const [key, value] of Object.entries(data)) {
            const element = form.querySelector(`#${key}`)
            if (element) {
                if (element.tagName === 'IMG') {
                    element.src = value;
                } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
                    element.value = value;
                } else {
                    if (key === 'precio') {
                        element.textContent = `${value} €`;
                    } else {
                        element.textContent = value;
                    }
                }
            }
        }
    }
    const productosContainer = document.getElementById('productosContainer');

    fetch('http://localhost:3000/allProductos')
        .then(response => response.json())
        .then(data => {
            generarTarjetasProductos(data);
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
        });

    function generarTarjetasProductos(productos) {
        productosContainer.innerHTML = '';

        productos.forEach(producto => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'producto';
            tarjeta.dataset.id = producto.id;
            console.log(producto)
            tarjeta.innerHTML = `
                <img src="${producto.image1}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p class="precio">${producto.precio} €</p>
                <p class="stock">Stock: <span>${producto.stock}</span></p>
            `;

            console.log(tarjeta)

            tarjeta.addEventListener('click', () => {
                const urlProducto = `../views/buy.html?prodId=${producto.id}&name=${userLogged}`;
                window.location.href = urlProducto;
            });

            productosContainer.appendChild(tarjeta);
        });
    }

    const productosButton = document.getElementById('productosButton');
    const mainContent = document.getElementById('mainContent');

    productosButton.addEventListener('click', (event) => {
        event.preventDefault();
        mainContent.style.display = 'none';
        productosContainer.style.display = 'flex';
    });
})

let currentImageIndex = 0;

function cambiarImagen(direction, event) {
    event.preventDefault();  // Evita la recarga de la página

    const images = document.querySelectorAll(".carrusel-imagenes img");
    currentImageIndex += direction;

    if (currentImageIndex >= images.length) {
        currentImageIndex = 0;  // Vuelve a la primera imagen
    } else if (currentImageIndex < 0) {
        currentImageIndex = images.length - 1;  // Va a la última imagen
    }

    // Desplazamos el contenedor para que solo una imagen sea visible
    const offset = -currentImageIndex * 300;  // 300px es el ancho de la imagen
    document.querySelector(".carrusel-imagenes").style.transform = `translateX(${offset}px)`;
}


function mostrarPopUp(event) {
    event.preventDefault();
    document.getElementById("popup").style.display = "flex";
}
function cerrarPopUp() {
    document.getElementById("popup").style.display = "none";
}

function confirmarPedido() {

    const cantidad = document.getElementById("cantidad").value;

    const nuevosDatos = {
        userId: userLogged,
        prodId: prodId,
        cantidad: cantidad
    }

    fetch('http://localhost:3000/comprar', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },  
        body: JSON.stringify({ nuevosDatos }),
    })
    .then(response => response.json())
    .then(data => {
        if(data.error == 'undefined'){
            showAlert(data.error, "warning")
        } else{
            showAlert("Muchas gracias por su compra!", 'success')
            cerrarPopUp();
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function cambiarCantidad(direction) {
    const cantidadInput = document.getElementById("cantidad");
    let cantidad = parseInt(cantidadInput.value);

    cantidad += direction;

    if (cantidad < 1) {
        cantidad = 1;
    }

    cantidadInput.value = cantidad;
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

const productosButton = document.getElementById('productosButton');
const mainContent = document.getElementById('mainContent');
const productosContainer = document.getElementById('productosContainer');

productosButton.addEventListener('click', (event) => {
    event.preventDefault();
    mainContent.style.display = 'none';
    productosContainer.style.display = 'block';
});