// js/simulador.js

// --- ESTADO DE LA APLICACIÓN ---
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let descuento = 0;
const cupones = {
  AHORRO10: 0.1,
  ALUMNO20: 0.2,
};

// --- FUNCIONES AUXILIARES ---
function moneda(valor) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(valor);
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function calcularTotalNumerico() {
  let total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  if (descuento > 0) total -= total * descuento;
  return total;
}

// --- RENDERIZADO DEL DOM ---
function renderizarProductos(productos) {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";
  productos.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
      <h3>${p.nombre}</h3>
      <p>${moneda(p.precio)}</p>
    `;
    const boton = document.createElement("button");
    boton.innerText = "Agregar";
    boton.addEventListener("click", () => agregarAlCarrito(p));
    div.appendChild(boton);
    contenedor.appendChild(div);
  });
}

function renderizarCarrito() {
  const contenedor = document.getElementById("carrito");
  contenedor.innerHTML = "";
  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>El carrito está vacío.</p>";
    actualizarTotal();
    return;
  }
  carrito.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("carrito-item");
    div.innerHTML = `
      <span>${item.cantidad} x ${item.nombre} - ${moneda(item.precio * item.cantidad)}</span>
      <button class="btn-eliminar">❌</button>
    `;
    div.querySelector(".btn-eliminar").addEventListener("click", () => eliminarDelCarrito(index));
    contenedor.appendChild(div);
  });
  actualizarTotal();
}

function actualizarTotal() {
  const total = calcularTotalNumerico();
  document.getElementById("total").textContent = "Total: " + moneda(total);
}

// --- LÓGICA DE NEGOCIO ---
function agregarAlCarrito(producto) {
  const itemExistente = carrito.find((i) => i.id === producto.id);
  if (itemExistente) {
    itemExistente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  guardarCarrito();
  renderizarCarrito(); // Notificación Toastify

  Toastify({
    text: `Se agregó "${producto.nombre}" al carrito`,
    duration: 2000,
    gravity: "bottom",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
}

function eliminarDelCarrito(index) {
  const itemEliminado = carrito[index];
  carrito.splice(index, 1);
  guardarCarrito();
  renderizarCarrito(); // Notificación Toastify

  Toastify({
    text: `Se eliminó "${itemEliminado.nombre}" del carrito`,
    duration: 2000,
    gravity: "bottom",
    style: {
      background: "#ef476f",
    },
  }).showToast();
}

function aplicarCupon() {
  const codigo = document.getElementById("cupon").value.toUpperCase();
  if (cupones[codigo]) {
    descuento = cupones[codigo];
    Swal.fire({
      icon: "success",
      title: "¡Cupón aplicado!",
      text: `Se aplicó un ${descuento * 100}% de descuento.`,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2500,
    });
  } else {
    descuento = 0;
    document.getElementById("cupon").value = "";
    Swal.fire({
      icon: "error",
      title: "Cupón inválido",
      text: "El código ingresado no es correcto.",
    });
  }
  actualizarTotal();
}

function finalizarCompra() {
  if (carrito.length === 0) {
    Swal.fire({ icon: "warning", title: "Carrito vacío", text: "Agrega productos antes de finalizar la compra." });
    return;
  }
  const total = calcularTotalNumerico();
  Swal.fire({
    title: "¿Confirmar compra?",
    text: `El total de tu compra es ${moneda(total)}.`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#2980b9",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, comprar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      carrito = [];
      descuento = 0;
      document.getElementById("cupon").value = "";
      guardarCarrito();
      renderizarCarrito();
      Swal.fire("¡Compra realizada!", "Gracias por tu compra. Recibirás los detalles por email.", "success");
    }
  });
}

// --- INICIALIZACIÓN Y CARGA DE DATOS ---
async function inicializar() {
  const productos = await fetchProductos();
  if (productos) {
    renderizarProductos(productos);
    renderizarCarrito();
    document.getElementById("aplicarCupon").addEventListener("click", aplicarCupon);
    document.getElementById("finalizar").addEventListener("click", finalizarCompra);
  }
}

async function fetchProductos() {
  try {
    const response = await fetch("./data.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("No se pudieron cargar los productos:", error);
    Swal.fire("Error", "No se pudieron cargar los productos. Por favor, intenta recargar la página.", "error");
    return null;
  }
}

// --- EJECUCIÓN ---
// Esperamos a que el DOM esté completamente cargado para ejecutar el script
document.addEventListener("DOMContentLoaded", inicializar);
