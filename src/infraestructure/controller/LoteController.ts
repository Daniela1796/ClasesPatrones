import { UserDonaciones } from "../../application/LoteApplication";
import { Request, Response } from "express";
import { loadLoteRegistro } from "../util/lote-validation";
import { loadUpdateLoteRegistro } from "../util/lote-update-validation";
import { error } from "node:console";

export class loteController {
  private app: UserDonaciones;

  constructor(application: UserDonaciones) {
    this.app = application;
  }

  async createLote(req: Request, res: Response): Promise<string | Response> {
    try {
      const rol = (req as any).user.rol;
      const dataLoad = loadUpdateLoteRegistro(req.body, rol);
      const loteFull = {
        ...dataLoad,
        idDonante: (req as any).user.id,
        tipoDonante: rol,
        estado: "En proceso",
        fechaDeRecibido: null,
        idEntrega: null,
      };

      const id = await this.app.createLote(loteFull);

      return res.status(201).json({
        message: "Lote creado con éxito",
        id,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async getLotesByDonante(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID Inválido" });
      }

      const lotes = await this.app.getLotesByDonante(id);

      return res.status(200).json({
        message: "Lotes obtenidos con éxito",
        lotes,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async updateLote(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID Inválido" });
      }
      const rol = (req as any).user.rol;
      const data = req.body;
      const dataLoad = loadUpdateLoteRegistro(data, rol);
      const updated = await this.app.updateLote(id, dataLoad, rol);

      return res
        .status(201)
        .json({ message: "Lote actualizado con éxito ", updated });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          error: "Error interno del servidor al actualizar el lote",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async deleteLote(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const eliminarLoteRegistrado = await this.app.eliminarLote(id);

      return res.status(200).json({
        message: "Perfil de registro eliminado con éxito",
        status: eliminarLoteRegistrado ? "Inactivo" : "Activo",
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          error: "Error interno del servidor al eliminar el registro del lote",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}
