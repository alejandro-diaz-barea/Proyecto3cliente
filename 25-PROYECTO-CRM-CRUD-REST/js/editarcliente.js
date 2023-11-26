import { mostrarToast } from './mensaje.js';
import { guardarHistorialPersistente } from './historialCambios.js';
import {actualizarNumeroTotalClientes, abrirBaseDeDatos } from './database.js';
document.addEventListener('DOMContentLoaded', async () => {


  // Actualizar el total de clientes
  const clienteArribaIzquierda = document.querySelector('a[href="index.html"]');

  abrirBaseDeDatos("CRM", 1)
    .then((db) => {
      actualizarNumeroTotalClientes(db, clienteArribaIzquierda)
      })
    .catch((error) => console.error(error));
  



    const dbName = 'CRM';
    const dbVersion = 1;
    let db;
  
    // Abrir la base de datos
    const request = indexedDB.open(dbName, dbVersion);
  
    request.onerror = (event) => {
      console.log('Error al abrir la base de datos.');
    }
  
    request.onsuccess = (event) => {
      db = event.target.result;

    

      mostrarClientes();
    }
  
    request.onupgradeneeded = (event) => {
      db = event.target.result;
      let objectStore;
  
      // Crear el almacén de objetos si no existe
      if (!db.objectStoreNames.contains('cliente')) {
        objectStore = db.createObjectStore('cliente', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('nombre', 'nombre', { unique: false });
        objectStore.createIndex('email', 'email', { unique: true });
        objectStore.createIndex('telefono', 'telefono', { unique: true });
        objectStore.createIndex('empresa', 'empresa', { unique: false });
      }
    }
  
    // Mostrar clientes al cargar la página
    function mostrarClientes() {
      if (!db) {
        console.error('Base de datos no disponible.');
        return;
      }
  
      // Obtener el ID del cliente de la URL
      const urlParams = new URLSearchParams(window.location.search);
      const clientId = urlParams.get('id');
  
      // Leer el cliente de la base de datos
      const transaction = db.transaction(['cliente'], 'readonly');
      const objectStore = transaction.objectStore('cliente');
      const request = objectStore.get(Number(clientId));
  
      request.onsuccess = (event) => {
        const cliente = event.target.result;
  
        if (cliente) {
          // Mostrar los datos del cliente en el formulario
          document.querySelector('#nombre').value = cliente.nombre;
          document.querySelector('#email').value = cliente.email;
          document.querySelector('#telefono').value = cliente.telefono;
          document.querySelector('#empresa').value = cliente.empresa;
          document.querySelector('#id').value = cliente.id;
        } else {
          console.error('Cliente no encontrado en la base de datos.');
        }
      }
    }
  
    // Escuchar el evento de envío del formulario
    document.querySelector('#formulario').addEventListener('submit', (event) => {
      event.preventDefault();
  
      // Obtener los valores del formulario
      const nombreInput = document.querySelector('#nombre');
      const emailInput = document.querySelector('#email');
      const telefonoInput = document.querySelector('#telefono');
      const empresaInput = document.querySelector('#empresa');
      const idInput = document.querySelector('#id');
      const nombre = nombreInput.value;
      const email = emailInput.value;
      const telefono = telefonoInput.value;
      const empresa = empresaInput.value;
      const id = idInput.value;
  
      // Verificar que los campos obligatorios estén completos
      if (nombre === '' || telefono === '' || empresa === '') {
        alert('Completa todos los campos');
        return;
      }
  
      // Iniciar una transacción de escritura en la base de datos
      const transaction = db.transaction(['cliente'], 'readwrite');
      const objectStore = transaction.objectStore('cliente');
      const index = objectStore.index('email');
  
      // Obtener el cliente original por correo electrónico
      const requestGetEmail = index.get(email);
  
      requestGetEmail.onsuccess = (event) => {
        const clienteOriginal = event.target.result;
  
        // Verificar si el correo electrónico ingresado es diferente
        // al correo electrónico original del cliente
        if (clienteOriginal && clienteOriginal.id !== id && email !== clienteOriginal.email) {
          alert('El correo electrónico ya está registrado para otro cliente. Usa otro correo electrónico.');
        } else {
          // Crear un objeto cliente con los nuevos datos
          const cliente = {
            nombre: nombre,
            email: email,
            id: Number(id),
            telefono: telefono,
            empresa: empresa
          };
          const nombreClienteEliminado = cliente.nombre
          const idClienteEliminado = cliente.id
  
          // Actualizar el cliente en la base de datos
          const requestUpdate = objectStore.put(cliente);
          // Obtener la hora actual
          const hora = new Date().toLocaleTimeString();
          requestUpdate.onsuccess = () => {
            console.log('Cliente actualizado en la base de datos');
            mostrarToast("Cliente editado con éxito");

            const fecha = new Date().toLocaleDateString();

            //Guardado en historial
            guardarHistorialPersistente(`El cliente ${nombreClienteEliminado} con id:"${idClienteEliminado}" fue editado `)

            // Limpiar los campos del formulario después de la actualización
            nombreInput.value = '';
            emailInput.value = '';
            telefonoInput.value = '';
            empresaInput.value = '';
            idInput.value = '';
          };
  
          requestUpdate.onerror = (event) => {
            console.error('Error al actualizar el cliente:', event.target.error);
            alert('Error al actualizar el cliente. Verifica los datos.');
          }
        }
      };
    });




  });
  
