# Implementaciones Realizadas en el Proyecto de CRM

He mejorado el proyecto de CRM con IndexDB y le he implementado el 
proyecto de Emails con Local Storage para que pueda elegir mandar el correo a un cliente en concreto 

## Mejoras Realizadas:

1. **Mensajes Informativos:**
   - Se han implementado mensajes informativos para las acciones de creación, eliminación y modificación de clientes, mejorando la retroalimentación al usuario.

2. **Número Total de Clientes:**
   - Ahora se visualiza el número total de clientes al lado de la sección "Clientes" en el formato "Clientes(x)", proporcionando una indicación rápida del tamaño de la base de clientes.

3. **Enlace a Proyecto de Emails:**
   - Se ha añadido un enlace ("a") bajo la opción "Nuevo Cliente" que redirige al proyecto de Emails, facilitando el acceso a las funciones de envío de correos electrónicos.
   - Se ha implementado un menú desplegable (`select`) con los nombres de los empleados, junto con sus identificaciones. Al seleccionar un nombre, se muestra automáticamente su dirección de correo electrónico.

4. **Paginación de Clientes:**
   - Se ha agregado funcionalidad de paginación para evitar la acumulación descendente en la interfaz, especialmente útil cuando hay muchos clientes registrados.

5. **Historial de Cambios:**
   - Se ha introducido un historial de cambios que registra las acciones de creación, eliminación y modificación de clientes, incluyendo la fecha y hora de cada acción.

