import { UserRegistration } from "../../application/RegistrationApplication";
import { Request, Response } from "express";
import { loadRegistroData } from "../util/registration-validation";
import { loadRegistroActualizadoData } from "../util/registro-update-validation";

export class registroController {
  private app: UserRegistration;

  constructor(application: UserRegistration) {
    this.app = application;
  }

  async Createregistro(
    req: Request,
    res: Response,
  ): Promise<string | Response> {
    try {
      const data = loadRegistroData(req.body);

      const token = await this.app.register(data);

      return res.status(200).json({ message: "Registro exitoso", token });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async UpdateEmpresa(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const { oldPassword, rol, ...dataToValidate } = req.body;
      const dataLoad = loadRegistroActualizadoData(dataToValidate, "empresa");
      const updated = await this.app.updateRegistrationEmpresa(
        id,
        dataLoad,
        oldPassword,
      );

      return res
        .status(201)
        .json({ message: "Perfil de registro actualizado con éxito", updated });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          error:
            "Error interno del servidor al actualizar el perfil de registro",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async UpdateEntidad(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const { oldPassword, rol, ...dataToValidate } = req.body;
      const dataLoad = loadRegistroActualizadoData(dataToValidate, "entidad");
      const updated = await this.app.updateRegistrationEntidad(
        id,
        dataLoad,
        oldPassword,
      );

      return res
        .status(201)
        .json({ message: "Perfil de registro actualizado con éxito", updated });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          error:
            "Error interno del servidor al actualizar el perfil de registro",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async UpdateVoluntario(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const { oldPassword, rol, ...dataToValidate } = req.body;
      const dataLoad = loadRegistroActualizadoData(
        dataToValidate,
        "voluntario",
      );
      const updated = await this.app.updateRegistrationVoluntario(
        id,
        dataLoad,
        oldPassword,
      );

      return res
        .status(201)
        .json({ message: "Perfil de registro actualizado con éxito", updated });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          error:
            "Error interno del servidor al actualizar el perfil de registro",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async deleteRegistro(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }
  
      const deleteRegistro = await this.app.deleteUser(id);
  
      if (!deleteRegistro) {
        return res.status(404).json({
          message: "Usuario no encontrado",
          status: "Activo"     
        });
      }
  
      return res.status(200).json({
        message: "Perfil eliminado con éxito",
        status: "Inactivo"     
      });
  
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          error: "Error interno del servidor",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}
