const productos = [
  { id: 1, nombre: "Manzana", precio: 250 },
  { id: 2, nombre: "Banana", precio: 190 },
  { id: 3, nombre: "Naranja", precio: 220 },
  { id: 4, nombre: "Leche", precio: 890 },
  { id: 5, nombre: "Café", precio: 2100 },
];

let carrito = [];

const cupones = {
  AHORRO10: 0.1,
  ALUMNO20: 0.2,
};

console.log("Productos cargados:", productos);
console.log("Carrito inicial:", carrito);
console.log("Cupones disponibles:", cupones);

function moneda(valor) {
  try {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(valor);
  } catch {
    return "$" + Number(valor).toFixed(2);
  }
}

function listarProductos() {
  let lista = productos.map((p) => `${p.id} - ${p.nombre} (${moneda(p.precio)})`).join("\n");
  console.log("Lista de productos disponibles:\n" + lista);
  alert("Lista de productos disponibles:\n\n" + lista);
}

function agregarAlCarrito() {
  listarProductos();
  let id = prompt("Ingrese el ID del producto que desea agregar al carrito:");
  id = Number(id);
  if (isNaN(id) || id < 1 || id > productos.length) {
    alert("ID inválido. Intente nuevamente.");
    return;
  }

  let cantidad = prompt(`¿Cuántas unidades de "${productos[id - 1].nombre}" desea agregar?`);
  cantidad = Number(cantidad);
  if (isNaN(cantidad) || cantidad < 1) {
    alert("Cantidad inválida. Intente nuevamente.");
    return;
  }

  let itemExistente = carrito.find((item) => item.id === id);
  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    carrito.push({
      id: id,
      nombre: productos[id - 1].nombre,
      precio: productos[id - 1].precio,
      cantidad: cantidad,
    });
  }

  alert(`Se agregaron ${cantidad} x ${productos[id - 1].nombre} al carrito.`);
  console.log("Carrito actual:", carrito);
}

function verCarrito() {
  if (carrito.length === 0) {
    console.log("El carrito está vacío.");
    alert("El carrito está vacío.");
    return 0;
  }

  let total = 0;
  console.log("Contenido del carrito:");
  carrito.forEach((item) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    console.log(`${item.cantidad} x ${item.nombre} - Subtotal: ${moneda(subtotal)}`);
  });
  console.log("Total:", moneda(total));
  alert("Se mostró el carrito en la consola.");
  return total;
}

function eliminarDelCarrito() {
  if (carrito.length === 0) {
    alert("El carrito ya está vacío.");
    return;
  }
  verCarrito();
  let id = prompt("Ingrese el ID del producto a eliminar:");
  id = Number(id);
  const index = carrito.findIndex((item) => item.id === id);
  if (index === -1) {
    alert("Producto no encontrado en el carrito.");
    return;
  }
  const eliminado = carrito.splice(index, 1)[0];
  alert(`Se eliminó ${eliminado.nombre} del carrito.`);
  console.log("Carrito actual:", carrito);
}

function aplicarCupon(total) {
  let codigo = prompt("Ingrese un cupón de descuento (AHORRO10 o ALUMNO20):");
  if (!codigo) return total;

  codigo = codigo.toUpperCase();
  if (cupones[codigo]) {
    const descuento = total * cupones[codigo];
    const totalFinal = total - descuento;
    alert(`Cupón aplicado: ${codigo}\nTotal con descuento: ${moneda(totalFinal)}`);
    return totalFinal;
  } else {
    alert("Cupón inválido. No se aplicó descuento.");
    return total;
  }
}

function finalizarCompra() {
  if (carrito.length === 0) {
    alert("No hay productos en el carrito.");
    return;
  }
  let total = verCarrito();
  let aplicar = confirm("¿Desea aplicar un cupón de descuento?");
  if (aplicar) total = aplicarCupon(total);

  let confirmar = confirm(`Total a pagar: ${moneda(total)}\n¿Confirmar compra?`);
  if (confirmar) {
    alert("Compra confirmada. Gracias por su compra.");
    console.log("Compra finalizada:", carrito, "Total:", moneda(total));
    carrito = [];
  } else {
    alert("Compra cancelada.");
  }
}

function menu() {
  alert("Bienvenido al Simulador de Carrito de Compras.\nAbra la consola para ver instrucciones.");
  let salir = false;
  while (!salir) {
    let opcion = prompt(
      `MENÚ:
1) Listar productos
2) Agregar al carrito
3) Ver carrito
4) Eliminar del carrito
5) Finalizar compra
0) Salir
Ingrese una opción:`
    );

    if (opcion === null) opcion = "0";

    switch (opcion.trim()) {
      case "1":
        listarProductos();
        break;
      case "2":
        agregarAlCarrito();
        break;
      case "3":
        verCarrito();
        break;
      case "4":
        eliminarDelCarrito();
        break;
      case "5":
        finalizarCompra();
        break;
      case "0":
        salir = confirm("¿Seguro que quiere salir?");
        break;
      default:
        alert("Opción inválida.");
        break;
    }
  }
  alert("Gracias por usar el simulador. ¡Hasta la próxima!");
}

(function init() {
  menu();
})();
