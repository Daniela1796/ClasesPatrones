import express from "express";
import registroRoutes from "../routes/RegistrationRoutes";
import userRoutes from "../routes/UserRoutes";
import loteRoutes from "../routes/LoteRoutes";
class App {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.app.use(express.json());
  }

  private routes(): void {
    this.app.use("/api", registroRoutes);
    this.app.use("/api", userRoutes);
    this.app.use("/api",loteRoutes)
  }

  getApp() {
    return this.app;
  }
}

export default new App().getApp();
