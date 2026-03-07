import { Repository } from "typeorm";
import { Entrega } from "../../domain/Entities/Entrega";
import { EntregaEntity } from "../entities/Entrega";
import { EntregaPort } from "../../domain/Ports/EntregaPort";
import { LoteEntity } from "../entities/Lote";
import { AppDataSource } from "../config/data-base";

export class EntregaAdapter implements EntregaPort {
  private entregaRepository: Repository<EntregaEntity>;
  private loteRepository: Repository<LoteEntity>;

  constructor() {
    this.entregaRepository = AppDataSource.getRepository(EntregaEntity);
    this.loteRepository = AppDataSource.getRepository(LoteEntity);
  }

  toDomainEntrega(entrega: EntregaEntity): Entrega {
    return {
      idEntrega: entrega.idEntrega,
      idLote: entrega.idLote,
      idSolicitante: entrega.idSolicitante,
      tipoSolicitante: entrega.tipoSolicitante,
      estado: entrega.estado,
      cantidadSolicitada: entrega.cantidadSolicitada,
      fechaSolicitud: entrega.fechaSolicitud ?? null,
      fechaRecogida: entrega.fechaRecogida ?? null,
      fechaConfirmacion: entrega.fechaConfirmacion ?? null,
    };
  }

  toEntityEntrega(entrega: Omit<Entrega, "idEntrega">): EntregaEntity {
    const entregaEntity = new EntregaEntity();
    entregaEntity.idLote = entrega.idLote;
    entregaEntity.idSolicitante = entrega.idSolicitante;
    entregaEntity.tipoSolicitante = entrega.tipoSolicitante;
    entregaEntity.estado = entrega.estado;
    entregaEntity.cantidadSolicitada = entrega.cantidadSolicitada;
    entregaEntity.fechaSolicitud = entrega.fechaSolicitud ?? null;
    entregaEntity.fechaRecogida = entrega.fechaRecogida ?? null;
    entregaEntity.fechaConfirmacion = entrega.fechaConfirmacion ?? null;
    return entregaEntity;
  }

  toEntityPartialEntrega(entrega: Partial<Entrega>): Partial<EntregaEntity> {
    const entregaUpdate: Partial<EntregaEntity> = {};
    if (entrega.idLote) entregaUpdate.idLote = entrega.idLote;
    if (entrega.fechaRecogida)
      entregaUpdate.fechaRecogida = entrega.fechaRecogida;
    return entregaUpdate;
  }

  async createEntrega(data: Omit<Entrega, "idEntrega">): Promise<number> {
    try {
      const entrega = this.toEntityEntrega(data);
      const savedEntrega = await this.entregaRepository.save(entrega);
      return savedEntrega.idEntrega;
    } catch (error) {
      console.error("Error al guardar la entrega: ", error);
      throw new Error("El registro de entrega no se pudo crear");
    }
  }

  async updateEntrega(id: number, data: Partial<Entrega>): Promise<boolean> {
    try {
      const existingEntrega = await this.entregaRepository.findOne({
        where: { idEntrega: id },
      });

      if (!existingEntrega) return false;

      const entregaUpdate = this.toEntityPartialEntrega(data);

      if (Object.keys(entregaUpdate).length > 0) {
        await this.entregaRepository.update(id, entregaUpdate);
      }

      return true;
    } catch (error) {
      throw new Error("Error al actualizar el despacho de entrega");
    }
  }

  async deleteEntrega(id: number): Promise<boolean> {
    try {
      const existingEntrega = await this.entregaRepository.findOne({
        where: { idEntrega: id },
      });

      if (!existingEntrega) return false;

      const existingLote = await this.loteRepository.findOne({
        where: { idLote: existingEntrega.idLote },
      });

      if (!existingLote) return false;

      await this.entregaRepository.update(id, { estado: "Cancelada" });

      const cantidadDevuelta =
        existingLote.tipoDonante === "empresa"
          ? {
              cantidadDeCajas:
                (existingLote.cantidadDeCajas ?? 0) +
                existingEntrega.cantidadSolicitada,
            }
          : {
              cantidadPorUnidad:
                (existingLote.cantidadPorUnidad ?? 0) +
                existingEntrega.cantidadSolicitada,
            };

      await this.loteRepository.update(existingEntrega.idLote, {
        estado: "En proceso",
        ...cantidadDevuelta,
      });

      return true;
    } catch (error) {
      console.error("Error al actualizar estado de la entrega: ", Error);
      throw new Error("Error al eliminar el lote registrado");
    }
  }

  async confirmarEntrega(id: number): Promise<boolean> {
    try {
      const existingEntrega = await this.entregaRepository.findOne({
        where: { idEntrega: id },
      });
      console.log("existingEntrega en adapter:", existingEntrega);

      if (!existingEntrega) return false;

      console.log("Confirmando entrega id:", id);
      const result = await this.entregaRepository.update(id, {
        estado: "COnfirmado",
        fechaConfirmacion: new Date(),
      });
      console.log("Resultado update:", result);

      await this.loteRepository.update(existingEntrega.idLote, {estado: "Activa",
        fechaRecibido: new Date(),
      });

      return true;
    } catch (error) {
      console.error("Error al actualizar el estado de entrega: ", Error);
      throw new Error("Error al confirmar el estado de entrega");
    }
  }

  async getEntregaById(id: number): Promise<Entrega | null> {
    try {
      const existingEntrega = await this.entregaRepository.findOne({
        where: { idEntrega: id },
      });

      if (!existingEntrega) return null;

      return this.toDomainEntrega(existingEntrega);
    } catch (error) {
      console.error("Error al buscar el id de entrega: ", Error);
      throw new Error("Error al encontrar el id de entrega");
    }
  }
}
