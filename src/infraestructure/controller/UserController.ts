import { UserApplication } from "../../application/UserApplication";
import { Request, Response } from "express";
import { loadLoginData } from "../util/user-validation";

export class UserController {
  private app: UserApplication;

  constructor(application: UserApplication) {
    this.app = application;
  }

  async login(req: Request, res: Response): Promise<string | Response> {
    try {
      const { email, password } = loadLoginData(req.body);

      const token = await this.app.login(email, password);

      return res.status(200).json({ message: "Login exitoso", token });
    } catch (error) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
  }

  async getUserByEmail(req: Request, res: Response): Promise<Response> {
    try {
      const email = req.params.email as string;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const user = await this.app.getUserByEmail(email);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({
        message: "Usuario obtenido con éxito",
        data: user,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}
