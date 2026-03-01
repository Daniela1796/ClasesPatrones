import app from "./infraestructure/web/app.js";
import { ServerBootstrap } from "./infraestructure/bootstrap/server.bootstrap.js";
import { connectDB } from "./infraestructure/config/data-base.js";

const serverBootstrap = new ServerBootstrap(app);

/**
 * Función tipo autoinvocada
 */

(async () => {
  try {
    const instances = [
      connectDB(), //Conexión a DB
      serverBootstrap.initialize(), //Iniciar el servidor
    ];
    await Promise.all(instances);
  } catch (error) {
    console.log("Error al iniciar la aplicación: ", error);
    process.exit(1);
  }
})();
