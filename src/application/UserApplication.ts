//Servicios del usuario: inciar sesión
import bcrypt from "bcryptjs";
import { User } from "../domain/Entities/User";
import { UserPort } from "../domain/Ports/UserPort";
import { AuthApplication } from "./AuthApplication";

export class UserApplication {
  private port: UserPort;

  constructor(port: UserPort) {
    this.port = port;
  }

  async login(email: string, password: string): Promise<string> {
    const existUser = await this.port.getUserByEmail(email);

    if (!existUser) {
      throw new Error("Credenciales invalidas");
    }

    if (!existUser.status) {
      throw new Error("Usuario inactivo, contacte al administrador");
    }

    const passMatch = await bcrypt.compare(password, existUser.password);

    if (!passMatch) {
      throw new Error("Credenciales inválidas");
    }

    const token = AuthApplication.generateToken({
      id: existUser.id,
      rol: existUser.rol,
    });

    return token;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.port.getUserByEmail(email);
  }
}
