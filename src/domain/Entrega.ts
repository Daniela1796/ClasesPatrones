export interface Entrega{
    idEntrega: number;
    idLote: number;
    idSolicitante: number;
    tipoSolicitante: string;
    estado: string;
    fechaSolicitud?: Date;
    fechaRecogida?:Date;
    fechaConfirmacion?:Date;
}