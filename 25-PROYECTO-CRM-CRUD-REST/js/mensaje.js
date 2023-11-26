 // Crea el contenedor del toast
 var toastContainer = document.createElement('div');
 toastContainer.classList.add('toast-container', 'position-fixed', 'top-0', 'end-0', 'p-3');

 // Crea el elemento de toast
 var toastElement = document.createElement('div');
 toastElement.id = 'toast';
 toastElement.classList.add('toast');
 toastElement.setAttribute('role', 'alert');
 toastElement.setAttribute('aria-live', 'assertive');
 toastElement.setAttribute('aria-atomic', 'true');

// Crea el encabezado del toast
var toastHeader = document.createElement('div');
toastHeader.classList.add('toast-header');
toastHeader.style.backgroundColor = '#319795'; 
toastHeader.classList.add('text-white');

var strongElement = document.createElement('strong');
strongElement.classList.add('me-auto', 'text-white');
strongElement.textContent = 'CRM - INDEXEDDB';

 var closeButton = document.createElement('button');
 closeButton.type = 'button';
 closeButton.classList.add('btn-close', 'btn-close-white');
 closeButton.setAttribute('data-bs-dismiss', 'toast');
 closeButton.setAttribute('aria-label', 'Close');

 toastHeader.appendChild(strongElement);
 toastHeader.appendChild(closeButton);

 // Crea el cuerpo del toast
 var toastBody = document.createElement('div');
 toastBody.classList.add('toast-body');

 // Agrega el encabezado y el cuerpo al elemento de toast
 toastElement.appendChild(toastHeader);
 toastElement.appendChild(toastBody);

 // Agrega el elemento de toast al contenedor
 toastContainer.appendChild(toastElement);

 // Agrega el contenedor al cuerpo del documento
 document.body.appendChild(toastContainer);


 export function mostrarToast(mensaje) {
    const toastDiv = document.querySelector("#toast");
    const toastDivBody = document.querySelector(".toast-body");
  
    // Modificado: Agregar un botón "Ver" al final del mensaje
    toastDivBody.innerHTML = `${mensaje} <button id="verBtn" class="btn btn-primary btn-sm ms-2">Ver</button>`;
  
    // Agregar un evento al botón "Ver" para redirigir a index.html
    const verBtn = document.getElementById("verBtn");
    if (verBtn) {
      verBtn.addEventListener("click", () => {
        window.location.href = "index.html";
      });
    }
  
    const toast = new bootstrap.Toast(toastDiv);
    toast.show();
  }

