import { UserDonaciones } from "../../application/LoteApplication";
import { Request, Response } from "express";
import { loadLoteEmpresa } from "../util/lote-validation";
import { loadLoteVoluntario } from "../util/lote-validation";
import { loadUpdateLoteRegistro } from "../util/lote-update-validation";

export class loteController {
  private app: UserDonaciones;

  constructor(application: UserDonaciones) {
    this.app = application;
  }

  async createLoteEmpresa(req: Request, res: Response): Promise<Response> {
    try {
      const data = loadLoteEmpresa(req.body);
      const loteFormato = {
        ...data,
        idDonante: req.user.id,
        tipoDonante: req.user.rol,
        estado: "En proceso",
        fechaRecibido: new Date(),
        idEntrega: undefined,
      };
      const id = await this.app.createLoteEmpresa(loteFormato);
      return res.status(200).json({ message: "Lote creado", id });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async createLoteVoluntario(req: Request, res: Response): Promise<Response> {
    try {
      const data = loadLoteVoluntario(req.body);
      const loteFormato = {
        ...data,
        idDonante: req.user.id,
        tipoDonante: req.user.rol,
        estado: "En proceso",
        fechaRecibido: new Date(),
        idEntrega: undefined,
      };
      const id = await this.app.createLoteVoluntario(loteFormato);
      return res.status(200).json({ message: "Lote creado", id });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async getLotesByDonante(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.user.id;
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
      const idLote = Number(req.params.id);
      if (Number.isNaN(idLote)) {
        return res.status(400).json({ error: "ID Inválido" });
      }
      const idDonante = req.user.id;
      const rol = req.user.rol;
      const lote = await this.app.getLotePorId(idLote);
      if(!lote) throw new Error("Lote no encontrado");

      if(lote.idDonante !== idDonante){
        return res.status(400).json({error: "No se puede modificar este lote"});
      }


      const data = req.body;
      const dataLoad = loadUpdateLoteRegistro(data, rol);
      const updated = await this.app.updateLote(idLote, dataLoad, rol);

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
