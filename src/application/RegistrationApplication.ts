import bcrypt from "bcryptjs";
import {
  MainRegistration,
  Registration_Empresa,
  Registration_Voluntario,
  Registration_Entidad,
} from "../domain/Registration";
import { RegistrationPort } from "../domain/RegistrationPort";
import { AuthApplication } from "./AuthApplication";

type RegistrationData =
  | Omit<Registration_Empresa, "id">
  | Omit<Registration_Voluntario, "id">
  | Omit<Registration_Entidad, "id">;

export class UserRegistration {
  private port: RegistrationPort;

  constructor(port: RegistrationPort) {
    this.port = port;
  }

  async register(data: RegistrationData): Promise<string> {
    const existUser = await this.port.getRegistrationByEmail(data.email);

    if (existUser) {
      throw new Error("Este email ya está registrado");
    }

    const userId = await this.CreateRegister(data);

    const token = AuthApplication.generateToken({
      id: userId,
      email: data.email,
      rol: data.rol,
    });

    return token;
  } //fin register()

  /**
   *
   * Crear registro
   *
   */

  async CreateRegister(data: RegistrationData): Promise<number> {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    data.password = hashedPassword;

    if (data.rol.toLowerCase() == "empresa") {
      return await this.port.createRegistrationEmpresa(
        data as Registration_Empresa,
      );
    }

    if (data.rol.toLowerCase() == "voluntario") {
      return await this.port.createRegistrationVoluntario(
        data as Registration_Voluntario,
      );
    }

    if (data.rol.toLowerCase() == "entidad") {
      return await this.port.createRegistrationEntidad(
        data as Registration_Entidad,
      );
    }

    if (!data.rol) {
      throw new Error("Rol no encontrado");
    }

    throw new Error("Rol Invalido");
  }

  async getRegistroById(id: number): Promise<MainRegistration | null> {
    return await this.port.getRegistrationById(id);
  }

  async getRegistroByRol(rol: string): Promise<MainRegistration[]> {
    return await this.port.getRegistrationByRol(rol);
  }

  async getAllRegistros(): Promise<MainRegistration[]> {
    return await this.port.getAllRegistrations();
  }

  /**
   * Actualizar información de registros
   */

  async updateRegistrationEmpresa(
    id: number,
    data: Partial<Registration_Empresa>,
    oldPassword: string,
  ): Promise<boolean> {
    const existingRegister = await this.port.getRegistrationById(id);

    if (!existingRegister) {
      throw new Error("Registro no encontrado");
    }

    //Actualizar razón social

    if (data.razonSocial) {
      const existingRazonSocial =
        await this.port.getRegistrationByRazonSocialEmpresa(data.razonSocial);

      if (existingRazonSocial && existingRazonSocial.id !== id) {
        throw new Error("Esta razón social ya está en uso");
      }
    }

    //Actualizar número de contacto
    if (data.contacto) {
      const existingTelefono = await this.port.getRegistrationByContacto(
        data.contacto,
      );

      if (existingTelefono && existingTelefono.id !== id) {
        throw new Error("Este número ya está en uso");
      }
    }

    //Actualizar correo

    if (data.email) {
      const emailTaken = await this.port.getRegistrationByEmail(data.email);
      if (emailTaken && emailTaken.id !== id) {
        throw new Error("El email ya está en uso");
      }
    }

    //Actualizar contraseña

    if (data.password) {
      const passMatch = await bcrypt.compare(
        oldPassword,
        existingRegister.password,
      );

      if (!passMatch) {
        throw new Error("Contraseña incorrecta");
      }

      data.password = await bcrypt.hash(data.password, 12);
    }

    return this.port.updateRegistrationEmpresa(id, data);
  }

  async updateRegistrationVoluntario(
    id: number,
    data: Partial<Registration_Voluntario>,
    oldPassword: string,
  ): Promise<boolean> {
    const existingRegister = await this.port.getRegistrationById(id);

    if (!existingRegister) {
      throw new Error("Registro no encontrado");
    }

    //Actualizar número de contacto
    if (data.contacto) {
      const existingTelefono = await this.port.getRegistrationByContacto(
        data.contacto,
      );

      if (existingTelefono && existingTelefono.id !== id) {
        throw new Error("Este número ya está en uso");
      }
    }

    //Actualizar correo

    if (data.email) {
      const emailTaken = await this.port.getRegistrationByEmail(data.email);
      if (emailTaken && emailTaken.id !== id) {
        throw new Error("El email ya está en uso");
      }
    }

    //Actualizar contraseña

    if (data.password) {
      const passMatch = await bcrypt.compare(
        oldPassword,
        existingRegister.password,
      );

      if (!passMatch) {
        throw new Error("Contraseña incorrecta");
      }

      data.password = await bcrypt.hash(data.password, 12);
    }

    return this.port.updateRegistrationVoluntario(id, data);
  }

  async updateRegistrationEntidad(
    id: number,
    data: Partial<Registration_Entidad>,
    oldPassword: string,
  ): Promise<boolean> {
    const existingRegister = await this.port.getRegistrationById(id);

    if (!existingRegister) {
      throw new Error("Registro no encontrado");
    }

    //Actualizar razón social

    if (data.razonSocial) {
      const razonSocial = await this.port.getRegistrationByRazonSocialEntidad(
        data.razonSocial,
      );
      if (razonSocial && razonSocial.id !== id) {
        throw new Error("Esta razón social ya está en uso");
      }
    }

    //Actualizar número de contacto
    if (data.contacto) {
      const existingTelefono = await this.port.getRegistrationByContacto(
        data.contacto,
      );

      if (existingTelefono && existingTelefono.id !== id) {
        throw new Error("Este número ya está en uso");
      }
    }

    //Actualizar correo

    if (data.email) {
      const emailTaken = await this.port.getRegistrationByEmail(data.email);
      if (emailTaken && emailTaken.id !== id) {
        throw new Error("El email ya está en uso");
      }
    }

    //Actualizar contraseña

    if (data.password) {
      const passMatch = await bcrypt.compare(
        oldPassword,
        existingRegister.password,
      );

      if (!passMatch) {
        throw new Error("Contraseña incorrecta");
      }

      data.password = await bcrypt.hash(data.password, 12);
    }

    return this.port.updateRegistrationEntidad(id, data);
  }

  /**
   * Eliminar
   */

  async deleteUser(id: number): Promise<boolean> {
    const existingRegister = await this.port.getRegistrationById(id);

    if (!existingRegister) {
      throw new Error("Registro no encontrado");
    }

    if (!existingRegister.status) {
      throw new Error("Este registro está inactivo");
    }

    return this.port.deleteMainRegistration(id);
  }
}
