const productosDisponibles = [
    {
        sku: "0K3QOSOV4V",
        title: "iPhone 13 Pro",
        price: 938.99
    },
    {
        sku: "TGD5XORY1L",
        title: "Cargador",
        price: 49.99
    },
    {
        sku: "IOKW9BQ9F3",
        title: "Funda de piel",
        price: 79.99
    }
];

class Carrito {
    constructor(productos) {
        this.productosDisponibles = productos;
        this.productos = [];
        this.currency = "€";
    }

    agregarProducto(sku, unidades) {
        const producto = this.productosDisponibles.find(function (item) {
            return item.sku === sku;
        });

        if (!producto) {
            return false;
        }

        const productoEnCarrito = this.productos.find(function (item) {
            return item.sku === sku;
        });

        if (productoEnCarrito) {
            productoEnCarrito.quantity += unidades;
        } else {
            this.productos.push({
                sku: producto.sku,
                title: producto.title,
                price: producto.price,
                quantity: unidades
            });
        }

        return true;
    }

    actualizarUnidades(sku, unidades) {
        const producto = this.productos.find(function (item) {
            return item.sku === sku;
        });

        if (!producto || unidades < 1 || !Number.isInteger(unidades)) {
            return false;
        }

        producto.quantity = unidades;
        return true;
    }

    eliminarProducto(sku) {
        const posicion = this.productos.findIndex(function (item) {
            return item.sku === sku;
        });

        if (posicion === -1) {
            return false;
        }

        this.productos.splice(posicion, 1);
        return true;
    }

    obtenerInformacionProducto(sku) {
        const producto = this.productos.find(function (item) {
            return item.sku === sku;
        });

        if (!producto) {
            return null;
        }

        return {
            sku: producto.sku,
            title: producto.title,
            price: producto.price,
            quantity: producto.quantity
        };
    }

    obtenerCarrito() {
        let total = 0;

        this.productos.forEach(function (producto) {
            total += producto.price * producto.quantity;
        });

        return {
            total: total,
            currency: this.currency,
            products: this.productos
        };
    }
}

const carrito = new Carrito(productosDisponibles);

const formularioAnadir = document.getElementById("formulario-anadir");
const selectorProducto = document.getElementById("producto");
const campoUnidades = document.getElementById("unidades");
const contenidoCarrito = document.getElementById("contenido-carrito");
const totalCarrito = document.getElementById("total");
const mensaje = document.getElementById("mensaje");

function formatoPrecio(precio) {
    return precio.toLocaleString("es-ES", {
        style: "currency",
        currency: "EUR"
    });
}

function cargarProductos() {
    selectorProducto.innerHTML = '<option value="">Selecciona un producto</option>';

    productosDisponibles.forEach(function (producto) {
        const opcion = document.createElement("option");
        opcion.value = producto.sku;
        opcion.textContent = producto.title + " — " + formatoPrecio(producto.price);
        selectorProducto.appendChild(opcion);
    });
}

function mostrarMensaje(texto, esError) {
    mensaje.textContent = texto;
    mensaje.classList.toggle("error", esError);
}

function mostrarCarrito() {
    const informacion = carrito.obtenerCarrito();

    contenidoCarrito.innerHTML = "";

    if (informacion.products.length === 0) {
        const textoVacio = document.createElement("p");
        textoVacio.textContent = "El carrito está vacío.";
        contenidoCarrito.appendChild(textoVacio);
    } else {
        const contenedorTabla = document.createElement("div");
        contenedorTabla.className = "tabla-contenedor";

        const tabla = document.createElement("table");
        const cabecera = document.createElement("thead");
        const filaCabecera = document.createElement("tr");

        ["Producto", "Precio", "Unidades", "Subtotal", "Acciones"].forEach(function (texto) {
            const th = document.createElement("th");
            th.textContent = texto;
            filaCabecera.appendChild(th);
        });

        cabecera.appendChild(filaCabecera);
        tabla.appendChild(cabecera);

        const cuerpo = document.createElement("tbody");

        informacion.products.forEach(function (producto) {
            const fila = document.createElement("tr");

            const celdaNombre = document.createElement("td");
            celdaNombre.textContent = producto.title;

            const celdaPrecio = document.createElement("td");
            celdaPrecio.textContent = formatoPrecio(producto.price);

            const celdaCantidad = document.createElement("td");
            const entradaCantidad = document.createElement("input");
            entradaCantidad.type = "number";
            entradaCantidad.min = "1";
            entradaCantidad.step = "1";
            entradaCantidad.value = producto.quantity;
            entradaCantidad.className = "cantidad-edicion";
            entradaCantidad.setAttribute("aria-label", "Unidades de " + producto.title);
            celdaCantidad.appendChild(entradaCantidad);

            const celdaSubtotal = document.createElement("td");
            celdaSubtotal.textContent = formatoPrecio(producto.price * producto.quantity);

            const celdaAcciones = document.createElement("td");
            const botones = document.createElement("div");
            botones.className = "acciones";

            const botonActualizar = document.createElement("button");
            botonActualizar.type = "button";
            botonActualizar.className = "boton-secundario";
            botonActualizar.textContent = "Actualizar";
            botonActualizar.addEventListener("click", function () {
                const nuevasUnidades = Number(entradaCantidad.value);

                if (!Number.isInteger(nuevasUnidades) || nuevasUnidades < 1) {
                    mostrarMensaje("Introduce una cantidad entera de al menos 1.", true);
                    return;
                }

                carrito.actualizarUnidades(producto.sku, nuevasUnidades);
                mostrarMensaje("Unidades actualizadas.", false);
                mostrarCarrito();
            });

            const botonEliminar = document.createElement("button");
            botonEliminar.type = "button";
            botonEliminar.className = "boton-eliminar";
            botonEliminar.textContent = "Eliminar";
            botonEliminar.addEventListener("click", function () {
                carrito.eliminarProducto(producto.sku);
                mostrarMensaje("Producto eliminado del carrito.", false);
                mostrarCarrito();
            });

            botones.appendChild(botonActualizar);
            botones.appendChild(botonEliminar);
            celdaAcciones.appendChild(botones);

            fila.appendChild(celdaNombre);
            fila.appendChild(celdaPrecio);
            fila.appendChild(celdaCantidad);
            fila.appendChild(celdaSubtotal);
            fila.appendChild(celdaAcciones);
            cuerpo.appendChild(fila);
        });

        tabla.appendChild(cuerpo);
        contenedorTabla.appendChild(tabla);
        contenidoCarrito.appendChild(contenedorTabla);
    }

    totalCarrito.textContent = formatoPrecio(informacion.total);
}

formularioAnadir.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const sku = selectorProducto.value;
    const unidades = Number(campoUnidades.value);

    if (sku === "") {
        mostrarMensaje("Selecciona un producto.", true);
        return;
    }

    if (!Number.isInteger(unidades) || unidades < 1) {
        mostrarMensaje("Introduce una cantidad entera de al menos 1.", true);
        return;
    }

    const agregado = carrito.agregarProducto(sku, unidades);

    if (agregado) {
        mostrarMensaje("Producto añadido al carrito.", false);
        campoUnidades.value = "1";
        mostrarCarrito();
    } else {
        mostrarMensaje("No se ha encontrado ese producto.", true);
    }
});

cargarProductos();
mostrarCarrito();
