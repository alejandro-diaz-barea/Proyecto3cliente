// historial 
const historialBtn = document.createElement("button");
historialBtn.id = "historialBtn";
historialBtn.classList.add("bg-teal-500", "hover:bg-teal-700", "text-white", "font-bold", "text-base", "py-1", "px-3", "my-4", "rounded-md", "mx-auto", "block");
historialBtn.textContent = "Historial de Cambios";

const tituloClientes = document.querySelector(".text-3xl");
tituloClientes.parentNode.insertBefore(historialBtn, tituloClientes.nextSibling);

// Elemento para mostrar el historial
const historialContainer = document.createElement("div");
historialContainer.id = "historialContainer";
document.body.appendChild(historialContainer);

// Ventana emergente para el historial
const popupContainer = document.createElement("div");
popupContainer.id = "popupContainer";
popupContainer.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "flex", "items-center", "justify-center", "bg-gray-800", "bg-opacity-75", "hidden");
document.body.appendChild(popupContainer);

historialBtn.addEventListener("click", () => {
  mostrarHistorialEnPantalla();
});

function mostrarHistorialEnPantalla() {
  // Oculta solo el contenido de la tabla
  const contenidoClientes = document.querySelector("#listado-clientes");
  if (contenidoClientes) {
    contenidoClientes.style.visibility = "hidden";
  }

  // Muestra la ventana emergente
  popupContainer.innerHTML = formatearHistorial(obtenerHistorialPersistente()) || "Historial vacío";
  popupContainer.style.display = "flex";
}

// Función para cerrar la ventana emergente
popupContainer.addEventListener("click", () => {
  // Muestra nuevamente el contenido de la tabla
  const contenidoClientes = document.querySelector("#listado-clientes");
  if (contenidoClientes) {
    contenidoClientes.style.visibility = "visible";
  }

  popupContainer.style.display = "none";
});

function obtenerHistorialPersistente() {
  // Obtener el historial almacenado en localStorage
  return localStorage.getItem("historialCambios");
}

function formatearHistorial(historial) {
  if (!historial) {
    return null;
  }

  // Dividir el historial en líneas
  const lineas = historial.split('\n');

  // Formatear cada línea y agregar un salto de línea después de cada una
  const historialFormateado = lineas.map((linea) => {
    const fechaHora = linea.match(/\d{2}:\d{2}:\d{2} el \d{2}\/\d{2}\/\d{4} a las \d{2}:\d{2}:\d{2}/);
    return fechaHora ? `${linea} a las ${fechaHora[0]}` : linea;
  }).join('<br>');

  return historialFormateado;
}

export function guardarHistorialPersistente(mensaje) {
  // Obtener el historial actual
  const historialActual = obtenerHistorialPersistente();

  // Obtener la fecha y hora actual
  const fechaActual = new Date();
  const horaActual = fechaActual.toLocaleTimeString();
  const fechaFormateada = fechaActual.toLocaleDateString();

  // Formatear el nuevo mensaje
  const mensajeConFecha = `${mensaje} a las ${horaActual} el ${fechaFormateada}`;

  // Verificar si el nuevo mensaje ya está en el historial actual
  const mensajes = historialActual ? historialActual.split('\n') : [];
  if (mensajes.includes(mensajeConFecha)) {
    return; // Evitar duplicados
  }

  // Concatenar el nuevo mensaje con el historial existente y agregar un salto de línea
  const historialNuevo = historialActual ? `${historialActual}\n${mensajeConFecha}` : mensajeConFecha;

  // Guardar el historial en localStorage
  localStorage.setItem("historialCambios", historialNuevo);
}
