const contenedorProductos = document.getElementById('contenedor-productos');
const contenedorCarrito = document.getElementById('carrito-contenedor');
const botonVaciar = document.getElementById('vaciar-carrito');
const contadorCarrito = document.getElementById('contadorCarrito');
const precioTotal = document.getElementById('precioTotal');

let carrito = [];

// Evento que se ejecuta cuando se carga completamente el DOM
document.addEventListener('DOMContentLoaded', () => {
    localStorage.removeItem('carrito'); // Vaciamos el localStorage al cargar la página

    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        actualizarCarrito();
    }

    // Obtenemos los datos del archivo JSON llamado ropa.json utilizando Fetch
    fetch('ropa.json') 
        .then(response => response.json())
        .then(data => {
            stockPrendas = data; // Asigna los datos del JSON a la variable stockPrendas
            stockPrendas.forEach(producto => {
                const div = document.createElement('div');
                div.classList.add('producto');
                div.innerHTML = `
                    <img src="${producto.img}" alt="">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.desc}</p>
                    <p>Talle: ${producto.talle}</p>
                    <p class="precioProducto">Precio: $ ${producto.precio}</p>
                    <button id="agregar${producto.id}" class="boton-agregar">Agregar <i class="fas fa-shopping-cart"></i></button>
                `;
                contenedorProductos.appendChild(div);

                const boton = document.getElementById(`agregar${producto.id}`);
                boton.addEventListener('click', () => {
                    agregarAlCarrito(producto.id);
                });
            });
        })
        .catch(error => {
            console.log('Error al obtener los productos:', error);
        });
});

// Evento que se ejecuta y vacia el carrito al hacer click en el botón "Vaciar carrito"
botonVaciar.addEventListener('click', () => {
    carrito.length = 0;
    actualizarCarrito();
});

// Función para agregar un producto al carrito
function agregarAlCarrito(prodId) {
    const existe = carrito.some(prod => prod.id === prodId);

    if (existe) {
        carrito.forEach(prod => {
            if (prod.id === prodId) {
                prod.cantidad++;
                prod.agregadoHace = moment();
            }
        });
    } else {
        const item = stockPrendas.find(prod => prod.id === prodId);
        item.agregadoHace = moment();
        carrito.push(item);
    }
    actualizarCarrito();
}

// Función para eliminar un producto del carrito utilizando el arrow function
const eliminarDelCarrito = (prodId) => {
    const item = carrito.find(prod => prod.id === prodId);
    const indice = carrito.indexOf(item);
    carrito.splice(indice, 1);
    actualizarCarrito();
};

// Función para actualizar la vista del carrito
function actualizarCarrito() {
    contenedorCarrito.innerHTML = '';

    carrito.forEach(prod => {
        const div = document.createElement('div');
        div.className = 'productoEnCarrito';
        div.innerHTML = `
            <p>${prod.nombre}</p>
            <p> Precio: $${prod.precio}</p>
            <p> Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
            <p> -- Agregado hace: ${moment(prod.agregadoHace).fromNow()}</p>
            <button onclick="eliminarDelCarrito(${prod.id})" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
        `;

        contenedorCarrito.appendChild(div);

        localStorage.setItem('carrito', JSON.stringify(carrito));
    });

    contadorCarrito.innerText = carrito.length;
    precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.cantidad * prod.precio, 0);
}
