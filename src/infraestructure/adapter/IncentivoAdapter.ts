import { Repository } from "typeorm";
import { Incentivo } from "../../domain/Entities/Incentivo";
import { IncentivoEntity } from "../entities/Incentivo";
import { IncentivoPort } from "../../domain/Ports/IncentivoPort";
import { AppDataSource } from "../config/data-base";

export class IncentivoAdapter implements IncentivoPort {
  private incentivoRepository: Repository<IncentivoEntity>;

  constructor() {
    this.incentivoRepository = AppDataSource.getRepository(IncentivoEntity);
  }

  toDomainIncentivo(incentivo: IncentivoEntity): Incentivo {
    return {
      idIncentivo: incentivo.idIncentivo,
      idEmpresa: incentivo.idEmpresa,
      lotesID: incentivo.lotesID,
      totalDescuento: incentivo.totalDescuento,
      estado: incentivo.estado,
      fechaCreacion: incentivo.fechaCreacion,
      fechaUso: incentivo.fechaUso,
    };
  }

  toEntityIncentivo(
    incentivo: Omit<Incentivo, "idIncentivo">,
  ): IncentivoEntity {
    const incentivoEntity = new IncentivoEntity();
    incentivoEntity.idEmpresa = incentivo.idEmpresa;
    incentivoEntity.lotesID = incentivo.lotesID;
    incentivoEntity.totalDescuento = incentivo.totalDescuento;
    incentivoEntity.estado = incentivo.estado;
    incentivoEntity.fechaCreacion = incentivo.fechaCreacion;
    incentivoEntity.fechaUso = incentivo.fechaUso ?? null;
    return incentivoEntity;
  }

  toEntityPartialIncentivo(
    incentivo: Partial<Incentivo>,
  ): Partial<IncentivoEntity> {
    const incentivoUpdate: Partial<IncentivoEntity> = {};
    if (incentivo.lotesID) incentivoUpdate.lotesID = [...incentivo.lotesID];
    return incentivoUpdate;
  }

  async createIncentivo(data: Omit<Incentivo, "idIncentivo">): Promise<number> {
    try {
      const incentivo = this.toEntityIncentivo(data);
      const savedIncentivo = await this.incentivoRepository.save(incentivo);
      return savedIncentivo.idIncentivo;
    } catch (error) {
      console.error("Error al guardar el incentivo: ", error);
      throw new Error("El registro de incentivo no se pudo crear");
    }
  }

  async updateIncentivo(
    id: number,
    incentivo: Partial<Incentivo>,
  ): Promise<boolean> {
    try {
      const existingIncentivo = await this.incentivoRepository.findOne({
        where: { idIncentivo: id },
      });

      if (!existingIncentivo) return false;

      const incentivoUpdate = this.toEntityPartialIncentivo(incentivo);

      console.log("incentivoUpdate:", incentivoUpdate);
      console.log("lotesID:", incentivoUpdate.lotesID); 

      if (Object.keys(incentivoUpdate).length > 0) {
        await this.incentivoRepository.update(id, incentivoUpdate);
      }

      return true;
    } catch (error) {
      console.error("Error real:", error);
      throw error;
    }
  }

  async confirmarUsoIncentivo(id: number): Promise<boolean> {
    try {
      const existingIncentivo = await this.incentivoRepository.findOne({
        where: { idIncentivo: id },
      });

      if (!existingIncentivo) return false;

      const result = await this.incentivoRepository.update(id, {
        estado: "Usado",
        fechaUso: new Date(),
      });

      return true;
    } catch (error) {
      console.error("Error al actualizar el estado del incentivo: ", Error);
      throw new Error("Error al confirmar el estado del incentivo");
    }
  }

  async deleteIncentivo(id: number): Promise<boolean> {
    try {
      const existingIncentivo = await this.incentivoRepository.findOne({
        where: { idIncentivo: id },
      });

      if (!existingIncentivo) return false;

      await this.incentivoRepository.update(id, { estado: "Inactivo" });

      return true;
    } catch (error) {
      console.error("error al eliminar el incentivo: ", Error);
      throw new Error("Error al eliminar el incentivo");
    }
  }

  async getIncentivoById(idIncentivo: number): Promise<Incentivo | null> {
    try {
      const existingIncentivo = await this.incentivoRepository.findOne({
        where: { idIncentivo },
      });

      if (!existingIncentivo) return null;

      return existingIncentivo;
    } catch (error) {
      console.error("Error al buscar id de incentivo: ", Error);
      throw new Error("Error al encontrar el id de incentivo");
    }
  }

  async getIncentivosByEmpresa(id_Empresa: number): Promise<Incentivo[]> {
    try {
      const incentivos = await this.incentivoRepository.find({
        where: { idEmpresa: id_Empresa },
      });

      return incentivos.map((lote) => this.toDomainIncentivo(lote));
    } catch (error) {
      throw new Error("Error al obtener incentivos de la empresa");
    }
  }
}
