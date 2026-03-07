import { userEntrega } from "../../application/EntregaApplication";
import { Request, Response } from "express";
import { loadEntregaData } from "../util/entrega-validation";
import { loadUpdateEntregaData } from "../util/entrega-update-validation";

export class EntregaController {
  private app: userEntrega;

  constructor(application: userEntrega) {
    this.app = application;
  }

  async getLotesDisponibles(req: Request, res: Response): Promise<Response> {
    try {
      const idSolicitante = req.user!.id;
      const lotes = await this.app.getLotesDisponibles(idSolicitante);
      return res.status(200).json({ lotes });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async createEntrega(req: Request, res: Response): Promise<Response> {
    try {
      const data = loadEntregaData(req.body);
      const entregaFormato = {
        ...data,
        idSolicitante: req.user!.id,
        tipoSolicitante: req.user!.rol,
        estado: "Activa",
        fechaSolicitud: new Date(),
        fechaConfirmacion: null,
      };

      const { idEntrega, lote } = await this.app.createEntrega(entregaFormato);

      return res.status(201).json({
        message: "Orden de entrega creada con éxito",
        idEntrega,
        lote,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async updateEntrega(req: Request, res: Response): Promise<Response> {
    try {
      const idEntrega = Number(req.params.id);

      if (Number.isNaN(idEntrega)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const idSolicitante = req.user!.id;
      const entrega = await this.app.getEntregaById(idEntrega);

      if (!entrega) throw new Error("Entrega no encontrada");

      if (entrega.idSolicitante !== idSolicitante) {
        return res
          .status(400)
          .json({ error: "No puede modificar esta entrega" });
      }

      const data = req.body;
      const dataLoad = loadUpdateEntregaData(data);
      const updating = await this.app.updateEntrega(idEntrega, dataLoad);

      return res
        .status(200)
        .json({ message: "Entrega actualizada con éxito", updating });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          error: "Error interno del servidor al actualizar la entrega",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async deleteEntrega(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const eliminarEntregaRegistrada = await this.app.deleteEntrega(id);

      return res.status(200).json({
        message: "Entrega cancelada con éxito",
        status: eliminarEntregaRegistrada ? "Cancelada" : "En proceso",
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          error: " Error interno del servidor al cancelar la entrega",
          details: error.message,
        });
      }

      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async confirmedEntrega(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const confirmacion = await this.app.confirmarEntrega(id);

      return res.status(200).json({
        message: "Entrega confirmada, ¡Gracias!",
        status: confirmacion ? "Completada" : "Activa",
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: " Error interno del servidor al cancelar la entrega",
          details: error.message,
        });
      }

      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}
