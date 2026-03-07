import { Entrega } from "../domain/Entities/Entrega";
import { EntregaPort } from "../domain/Ports/EntregaPort";
import { LotePort } from "../domain/Ports/LotePort";
import { LoteBase, LoteEmpresa, LoteVoluntario } from "../domain/Entities/Lote";
import { RegistrationPort } from "../domain/Ports/RegistrationPort";

export class userEntrega {
  private port: EntregaPort;
  private lotePort: LotePort;
  private userPort: RegistrationPort;

  constructor(
    port: EntregaPort,
    lotePort: LotePort,
    userPort: RegistrationPort,
  ) {
    this.port = port;
    this.lotePort = lotePort;
    this.userPort = userPort;
  }

  async getLotesDisponibles(idSolicitante: number): Promise<LoteBase[]> {
    const solicitante = await this.userPort.getRegistrationById(idSolicitante);
    if (!solicitante) throw new Error("Solicitante no encontrado");

    return this.lotePort.getLotesPriorizados(solicitante.localidad);
  }

  async createEntrega(
    data: Omit<Entrega, "idEntrega">,
  ): Promise<{ idEntrega: number; lote: LoteBase }> {
    const lote = await this.lotePort.getLoteById(data.idLote);
    if (!lote) throw new Error("Lote no encontrado");

    if (lote.estado !== "En proceso")
      throw new Error("Este lote no está disponible");

    const loteCompleto = lote as any;
    const cantidadDisponible =
      lote.tipoDonante === "empresa"
        ? loteCompleto.cantidadDeCajas
        : loteCompleto.cantidadPorUnidad;

    console.log("Cantidad: ", cantidadDisponible);
    if (!cantidadDisponible) {
      throw new Error("No se pudo obtener la cantidad disponible");
    }

    if (data.cantidadSolicitada > cantidadDisponible) {
      throw new Error(
        `Solo hay ${cantidadDisponible} ${lote.tipoDonante === "empresa" ? "cajas" : "unidades"} disponibles`,
      );
    }

    data.fechaSolicitud = new Date();
    data.fechaRecogida = new Date(data.fechaSolicitud.getTime() + 24 * 60 * 60 * 1000);
    data.estado = "Activa";

    const idEntrega = await this.port.createEntrega(data);
    await this.lotePort.updateLoteEstado(data.idLote, "Procesado", undefined);
    return { idEntrega, lote };
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

    if (existsEntrega.estado === "Confirmada") {
      throw new Error("Solo se pueden cancelar, entregas confirmadas");
    }

    if(existsEntrega.estado === "Cancelada"){
      throw new Error("Esta entrega ya ha sido cancelada");
    }

    return this.port.deleteEntrega(id);
  }

  async getEntregaById(id: number): Promise<Entrega | null> {
    return await this.port.getEntregaById(id);
  }

  async confirmarEntrega(id: number): Promise<boolean> {
    console.log("confirmarEntrega en application, id:", id); 
    const entrega = await this.port.getEntregaById(id);
    console.log("entrega encontrada:", entrega);
    if (!entrega) throw new Error("Entrega no encontrada");
    if (entrega.estado != "Activa")
      throw new Error("Solo se pueden confirmar entregas activas");

    await this.port.confirmarEntrega(id);

    await this.lotePort.updateLoteEstado(
      entrega.idLote,
      "Procesado",
      new Date(),
    );

    return true;
  }
} //Fin
