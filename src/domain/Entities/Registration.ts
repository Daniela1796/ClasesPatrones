export interface MainRegistration {
  id: number;
  email: string;
  password: string;
  rol: string;
  nombreCompleto: string;
  localidad: string;
  contacto: string;
  status: boolean;
}

export interface Registration_Empresa extends MainRegistration {
  nit: string;
  razonSocial: string;
  tipoEntidad: string;
}

export interface Registration_Voluntario extends MainRegistration {
  cedula: string;
  proyectoSocial: string;
}

export interface Registration_Entidad extends MainRegistration {
  nit: string;
  razonSocial: string;
  tipoEntidad: string;
}
