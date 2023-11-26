import { mostrarToast } from './mensaje.js';
import { guardarHistorialPersistente } from './historialCambios.js';


export function abrirBaseDeDatos(nombre, version) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(nombre, version);

    request.onsuccess = (event) => resolve(event.target.result);
  });
}

export function cargarClientes(db, listadoClientes, currentPage = 1, pageSize = 4){
  const transaction = db.transaction(["cliente"], "readonly");
  const objectStore = transaction.objectStore("cliente");
  const countRequest = objectStore.count();

  countRequest.onsuccess = function () {
    const numeroTotalClientes = countRequest.result;
    const numeroTotalPaginas = Math.ceil(numeroTotalClientes / pageSize);

    const startIndex = (currentPage - 1) * pageSize;
    let count = 0;

    const cursor = objectStore.openCursor();
    cursor.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        if (count >= startIndex && count < startIndex + pageSize) {
          const { nombre, telefono, empresa, id } = cursor.value;
          const row = document.createElement("tr");
          row.innerHTML = `
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <p class="text-sm leading-5 font-medium text-gray-900">${nombre}</p>
            </td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <p class="text-sm leading-5 text-gray-900">${telefono}</p>
            </td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <p class="text-sm leading-5 text-gray-900">${empresa}</p>
            </td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
              <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
              <a href="#" data-id="${id}" class="text-red-600 hover:text-red-900 eliminar-cliente">Eliminar</a>
            </td>
          `;

          if (listadoClientes) {
            listadoClientes.appendChild(row);
          }
        }

        count++;

        if (count < startIndex + pageSize) {
          cursor.continue();
        }
      }
    };

    if (listadoClientes) {
      listadoClientes.innerHTML = '';
      listadoClientes.addEventListener("click", (e) => {
        if (e.target.classList.contains("eliminar-cliente")) {
          const clienteId = e.target.getAttribute("data-id");
          eliminarCliente(db, clienteId, listadoClientes, currentPage, pageSize);
        }
      });
    }

  };
}


export function eliminarCliente(db, clienteId, listadoClientes, currentPage, pageSize) {
  const transaction = db.transaction(["cliente"], "readwrite");
  const objectStore = transaction.objectStore("cliente");

  let nombreClienteEliminado;
  let idClienteEliminado;

  const getRequest = objectStore.get(parseInt(clienteId));
  getRequest.onsuccess = (event) => {
    const clienteEliminado = event.target.result;
    nombreClienteEliminado = clienteEliminado.nombre;
    idClienteEliminado = clienteEliminado.id;

    objectStore.delete(parseInt(clienteId)).onsuccess = () => {
      console.log("Cliente eliminado de IndexedDB");
      mostrarToast("Cliente eliminado correctamente");

      // HISTORIAL
      guardarHistorialPersistente(`El cliente ${nombreClienteEliminado} con id:"${idClienteEliminado}" fue eliminado  `);

      if (listadoClientes) {
        listadoClientes.innerHTML = "";
        cargarClientes(db, listadoClientes, currentPage, pageSize);
      }

      db.close();
    };
  };
}

export function actualizarNumeroTotalClientes(db, clienteArribaIzquierda) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["cliente"], "readonly");
    const objectStore = transaction.objectStore("cliente");
    const countRequest = objectStore.count();

    countRequest.onsuccess = function () {
      const numeroTotalClientes = countRequest.result;
      clienteArribaIzquierda.textContent = `Clientes (${numeroTotalClientes})`;
      resolve(numeroTotalClientes);
    };

    countRequest.onerror = function (error) {
      reject(error);
    };
  });
}
