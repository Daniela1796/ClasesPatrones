import { Repository } from "typeorm";
import { LoteBase, LoteEmpresa, LoteVoluntario } from "../../domain/Lote";
import { LoteEntity } from "../entities/Lote";
import { LotePort } from "../../domain/LotePort";
import { AppDataSource } from "../config/data-base";

export class LoteAdapter implements LotePort {
  private loteRepository: Repository<LoteEntity>;

  constructor() {
    this.loteRepository = AppDataSource.getRepository(LoteEntity);
  }

  private toDomainLote(lote: LoteEntity): LoteBase {
    return {
      idLote: lote.idLote,
      idDonante: lote.idDonante,
      tipoDonante: lote.tipoDonante,
      alimento: lote.alimento,
      clasificacion: lote.clasificacion,
      fechaVencimiento: lote.fechaVencimiento,
      fechaDeRecibido: lote.fechaRecibido,
      estado: lote.estado,
      idEntrega: lote.idEntrega,
    };
  }

  private toEntityLote(data: Omit<LoteBase, "idLote">): LoteEntity {
    const loteEntity = new LoteEntity();
    loteEntity.idDonante = data.idDonante;
    loteEntity.tipoDonante = data.tipoDonante;
    loteEntity.alimento = data.alimento;
    loteEntity.clasificacion = data.clasificacion;
    loteEntity.fechaVencimiento = data.fechaVencimiento;
    loteEntity.fechaRecibido = data.fechaDeRecibido ?? null; // 👈 maneja undefined
    loteEntity.estado = data.estado;
    loteEntity.idEntrega = data.idEntrega ?? null; // 👈 maneja undefined
    return loteEntity;
  }

  private toDomainEmpresa(empresa: LoteEntity): LoteEmpresa {
    return {
      ...this.toDomainLote(empresa),
      cantidadDeCajas: empresa.cantidadDeCajas,
      precioPorCaja: empresa.precioPorCaja,
      costoTotal: empresa.costoTotal,
    };
  }

  private toEntityEmpresa(data: Omit<LoteEmpresa, "idLote">): LoteEntity {
    const loteEntity = this.toEntityLote(data);
    loteEntity.cantidadDeCajas = data.cantidadDeCajas;
    loteEntity.precioPorCaja = data.precioPorCaja;
    loteEntity.costoTotal = data.costoTotal;
    const costoCalculado =
      (data as LoteEmpresa).cantidadDeCajas *
      (data as LoteEmpresa).precioPorCaja;
    (data as any).costoTotal = costoCalculado;
    return loteEntity;
  }

  private toEntityPartialEmpresa(
    lote: Partial<LoteEmpresa>,
  ): Partial<LoteEntity> {
    const loteUpdate: Partial<LoteEntity> = {};
    if (lote.alimento) loteUpdate.alimento = lote.alimento;
    if (lote.clasificacion) loteUpdate.clasificacion = lote.clasificacion;
    if (lote.fechaVencimiento)
      loteUpdate.fechaVencimiento = lote.fechaVencimiento;
    if (lote.cantidadDeCajas) loteUpdate.cantidadDeCajas = lote.cantidadDeCajas;
    if (lote.precioPorCaja) loteUpdate.precioPorCaja = lote.precioPorCaja;
    if (lote.costoTotal) loteUpdate.costoTotal = lote.costoTotal;
    if (lote.estado) loteUpdate.estado = lote.estado;
    return loteUpdate;
  }

  private toDomainVoluntario(voluntario: LoteEntity): LoteVoluntario {
    return {
      ...this.toDomainLote(voluntario),
      cantidadPorUnidad: voluntario.cantidadPorUnidad,
    };
  }

  private toEntityVoluntario(data: Omit<LoteVoluntario, "idLote">): LoteEntity {
    const loteEntity = this.toEntityLote(data);
    loteEntity.cantidadPorUnidad = data.cantidadPorUnidad;
    return loteEntity;
  }

  private toEntityPartialVoluntario(
    lote: Partial<LoteVoluntario>,
  ): Partial<LoteEntity> {
    const loteUpdate: Partial<LoteEntity> = {};
    if (lote.alimento) loteUpdate.alimento = lote.alimento;
    if (lote.clasificacion) loteUpdate.clasificacion = lote.clasificacion;
    if (lote.fechaVencimiento)
      loteUpdate.fechaVencimiento = lote.fechaVencimiento;
    if (lote.cantidadPorUnidad)
      loteUpdate.cantidadPorUnidad = lote.cantidadPorUnidad;
    if (lote.estado) loteUpdate.estado = lote.estado;
    return loteUpdate;
  }

