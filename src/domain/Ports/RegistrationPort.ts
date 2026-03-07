import {
  MainRegistration,
  Registration_Empresa,
  Registration_Entidad,
  Registration_Voluntario,
} from "../Entities/Registration";

export interface RegistrationPort {
  //Empresas
  createRegistrationEmpresa(
    data: Omit<Registration_Empresa, "id">,
  ): Promise<number>;
  updateRegistrationEmpresa(
    id: number,
    registration: Partial<Registration_Empresa>,
  ): Promise<boolean>;
  getEmpresaByNIT(nit: string): Promise<Registration_Empresa | null>;
  getRegistrationByRazonSocialEmpresa(
    razon_social: string,
  ): Promise<Registration_Empresa | null>;

  //Voluntarios
  createRegistrationVoluntario(
    data: Omit<Registration_Voluntario, "id">,
  ): Promise<number>;
  updateRegistrationVoluntario(
    id: number,
    registration: Partial<Registration_Voluntario>,
  ): Promise<boolean>;
  getVoluntarioByCedula(
    cedula: string,
  ): Promise<Registration_Voluntario | null>;

  //Entidades
  createRegistrationEntidad(
    data: Omit<Registration_Entidad, "id">,
  ): Promise<number>;
  updateRegistrationEntidad(
    id: number,
    registration: Partial<Registration_Entidad>,
  ): Promise<boolean>;
  getEntidadByNIT(nit: string): Promise<Registration_Entidad | null>;
  getRegistrationByRazonSocialEntidad(
    razon_social: string,
  ): Promise<Registration_Entidad | null>;

  //Otros CRUD
  getRegistrationById(id: number): Promise<MainRegistration | null>;
  getRegistrationByUser(usuario: string): Promise<MainRegistration | null>;
  getRegistrationByEmail(email: string): Promise<MainRegistration | null>;
  getRegistrationByContacto(contacto: string): Promise<MainRegistration | null>;
  getRegistrationByLocalidad(localidad: string): Promise<MainRegistration | null>;
  getRegistrationByRol(rol: string): Promise<MainRegistration[]>;
  getAllRegistrations(): Promise<MainRegistration[]>;
  deleteMainRegistration(id: number): Promise<boolean>;
}
