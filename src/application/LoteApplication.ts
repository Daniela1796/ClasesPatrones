import { LoteBase, LoteEmpresa, LoteVoluntario } from "../domain/Entities/Lote";
import { LotePort } from "../domain/Ports/LotePort";

type LoteData = Omit<LoteVoluntario, "idLote">;

export class UserDonaciones {
  private port: LotePort;

  constructor(port: LotePort) {
    this.port = port;
  }

  //Verificar el rol para crear lote
  async createLoteEmpresa(
    data: Omit<
      LoteEmpresa,
      "idLote" | "estado" | "costoTotal" | "fechaDeRecibido" | "idEntrega"
    >,
  ): Promise<number> {
    const loteCompleto: Omit<LoteEmpresa, "idLote"> = {
      ...data,
      estado: "En proceso",
      costoTotal: data.cantidadDeCajas * data.precioPorCaja,
      fechaDeRecibido: null,
      idEntrega: null,
    };
    return await this.port.createLoteEmpresa(loteCompleto);
  }

  async createLoteVoluntario(
    data: Omit<
      LoteVoluntario,
      "idLote" | "estado" | "fechaDeRecibido" | "idEntrega"
    >,
  ): Promise<number> {
    const loteCompleto: Omit<LoteVoluntario, "idLote"> = {
      ...data,
      estado: "En proceso",
      fechaDeRecibido: null,
      idEntrega: null,
    };
    return await this.port.createLoteVoluntarios(loteCompleto);
  }

  async getLotesByDonante(idDonante: number): Promise<LoteBase[]> {
    const existingLote = await this.port.getLotesByDonante(idDonante);

    if (!existingLote || existingLote.length === 0) {
      throw new Error("No se encontraron lotes para este donante");
    }

    return existingLote;
  }

  async updateLote(
    id: number,
    data: Partial<LoteData>,
    rol: string,
  ): Promise<boolean> {
    const existingLote = await this.port.getLoteById(id);

    if (!existingLote) {
      throw new Error("Lote no encontrado");
    }

    if (rol === "empresa") {
      const loteEmpresa = data as Partial<LoteEmpresa>;
      if (loteEmpresa.precioPorCaja || loteEmpresa.cantidadDeCajas) {
        const precio =
          loteEmpresa.precioPorCaja ??
          (existingLote as LoteEmpresa).precioPorCaja;
        const cantidad =
          loteEmpresa.cantidadDeCajas ??
          (existingLote as LoteEmpresa).cantidadDeCajas;
        (data as any).costoTotal = precio * cantidad;
      }
      return this.port.updateLoteEmpresa(id, data as Partial<LoteEmpresa>);
    }

    if (rol === "voluntario") {
      return this.port.updateLoteVoluntario(
        id,
        data as Partial<LoteVoluntario>,
      );
    }

    throw new Error("Rol no autorizado para actualizar lotes");
  }

  // Eliminar registro

  async eliminarLote(id: number): Promise<boolean> {
    const existingLote = await this.port.getLoteById(id);

    if (!existingLote) {
      throw new Error("Lote no encontrado");
    }

    if (existingLote.estado === "Inactivo") {
      throw new Error("Este lote ya está inactivo");
    }

    return this.port.deleteLote(id);
  }

  async getLotePorId(id: number): Promise<LoteBase | null> {
    return await this.port.getLoteById(id);
  }
}