  async createLoteEmpresa(data: Omit<LoteEmpresa, "idLote">): Promise<number> {
    try {
      const toLote = this.toEntityEmpresa(data);
      const savedLoteEmpresa = await this.loteRepository.save(toLote);
      return savedLoteEmpresa.idLote;
    } catch (error) {
      console.error("Error al guardar el lote: ", error);
      throw new Error("El registro del lote no se pudo crear");
    }
  }

  async updateLoteEmpresa(
    id: number,
    lote: Partial<LoteEmpresa>,
  ): Promise<boolean> {
    try {
      const existingLote = await this.loteRepository.findOne({
        where: { idLote: id },
      });

      if (!existingLote) return false;

      const loteUpdate = this.toEntityPartialEmpresa(lote);

      if (Object.keys(loteUpdate).length > 0) {
        await this.loteRepository.update(id, loteUpdate);
      }

      return true;
    } catch (error) {
      throw new Error("Error al actualizar el lote");
    }
  }

  async createLoteVoluntarios(
    data: Omit<LoteVoluntario, "idLote">,
  ): Promise<number> {
    try {
      const toLote = this.toEntityVoluntario(data);
      const savedLoteVoluntario = await this.loteRepository.save(toLote);
      return savedLoteVoluntario.idLote;
    } catch (error) {
      console.error("Error al guardar el lote: ", error);
      throw new Error("El registro del lote no se pudo crear");
    }
  }

  async updateLoteVoluntario(
    id: number,
    lote: Partial<LoteVoluntario>,
  ): Promise<boolean> {
    try {
      const existingLote = await this.loteRepository.findOne({
        where: { idLote: id },
      });

      if (!existingLote) return false;

      const loteUpdate = this.toEntityPartialVoluntario(lote);

      if (Object.keys(loteUpdate).length > 0) {
        await this.loteRepository.update(id, loteUpdate);
      }

      return true;
    } catch (error) {
      throw new Error("Error al actualizar el lote");
    }
  }

  async deleteLote(id: number): Promise<boolean> {
    try {
      const existingLote = await this.loteRepository.findOne({
        where: { idLote: id },
      });

      if (!existingLote) return false;

      Object.assign(existingLote, { estado: false });

      await this.loteRepository.update(id, { estado: "Inactivo" });
      return true;
    } catch (error) {
      console.error("Error al actualizar estado del lote: ", Error);
      throw new Error("Error al eliminar el lote registrado");
    }
  }

  async getLoteById(id: number): Promise<LoteBase | null> {
    const lote = await this.loteRepository.findOne({
      where: { idLote: id },
    });

    if (!lote) return null;

    return this.toDomainLote(lote);
  }

  async getLotesByClasificacion(
    clasificacionlote: string,
  ): Promise<LoteBase[]> {
    try {
      const tipoDeAlimento = await this.loteRepository.find({
        where: { clasificacion: clasificacionlote },
      });

      return tipoDeAlimento.map(this.toDomainLote);
    } catch (error) {
      console.error("Error al obtener la clasificación ");
      throw new Error("Error en la lista de clasificación de alimentos");
    }
  }

  async getLotesByDonante(id_Donante: number): Promise<LoteBase[]> {
    try {
      const donantes = await this.loteRepository.find({
        where: { idDonante: id_Donante },
      });

      return donantes.map(this.toDomainLote);
    } catch (error) {
      console.error("Error al obtener la lista de donantes", Error);
      throw new Error("Error en la lista de donantes");
    }
  }

  async getLotesDisponibles(): Promise<LoteBase[]> {
    try {
      const disponibles = await this.loteRepository.find({
        where: { estado: "En proceso" },
      });

      return disponibles.map(this.toDomainLote);
    } catch (error) {
      console.error("Error al obtener listado", Error);
      throw new Error("Error en la lista de lotes disponibles");
    }
  }

  async updateLoteEstado(
    id: number,
    estado: string,
    fechaRecibido?: Date,
  ): Promise<boolean> {
    try {
      const loteUpdate: Partial<LoteEntity> = { estado };

      if (fechaRecibido) {
        loteUpdate.fechaRecibido = fechaRecibido; // opcional, solo al confirmar entrega
      }

      await this.loteRepository.update(id, loteUpdate);
      return true;
    } catch (error) {
      console.error("Error al actualizar estado del lote: ", error);
      throw new Error("Error al actualizar estado del lote");
    }
  }
} //fin adapter
