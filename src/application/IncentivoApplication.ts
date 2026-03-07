import { Incentivo } from "../domain/Entities/Incentivo";
import { IncentivoPort } from "../domain/Ports/IncentivoPort";
import { LotePort } from "../domain/Ports/LotePort";
import { LoteBase } from "../domain/Entities/Lote";
import { RegistrationPort } from "../domain/Ports/RegistrationPort";

export class IncentivoApplication {
  private port: IncentivoPort;
  private lotePort: LotePort;
  private userPort: RegistrationPort;

  constructor(
    port: IncentivoPort,
    lotePort: LotePort,
    userPort: RegistrationPort,
  ) {
    this.port = port;
    this.lotePort = lotePort;
    this.userPort = userPort;
  }

  async getLotesEmpresa(idEmpresa: number): Promise<LoteBase[]> {
    const solicitanteEmpresa =
      await this.userPort.getRegistrationById(idEmpresa);
    if (!solicitanteEmpresa) throw new Error("Solicitante no encontrado");

    return this.lotePort.getLotesByDonante(solicitanteEmpresa.id);
  }

  async getIncentivosByEmpresa(idEmpresa: number): Promise<Incentivo[]> {
    const solicitante = await this.userPort.getRegistrationById(idEmpresa);

    if (!solicitante) throw new Error("Empresa no encontrada");

    return this.port.getIncentivosByEmpresa(idEmpresa);
  }

  async getIncentivoById(idIncentivo: number): Promise<Incentivo | null> {
    const incentivo = await this.getIncentivoById(idIncentivo);

    if (!incentivo) throw new Error("Incentivo no encontrado");
    return this.port.getIncentivoById(idIncentivo);
  }

  async createIncentivo(data: Omit<Incentivo, "idIncentivo">): Promise<number> {
    const lotes = await Promise.all(
      data.lotesID.map((id) => this.lotePort.getLoteById(id)),
    );

    for (const lote of lotes) {
      if (!lote) throw new Error("Lote no encontrado");
      if (lote.idDonante !== data.idEmpresa) {
        throw new Error("Los lotes no pertenecen al perfil");
      }
      if (lote.estado !== "Procesado") {
        throw new Error("Solo puedes usar lotes que han sido procesados");
      }
    }

    const totalCosto = lotes.reduce(
      (sum, lote) => sum + (parseFloat((lote as any).costoTotal) ?? 0),
      0,
    );
    data.totalDescuento = totalCosto * 0.37;
    data.estado = "Activo";
    data.fechaCreacion = new Date();

    return this.port.createIncentivo(data);
  }

  async updateIncentivo(
    id: number,
    incentivo: Partial<Incentivo>,
  ): Promise<boolean> {
    const existsIncentivo = await this.port.getIncentivoById(id);
    if (!existsIncentivo) {
      throw new Error("Registro de incentivo no encontrado");
    }

    return await this.port.updateIncentivo(id, incentivo);
  }

  async deleteIncentivo(id: number): Promise<boolean> {
    const existsIncentivo = await this.port.getIncentivoById(id);

    if (!existsIncentivo) {
      throw new Error("Registro de incentivos no encontrados");
    }

    if (existsIncentivo.estado === "Activa") {
      throw new Error(
        "Solo se pueden eliminar incentivos que ya han sido procesados",
      );
    }

    if (existsIncentivo.estado === "Inactivo") {
      throw new Error(
        "Este incentivo a sido eliminado o cambiado por la entidad",
      );
    }

    return this.port.deleteIncentivo(id);
  }

  async confirmarUsoIncentivo(id: number): Promise<boolean> {
    const incentivoConfirmado = await this.port.getIncentivoById(id);

    if (!incentivoConfirmado) throw new Error("Incentivo no encontrado");
    if (incentivoConfirmado.estado !== "Procesado") {
      throw new Error(
        "Solo se pueden confirmar incentivos que han sido procesados ",
      );
    }

    return await this.port.confirmarUsoIncentivo(id);
  }
}
