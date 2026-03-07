import { IncentivoApplication } from "../../application/IncentivoApplication";
import { Request, Response } from "express";
import { loadIncentivoData } from "../util/incentivo-validation";
import { loadUpdateIncentivoData } from "../util/incentivo-update-validation";

export class IncentivoController {
  private app: IncentivoApplication;

  constructor(application: IncentivoApplication) {
    this.app = application;
  }

  async getLotesEmpresa(req: Request, res: Response): Promise<Response> {
    try {
      const id_Empresa = req.user.id;
      const lotes = await this.app.getLotesEmpresa(id_Empresa);
      return res.status(200).json({ lotes });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async createIncentivo(req: Request, res: Response): Promise<Response> {
    try {
      const data = loadIncentivoData(req.body);
      const incentivoFormato = {
        ...data,
        idEmpresa: req.user.id,
        totalDescuento: 0,
        estado: "Activo",
        fechaCreacion: new Date(),
        fechaUso: null,
      };

      const id = await this.app.createIncentivo(incentivoFormato);
      return res.status(201).json({
        message: "Incentivo creado con éxito",
        id,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async updateIncentivo(req: Request, res: Response): Promise<Response> {
    try {
      const idIncentivo = Number(req.params.id);

      if (Number.isNaN(idIncentivo)) {
        return res.status(400).json({ erro: "ID inválido" });
      }

      const idEmpresa = req.user.id;
      const incentivo = await this.app.getIncentivoById(idIncentivo);

      if (!incentivo) throw new Error("Incentivo no encontrado");

      if (incentivo.idEmpresa !== idEmpresa) {
        return res
          .status(400)
          .json({ error: "No puede modificar este incentivo" });
      }

      const data = req.body;
      const dataLoad = loadUpdateIncentivoData(data);
      const updating = await this.app.updateIncentivo(idIncentivo, dataLoad);

      return res
        .status(200)
        .json({ message: "Incentivo actualizado con éxito", updating });
    } catch (error) {
      if (error instanceof Error) {
        return res
          .status(500)
          .json({
            error: "Error interno del servidor al actualizar el incentivo",
            details: error.message,
          });
      }

      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async confirmarIncentivo(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const confirmacion = await this.app.confirmarUsoIncentivo(id);

      return res.status(200).json({
        message: "Incentivo confirmado",
        status: confirmacion ? "Usado" : "Activo",
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: "Error interno del servidor al cancelar el uso del incentivo",
          details: error.message,
        });
      }

      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async deleteIncentivo(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const eliminarIncentivo = await this.app.deleteIncentivo(id);

      return res.status(200).json({
        message: "Incentivo cancelado con éxito",
        status: eliminarIncentivo ? "Cancelado" : "Inactivo",
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          error: " Error interno del servidor al cancelar el incentivo",
          details: error.message,
        });
      }

      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}
