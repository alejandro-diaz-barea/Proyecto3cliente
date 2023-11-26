// Crear el botón "Mandar correo a empleados"
const emailBtn = document.createElement("a");
emailBtn.href = "../../22-PROYECTO-EnviarEmail/index.html";  // Reemplaza con tu enlace personalizado
emailBtn.textContent = "Mandar correo";
emailBtn.classList.add(
  "px-3", "py-1", "text-white", "block", "hover:bg-teal-900", "mt-2", "hover:text-yellow-400", "underline-none"
);

// Encontrar el enlace "Nuevo Cliente" en la barra de navegación
const nuevoClienteLink = document.querySelector('a[href="nuevo-cliente.html"]');

// Insertar el botón justo después del enlace "Nuevo Cliente"
nuevoClienteLink.parentNode.insertBefore(emailBtn, nuevoClienteLink.nextSibling);
