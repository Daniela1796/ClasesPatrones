import { Entrega } from "../domain/Entrega";
import { EntregaPort } from "../domain/EntregaPort";
import { LotePort } from "../domain/LotePort";
import { LoteBase } from "../domain/Lote";
import { RegistrationPort } from "../domain/RegistrationPort";

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

  async getLotesDisponibles(idSolicitante: number): Promise<LoteBase[]> {
    const solicitante = await this.userPort.getRegistrationById(idSolicitante);
    if (!solicitante) throw new Error("Solicitante no encontrado");

    const lotes = await this.lotePort.getLotesDisponibles();
    const PRIORIDAD: Record<string, number> = {
      A: 1,
      B: 2,
      C: 3,
      D: 4,
    };

    // Paso 1: ordenar por clasificacion y fecha (criterios vitales)
    const lotesOrdenados = lotes.sort((a, b) => {
      if (PRIORIDAD[a.clasificacion] !== PRIORIDAD[b.clasificacion]) {
        return (
          (PRIORIDAD[a.clasificacion] ?? 99) -
          (PRIORIDAD[b.clasificacion] ?? 99)
        );
      }
      return (
        new Date(a.fechaVencimiento).getTime() -
        new Date(b.fechaVencimiento).getTime()
      );
    });

    // Paso 2: dentro de cada grupo, priorizar misma localidad
    // Para esto necesitamos la localidad del donante de cada lote
    const lotesConLocalidad = await Promise.all(
      lotesOrdenados.map(async (lote) => {
        const donante = await this.userPort.getRegistrationById(lote.idDonante);
        return { lote, localidadDonante: donante?.localidad };
      }),
    );

    // Paso 3: reordenar priorizando misma localidad pero respetando clasificacion
    return lotesConLocalidad
      .sort((a, b) => {
        // Si son de la misma clasificacion, priorizar localidad
        if (a.lote.clasificacion === b.lote.clasificacion) {
          if (
            a.localidadDonante === solicitante.localidad &&
            b.localidadDonante !== solicitante.localidad
          )
            return -1;
          if (
            b.localidadDonante === solicitante.localidad &&
            a.localidadDonante !== solicitante.localidad
          )
            return 1;
        }
        return 0;
      })
      .map((item) => item.lote); // retorna solo los lotes sin la localidad
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
    await this.lotePort.updateLoteEstado(
      data.idLote,
      "Procesado",
      undefined,
    );
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
