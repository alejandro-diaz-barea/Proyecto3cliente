import { abrirBaseDeDatos, cargarClientes, actualizarNumeroTotalClientes } from './database.js';

document.addEventListener("DOMContentLoaded", () => {
  // Selector
  const listadoClientes = document.querySelector("#listado-clientes");
  const clienteArribaIzquierda = document.querySelector('a[href="/"]');

  // Paginación
  
  const pageSize = 4; // Número máximo de clientes por página
  let currentPage = 1; // Página actual, comienza en la primera página
  let numeroTotalPaginas = 1; // Número total de páginas, inicializado a 1

  // Resto del código para estilizar los botones
  const contenedorBotones = document.createElement('div'); // Contenedor para los botones
  contenedorBotones.style.cssText = 'text-align: center; margin-top: 20px;'; // Estilos del contenedor

  // Añadir botones al contenedor
  const izquierdaButton = document.createElement('button');
  izquierdaButton.innerHTML = '←';
  izquierdaButton.classList.add('boton-paginacion');
  contenedorBotones.appendChild(izquierdaButton);
  izquierdaButton.addEventListener('click', function () {
    if (currentPage > 1) {
      currentPage--;
      updateVisibleRows();
      actualizarNumeroPagina();
    }
  });

  const numeroPagina = document.createElement('span');
  numeroPagina.style.cssText = 'margin: 0 10px; font-size: 18px;';
  contenedorBotones.appendChild(numeroPagina);
  actualizarNumeroPagina();

  const derechaButton = document.createElement('button');
  derechaButton.innerHTML = '→';
  derechaButton.classList.add('boton-paginacion');
  contenedorBotones.appendChild(derechaButton);
  derechaButton.addEventListener('click', function () {
    if (currentPage < numeroTotalPaginas) {
      currentPage++;
      updateVisibleRows();
      actualizarNumeroPagina();
    }
  });

  // Obtener el div existente en el html para poner debajo los botones
  const divExistente = document.querySelector('.flex.flex-col.mt-10');

  // Insertar el contenedor después del div existente
  divExistente.insertAdjacentElement('afterend', contenedorBotones);

  // Aplicar css desde js
  const estiloBoton = 'font-size: 24px; padding: 10px 20px; cursor: pointer; background-color: #38b2ac; color: #ffffff; border: none; border-radius: 5px; margin: 0 10px;';

  izquierdaButton.style.cssText = estiloBoton;
  derechaButton.style.cssText = estiloBoton;

  //llamada a la base de datos para actualizar el numero de clientes, cargarlos y mostrarlo por pantalla
  const updateVisibleRows = () => {
    abrirBaseDeDatos("CRM", 1)
      .then((db) => {
        return actualizarNumeroTotalClientes(db, clienteArribaIzquierda)
          .then((numeroTotalClientes) => {
            numeroTotalPaginas = Math.ceil(numeroTotalClientes / pageSize);
            return db;
          });
      })
      .then((db) => {
        cargarClientes(db, listadoClientes, currentPage, pageSize);
      })
      .catch((error) => console.error(error));
  };
  
  updateVisibleRows();

  function actualizarNumeroPagina() {
    numeroPagina.textContent = `Página ${currentPage}`;
  }
});
