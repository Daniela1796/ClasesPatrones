import { LoteBase, LoteEmpresa, LoteVoluntario } from "../domain/Entities/Lote";
import { LotePort } from "../domain/LotePort";

type LoteData = Omit<LoteEmpresa, "idLote"> | Omit<LoteVoluntario, "idLote">;

export class UserDonaciones {
  private port: LotePort;

  constructor(port: LotePort) {
    this.port = port;
  }

  //Verificar el rol para crear lote
  async createLote(data: Omit<LoteData, "idLote">): Promise<number> {
    if (data.tipoDonante === "empresa") {
      (data as any).estado = "En proceso";
      (data as any).fechaRecibido = new Date();
      (data as any).costoTotal =
        (data as LoteEmpresa).cantidadDeCajas *
        (data as LoteEmpresa).precioPorCaja;

      return await this.port.createLoteEmpresa(data as LoteEmpresa);
    }

    if (data.tipoDonante === "voluntario") {
      (data as any).estado = "En proceso";
      (data as LoteVoluntario).cantidadPorUnidad;
      return await this.port.createLoteVoluntarios(data as LoteVoluntario);
    }

    throw new Error("Perfil inválido");
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
