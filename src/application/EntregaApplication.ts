import { Entrega } from "../domain/Entities/Entrega";
import { EntregaPort } from "../domain/Ports/EntregaPort";
import { LotePort } from "../domain/Ports/LotePort";
import { LoteBase } from "../domain/Entities/Lote";
import { RegistrationPort } from "../domain/Ports/RegistrationPort";

export class userEntrega {
  private port: EntregaPort;
  private lotePort: LotePort;
  private loteBase: LoteBase;
  private userPort: RegistrationPort;

  constructor(
    port: EntregaPort,
    lotePort: LotePort,
    loteBase: LoteBase,
    userPort: RegistrationPort,
  ) {
    this.port = port;
    this.lotePort = lotePort;
    this.loteBase = loteBase;
    this.userPort = userPort;
  }

  async getLotesDisponibles(localidad: string): Promise<LoteBase[]> {
    const Lugarsolicitante =
      await this.userPort.getRegistrationByLocalidad(localidad);
    if (!Lugarsolicitante) throw new Error("Solicitante no encontrado");

    return this.lotePort.getLotesPriorizados(Lugarsolicitante.localidad);
  }

  async createEntrega(data: Omit<Entrega, "idEntrega">): Promise<number> {
    const lote = await this.lotePort.getLoteById(data.idLote);
    if (!lote) throw new Error("Lote no encontrado");

    if (lote.estado !== "En proceso")
      throw new Error("Este lote no está disponible");

    // Fechas automáticas
    data.fechaSolicitud = new Date(); //  hoy
    data.fechaRecogida = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 horas después
    data.estado = "Activa";
    const idEntrega = await this.port.createEntrega(data);
    await this.lotePort.updateLoteEstado(data.idLote, "Procesado", undefined);
    return idEntrega;
  }

  async updateEntrega(
    idEntrega: number,
    data: Partial<Entrega>,
  ): Promise<boolean> {
    const existsEntrega = await this.port.getEntregaById(idEntrega);
    if (!existsEntrega) {
      throw new Error("Registro de entrega no encontrado");
    }

    return await this.port.updateEntrega(idEntrega, data);
  }

  async deleteEntrega(id: number): Promise<boolean> {
    const existsEntrega = await this.port.getEntregaById(id);

    if (!existsEntrega) {
      throw new Error("Registro de entrega no encontrado");
    }

    if (existsEntrega.estado === "Inactivo") {
      throw new Error("Este registro de entrega no está disponible");
    }

    return this.port.deleteEntrega(id);
  }

  async getEntregaById(id: number): Promise<Entrega | null> {
    return await this.port.getEntregaById(id);
  }

  async confirmarEntrega(id: number): Promise<boolean> {
    const entrega = await this.port.getEntregaById(id);

    if (!entrega) throw new Error("Entrega no encontrada");
    if (entrega.estado != "Activa")
      throw new Error("Solo se pueden confirmar entregas activas");

    await this.port.updateEntrega(id, {
      estado: "Completada",
      fechaConfirmacion: new Date(),
    });

    await this.lotePort.updateLoteEstado(
      entrega.idLote,
      "Procesado",
      new Date(),
    );

    return true;
  }
} //Fin
