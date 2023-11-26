
import { mostrarToast } from './mensaje.js';
import { guardarHistorialPersistente } from './historialCambios.js';
import {actualizarNumeroTotalClientes, abrirBaseDeDatos } from './database.js';


document.addEventListener("DOMContentLoaded", () => {

  // Actualizar el total de clientes
  const clienteArribaIzquierda = document.querySelector('a[href="index.html"]');

  abrirBaseDeDatos("CRM", 1)
    .then((db) => {
      actualizarNumeroTotalClientes(db, clienteArribaIzquierda)
      })
    .catch((error) => console.error(error));
  

  const inputNombre = document.querySelector("#nombre");
  const inputEmail = document.querySelector("#email");
  const inputTelefono = document.querySelector("#telefono");
  const inputEmpresa = document.querySelector("#empresa");
  const formulario = document.querySelector("#formulario");

  // Agregar eventos de blur para validar campos
  inputNombre.addEventListener("blur", validar);
  inputEmail.addEventListener("blur", validar);
  inputTelefono.addEventListener("blur", validar);
  inputEmpresa.addEventListener("blur", validar);

  // Función para validar campos al perder el foco
  function validar(e) {
    if (e.target.value.trim() === "") {
      mostrarAlerta(`El campo ${e.target.id} es obligatorio`, e.target.parentElement);
      return;
    }

    if (e.target === inputEmail) {
      verificarEmailDuplicado(e.target.value);
    } else {
      limpiarAlerta(e.target.parentElement);
    }
  }

  // Función para limpiar alertas de errores
  function limpiarAlerta(referencia) {
    const alerta = referencia.querySelector(".bg-red-600");
    if (alerta) {
      alerta.remove();
    }
  }

  // Función para mostrar alertas de errores
  function mostrarAlerta(mensaje, referencia) {
    limpiarAlerta(referencia);

    const error = document.createElement("P");
    error.textContent = mensaje;
    error.classList.add("bg-red-600", "text-center", "text-white", "p-2");
    referencia.appendChild(error);
  }

  // Evento de envío del formulario
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    if (inputNombre.value.trim() === "" || inputEmail.value.trim() === "" || inputTelefono.value.trim() === "" || inputEmpresa.value.trim() === "") {
      mostrarAlerta("Por favor, complete todos los campos antes de enviar el formulario.", formulario);
    } else {
      const cliente = {
        nombre: inputNombre.value,
        email: inputEmail.value,
        telefono: inputTelefono.value,
        empresa: inputEmpresa.value,
      };
      guardarEnIndexedDB(cliente);
    }
  });

  // Función para verificar si el email ya está registrado
  function verificarEmailDuplicado(email) {
    const request = indexedDB.open("CRM", 1);

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(["cliente"], "readonly");
      const objectStore = transaction.objectStore("cliente");
      const index = objectStore.index("email");

      const getRequest = index.get(email);

      getRequest.onsuccess = function () {
        const existingCliente = getRequest.result;
        if (existingCliente) {
          mostrarAlerta("El correo electrónico ya está registrado para otro cliente. Usa otro correo electrónico.", inputEmail.parentElement);
        } else {
          limpiarAlerta(inputEmail.parentElement);
          const cliente = {
            nombre: inputNombre.value,
            email: inputEmail.value,
            telefono: inputTelefono.value,
            empresa: inputEmpresa.value,
          };
        }
      };

      transaction.oncomplete = function () {
        db.close();
      };
    };

    request.onerror = function (event) {
      console.error("Error al abrir la base de datos:", event.target.error);
    };
  }

  // Función para guardar el cliente en IndexedDB
  function guardarEnIndexedDB(cliente) {
    const request = indexedDB.open("CRM", 1);
  
    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(["cliente"], "readwrite");
      const objectStore = transaction.objectStore("cliente");
  
      // Asignar un id al cliente
      cliente.id = Date.now(); // Puedes utilizar una estrategia diferente para asignar ids
  
      const request = objectStore.add(cliente);
  
      request.onsuccess = function () {
        console.log("Cliente añadido a IndexedDB");
        mostrarToast("Cliente añadido con éxito");
        // HISTORIAL DE CLIENTE CREADO
        guardarHistorialPersistente(`El nuevo cliente ${cliente.nombre} con id:"${cliente.id}" se añadió `)
        formulario.reset();
      };
  
      transaction.oncomplete = function () {
        db.close();
      };
    };
  
    request.onerror = function (event) {
      console.error("Error al abrir la base de datos:", event.target.error);
    };
  }
});