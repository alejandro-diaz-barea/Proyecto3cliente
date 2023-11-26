document.addEventListener("DOMContentLoaded", () => {
    // Obtener el input de email y el contenedor del formulario
    const inputEmail = document.getElementById("email");
    const formulario = document.getElementById("formulario");
  
    // Verificar que inputEmail sea un elemento de entrada
    if (inputEmail && inputEmail.tagName.toLowerCase() === 'input') {
      // Crear el elemento select
      const selectEmails = document.createElement("select");
      selectEmails.id = "selectEmails";
      selectEmails.classList.add("border", "border-gray-300", "px-3", "py-2", "rounded-lg");
  
      // Insertar el select después del inputEmail
      inputEmail.insertAdjacentElement('afterend', selectEmails);
  
      // Agregar evento al select para llenar el campo de email
      selectEmails.addEventListener("change", () => {
        inputEmail.value = selectEmails.value;
      });
  
      // Agregar evento al formulario para desactivar el botón de enviar si el campo de email está vacío
      formulario.addEventListener("input", () => {
        const botonEnviar = document.querySelector("#botones button[type='submit']");
        botonEnviar.disabled = inputEmail.value.trim() === "";
      });
  
      // Abrir la base de datos y cargar clientes
      const dbName = "CRM";
      const dbVersion = 1;
  
      abrirBaseDeDatos(dbName, dbVersion)
        .then((db) => {
          cargarCorreosElectronicos(db, selectEmails);
        })
        .catch((error) => {
          console.error(error.message);
        });
    } else {
      console.error("No se pudo encontrar el input de email o no es un elemento de entrada.");
    }
  });
  
  function cargarCorreosElectronicos(db, select) {
    const transaction = db.transaction(["cliente"], "readonly");
    const objectStore = transaction.objectStore("cliente");
    const cursor = objectStore.openCursor();
  
    cursor.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const { email, nombre, id } = cursor.value;
        const option = document.createElement("option");
        option.value = email;
        option.text = `${nombre}, id :${id}`;
        select.add(option);
  
        cursor.continue();
      }
    };
  }
  
  function abrirBaseDeDatos(nombre, version) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(nombre, version);
  
      request.onerror = (event) => reject(new Error('Error al abrir la base de datos.'));
      request.onsuccess = (event) => resolve(event.target.result);
    });
  }
  