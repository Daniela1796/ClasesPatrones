VERSION 4.0


1. Promesas:
   1. Cómo se debe hacer conexión a BD o a Event Broker al inicializarlo se debe verificar cúal fallo y a cuál se conectó
   
   Debe asegurarse que: 
   -Levantó el servidor
   -La conexión a BD
   - Conexión con el event broker

Teoría:

Las promesas se utilizan para manejar tareas asíncronas como lo pueden ser lectura y escritura de archivos, consulta a bases de datos, peticiones HTTP.

Al utilizar promesas para operaciones asíncronas pueden tener estados:
 - Pendiente: operación que aún no ha terminado
 - Resuelta: operación completada exitosamente
 - rechazada: hubo error en las operación
  
Funciones: se desglosa las funciones clásica, flecha y autoinvocada


Versión 5.0

1. Configuración de entorno .env
2. Joi:
   

Versión 5.1

1. Configuración de MYSQL

- npm install  typeorm mysql12
  - eN TSCONFIG.TS se desconeta:
    - expeerimentalDecoratos
    - emitDecoratorMetaData
  - Reconfiguración de las nuevas variables de entorno en ENVIROMENT-VARS.TS

Version 5.2

1. Configuración de los servicios, validaciónes y reglas de negocio
   1. Capa Infraestructura/Eentitites
   2. Capa Dominio
   3. Capa Aplicación

Versión 5.3

1. Adaptadores

Versión 5.4

1. Controladores: limpieza de datos después de realizar las peticiones

Versión 5.5

1. Configuración de rutas

Versión 6.0 
Configuración a Neon

Versión 7.0

Configuración a JWT


