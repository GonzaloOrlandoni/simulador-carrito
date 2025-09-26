const productos = [
  { id: 1, nombre: "Manzana", precio: 250 },
  { id: 2, nombre: "Banana", precio: 190 },
  { id: 3, nombre: "Naranja", precio: 220 },
  { id: 4, nombre: "Leche", precio: 890 },
  { id: 5, nombre: "Café", precio: 2100 },
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let descuento = 0;

const cupones = {
  AHORRO10: 0.1,
  ALUMNO20: 0.2,
};

// Formatea precios
function moneda(valor) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(valor);
}

// Renderiza productos disponibles
function renderizarProductos() {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";
  productos.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
      <h3>${p.nombre}</h3>
      <p>${moneda(p.precio)}</p>
      <button onclick="agregarAlCarrito(${p.id})">Agregar</button>
    `;
    contenedor.appendChild(div);
  });
}

// Renderiza carrito
function renderizarCarrito() {
  const contenedor = document.getElementById("carrito");
  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>El carrito está vacío.</p>";
    document.getElementById("total").textContent = "Total: $0";
    return;
  }

  carrito.forEach((item, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p>${item.cantidad} x ${item.nombre} - ${moneda(item.precio * item.cantidad)}
      <button onclick="eliminarDelCarrito(${index})">❌</button></p>
    `;
    contenedor.appendChild(div);
  });

  actualizarTotal();
}

// Agregar producto al carrito
function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  const itemExistente = carrito.find((i) => i.id === id);

  if (itemExistente) {
    itemExistente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  guardarCarrito();
  renderizarCarrito();
}

// Eliminar producto
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  renderizarCarrito();
}

// Guardar en localStorage
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Calcular y actualizar total
function actualizarTotal() {
  let total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  if (descuento > 0) total -= total * descuento;
  document.getElementById("total").textContent = "Total: " + moneda(total);
}

// Aplicar cupón
document.getElementById("aplicarCupon").addEventListener("click", () => {
  const codigo = document.getElementById("cupon").value.toUpperCase();
  if (cupones[codigo]) {
    descuento = cupones[codigo];
    alert(`Cupón aplicado: ${codigo}`);
  } else {
    descuento = 0;
    alert("Cupón inválido.");
  }
  actualizarTotal();
});

// Finalizar compra
document.getElementById("finalizar").addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }
  alert("Compra realizada con éxito. ¡Gracias por tu compra!");
  carrito = [];
  guardarCarrito();
  renderizarCarrito();
});

// Inicializa
renderizarProductos();
renderizarCarrito();
