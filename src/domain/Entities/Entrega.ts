export interface Entrega{
    idEntrega: number;
    idLote: number;
    idSolicitante: number;
    tipoSolicitante: string;
    estado: string;
    cantidadSolicitada: number;
    fechaSolicitud?: Date | null;
    fechaRecogida?:Date | null;
    fechaConfirmacion?:Date | null;
}