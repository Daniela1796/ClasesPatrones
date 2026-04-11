import { Repository } from 'typeorm';
import {
  MainRegistration,
  Registration_Empresa,
  Registration_Voluntario,
  Registration_Entidad,
} from '../../domain/Entities/Registration';
import { User } from '../entities/User';
import { Empresa } from '../entities/Empresa';
import { Voluntario } from '../entities/Voluntario';
import { Entidad } from '../entities/Entidad';
import { RegistrationPort } from '../../domain/Ports/RegistrationPort';
import { AppDataSource } from '../config/data-base';

//-------------------------------------------------------------------------

export class RegistroAdapter implements RegistrationPort {
  private registroRepository: Repository<User>;
  private registroRepoEmpresa: Repository<Empresa>;
  private registroRepoVoluntario: Repository<Voluntario>;
  private registroRepoEntidad: Repository<Entidad>;

  constructor() {
    this.registroRepository = AppDataSource.getRepository(User);
    this.registroRepoEmpresa = AppDataSource.getRepository(Empresa);
    this.registroRepoVoluntario = AppDataSource.getRepository(Voluntario);
    this.registroRepoEntidad = AppDataSource.getRepository(Entidad);
  }

  //TRANSFORMA LA ENTIDAD DE INFRAESTRUCTURA(entities/user) al modelo de dominio(User)
  private toDomain(user: User): MainRegistration {
    return {
      id: user.id_user,
      email: user.email_user,
      password: user.password_user,
      rol: user.rol,
      nombreCompleto: user.name_user,
      localidad: user.localidad,
      contacto: user.contacto,
      status: user.status_user,
    };
  }

  //Transformar el modelo de dominio a la entidad de infraestructura
  private toEntity(user: Omit<MainRegistration, 'id'>): User {
    const userEntity = new User();
    userEntity.name_user = user.nombreCompleto;
    userEntity.email_user = user.email;
    userEntity.password_user = user.password;
    userEntity.status_user = user.status;
    userEntity.rol = user.rol;
    userEntity.localidad = user.localidad;
    userEntity.contacto = user.contacto;
    return userEntity;
  }

  private toEntityPartial(user: Partial<MainRegistration>): Partial<User> {
    const userEntity: Partial<User> = {};

    // Solo traduce si el campo existe
    if (user.email) userEntity.email_user = user.email;
    if (user.password) userEntity.password_user = user.password;
    if (user.nombreCompleto) userEntity.name_user = user.nombreCompleto;
    if (user.localidad) userEntity.localidad = user.localidad;
    if (user.contacto) userEntity.contacto = user.contacto;

    return userEntity;
  }

  private toDomainEmpresa(empresa: Empresa): Registration_Empresa {
    return {
      ...this.toDomain(empresa.user),
      nit: empresa.nit,
      razonSocial: empresa.razonSocial,
      tipoEntidad: empresa.tipoEntidad,
    };
  }

  private toEntityEmpresa(
    empresa: Omit<Registration_Empresa, 'id'>,
    savedUser: User
  ): Empresa {
    const empresaEntity = new Empresa();
    empresaEntity.user = savedUser;
    empresaEntity.user_id = savedUser.id_user;
    empresaEntity.nit = empresa.nit;
    empresaEntity.razonSocial = empresa.razonSocial;
    empresaEntity.tipoEntidad = empresa.tipoEntidad;
    return empresaEntity;
  }

  private toEntityPartialEmpresa(
    empresa: Partial<Registration_Empresa>
  ): Partial<Empresa> {
    const empresaUpdate: Partial<Empresa> = {};
    if (empresa.razonSocial) empresaUpdate.razonSocial = empresa.razonSocial;
    if (empresa.tipoEntidad) empresaUpdate.tipoEntidad = empresa.tipoEntidad;

    return empresaUpdate;
  }

  private toDomainEntidad(entidad: Entidad): Registration_Entidad {
    return {
      ...this.toDomain(entidad.user),
      nit: entidad.nit,
      razonSocial: entidad.razonSocial,
      tipoEntidad: entidad.tipoEntidad,
    };
  }

  private toEntityEntidad(
    entidad: Omit<Registration_Entidad, 'id'>,
    savedUser: User
  ): Entidad {
    const entidadEntity = new Entidad();
    entidadEntity.user = savedUser;
    entidadEntity.user_id = savedUser.id_user;
    entidadEntity.nit = entidad.nit;
    entidadEntity.razonSocial = entidad.razonSocial;
    entidadEntity.tipoEntidad = entidad.tipoEntidad;
    return entidadEntity;
  }

  private toEntityPartialEntidad(
    entidad: Partial<Registration_Entidad>
  ): Partial<Entidad> {
    const entidadUpdate: Partial<Entidad> = {};
    if (entidad.razonSocial) entidadUpdate.razonSocial = entidad.razonSocial;
    if (entidad.tipoEntidad) entidadUpdate.tipoEntidad = entidad.tipoEntidad;

    return entidadUpdate;
  }

  private toDomainVoluntario(voluntario: Voluntario): Registration_Voluntario {
    return {
      ...this.toDomain(voluntario.user),
      cedula: voluntario.cedula,
      proyectoSocial: voluntario.proyectoSocial,
    };
  }

  private toEntityVoluntario(
    voluntario: Omit<Registration_Voluntario, 'id'>,
    savedUser: User
  ): Voluntario {
    const voluntarioEntity = new Voluntario();
    voluntarioEntity.user = savedUser;
    voluntarioEntity.user_id = savedUser.id_user;
    voluntarioEntity.cedula = voluntario.cedula;
    voluntarioEntity.proyectoSocial = voluntario.proyectoSocial;
    return voluntarioEntity;
  }

  private toEntityPartialVoluntario(
    voluntario: Partial<Registration_Voluntario>
  ): Partial<Voluntario> {
    const voluntarioUpdate: Partial<Voluntario> = {};
    if (voluntario.cedula) voluntarioUpdate.cedula = voluntario.cedula;
    if (voluntario.proyectoSocial)
      voluntarioUpdate.proyectoSocial = voluntario.proyectoSocial;

    return voluntarioUpdate;
  }

  async createRegistrationEmpresa(
    empresa: Omit<Registration_Empresa, 'id'>
  ): Promise<number> {
    try {
      //Guardar en users
      const toUsers = this.toEntity(empresa);
      const savedUser = await this.registroRepository.save(toUsers);

      //Guardar en empresa
      const empresaEntity = this.toEntityEmpresa(empresa, savedUser);
      const savedEmpresa = await this.registroRepoEmpresa.save(empresaEntity);

      return savedEmpresa.id_empresa;
    } catch (error) {
      console.error('Error creando usuario de empresa: ', error);
      throw new Error('Error al crear el usuario');
    }
  }

  async updateRegistrationEmpresa(
    id_empresa: number,
    empresa: Partial<Registration_Empresa>
  ): Promise<boolean> {
    try {
      const existingEmpresa = await this.registroRepoEmpresa.findOne({
        where: { user_id: id_empresa },
      });

      if (!existingEmpresa) return false;

      //gUARDAR ACTUALIZACIÓN EN USERS
      const userUpdate = this.toEntityPartial(empresa);

      if (Object.keys(userUpdate).length > 0) {
        await this.registroRepository.update(
          existingEmpresa.user_id,
          userUpdate
        );
      }

      //Actualizar la información de empresa
      const empresaUpdate = this.toEntityPartialEmpresa(empresa);

      if (Object.keys(empresaUpdate).length > 0) {
        await this.registroRepoEmpresa.update(id_empresa, empresaUpdate);
      }

      return true;
    } catch (error) {
      console.error('Error actualizando usuario: ', error);
      throw new Error('Error actualizando usuario');
    }
  }

  async createRegistrationEntidad(
    entidad: Omit<Registration_Entidad, 'id'>
  ): Promise<number> {
    try {
      //Guardar en tabla users
      const toUsers = this.toEntity(entidad);
      const savedUser = await this.registroRepository.save(toUsers);

      //GUARDAR LA ENTIDAD EN LA TABLA USUARIOS
      const entidadEntity = this.toEntityEntidad(entidad, savedUser);
      const savedEntidad = await this.registroRepoEntidad.save(entidadEntity);
      return savedEntidad.id_entidad;
    } catch (error) {
      console.error('Error creando usuario de empresa: ', error);
      throw new Error('Error al crear el usuario');
    }
  }

  async updateRegistrationEntidad(
    id_entidad: number,
    entidad: Partial<Registration_Entidad>
  ): Promise<boolean> {
    try {
      const existingEntidad = await this.registroRepoEntidad.findOne({
        where: { user_id: id_entidad },
      });

      if (!existingEntidad) return false;

      //Actualizar en users
      const userUpdate = this.toEntityPartial(entidad);

      if (Object.keys(userUpdate).length > 0) {
        await this.registroRepository.update(
          existingEntidad.user_id,
          userUpdate
        );
      }

      //Actualizar la información de la entidad
      const entidadUpdate = this.toEntityPartialEntidad(entidad);

      if (Object.keys(entidadUpdate).length > 0) {
        await this.registroRepoEntidad.update(id_entidad, entidadUpdate);
      }

      return true;
    } catch (error) {
      console.error('Error actualizando usarios: ', error);
      throw new Error('Error actualizando usuario');
    }
  }

  async createRegistrationVoluntario(
    voluntario: Omit<Registration_Voluntario, 'id'>
  ): Promise<number> {
    try {
      //Guardar en users
      const toUsers = this.toEntity(voluntario);
      const savedUser = await this.registroRepository.save(toUsers);

      //GUARDAR EL COLUNTARIO CON EL ID DE USUARIO GENERADO
      const voluntarioEntity = this.toEntityVoluntario(voluntario, savedUser);
      const savedVoluntario =
        await this.registroRepoVoluntario.save(voluntarioEntity);
      return savedVoluntario.id_voluntario;
    } catch (error) {
      console.error('Error creando usuario voluntario: ', error);
      throw new Error('Error al crear el usuario');
    }
  }

  async updateRegistrationVoluntario(
    id_voluntario: number,
    voluntario: Partial<Registration_Voluntario>
  ): Promise<boolean> {
    try {
      const existingVoluntario = await this.registroRepoVoluntario.findOne({
        where: { user_id: id_voluntario },
      });

      if (!existingVoluntario) return false;

      const userUpdate = this.toEntityPartial(voluntario);

      if (Object.keys(userUpdate).length > 0) {
        await this.registroRepository.update(
          existingVoluntario.user_id,
          userUpdate
        );
      }

      const voluntarioUpdate = this.toEntityPartialVoluntario(voluntario);

      if (Object.keys(voluntarioUpdate).length > 0) {
        await this.registroRepoVoluntario.update(
          id_voluntario,
          voluntarioUpdate
        );
      }

      return true;
    } catch (error) {
      console.error('Error actualizando voluntario: ', error);
      throw new Error('Error actualizando voluntario');
    }
  }

  async deleteMainRegistration(id: number): Promise<boolean> {
    try {
      const existingUser = await this.registroRepository.findOne({
        where: { id_user: id },
      });

      if (!existingUser) return false;

      Object.assign(existingUser, {
        status_user: false,
      });

      await this.registroRepository.save(existingUser);
      return true;
    } catch (error) {
      console.error('Error al actualizar estado de usuario: ', Error);
      throw new Error('Error al dar baja a usuario');
    }
  }

  async getEmpresaByNIT(
    nit_empresa: string
  ): Promise<Registration_Empresa | null> {
    const empresaNit = await this.registroRepoEmpresa.findOne({
      where: { nit: nit_empresa },
    });

    if (!empresaNit) return null;

    //Actualizar solo los campos enviados
    return this.toDomainEmpresa(empresaNit);
  }

  async getRegistrationByRazonSocialEmpresa(
    razon_social: string
  ): Promise<Registration_Empresa | null> {
    const razonSocial_empresa = await this.registroRepoEmpresa.findOne({
      where: { razonSocial: razon_social },
    });

    if (!razonSocial_empresa) return null;

    //Actualizar solo los campos enviados
    return this.toDomainEmpresa(razonSocial_empresa);
  }

  async getEntidadByNIT(
    nit_entidad: string
  ): Promise<Registration_Entidad | null> {
    const entidadNit = await this.registroRepoEntidad.findOne({
      where: { nit: nit_entidad },
    });

    if (!entidadNit) return null;

    //Actualizar solo los campos enviados
    return this.toDomainEntidad(entidadNit);
  }

  async getRegistrationByRazonSocialEntidad(
    razon_social: string
  ): Promise<Registration_Entidad | null> {
    const razonSocial_entidad = await this.registroRepoEntidad.findOne({
      where: { razonSocial: razon_social },
    });

    if (!razonSocial_entidad) return null;

    //Actualizar solo los campos enviados
    return this.toDomainEntidad(razonSocial_entidad);
  }

  async getVoluntarioByCedula(
    cedulaVol: string
  ): Promise<Registration_Voluntario | null> {
    const cedulaVoluntario = await this.registroRepoVoluntario.findOne({
      where: { cedula: cedulaVol },
    });

    if (!cedulaVoluntario) return null;

    //Actualizar solo los campos enviados
    return this.toDomainVoluntario(cedulaVoluntario);
  }

  async getRegistrationById(id: number): Promise<MainRegistration | null> {
    const user = await this.registroRepository.findOne({
      where: { id_user: id },
    });

    if (!user) return null;

    //Actualizar solo los campos enviados
    return this.toDomain(user);
  }

  async getRegistrationByUser(
    usuario: string
  ): Promise<MainRegistration | null> {
    const user = await this.registroRepository.findOne({
      where: { name_user: usuario },
    });

    if (!user) return null;

    //Actualizar solo los campos enviados
    return this.toDomain(user);
  }

  async getRegistrationByEmail(
    email: string
  ): Promise<MainRegistration | null> {
    const user = await this.registroRepository.findOne({
      where: { email_user: email },
    });

    if (!user) return null;

    //Actualizar solo los campos enviados
    return this.toDomain(user);
  }

  async getRegistrationByContacto(
    contacto_user: string
  ): Promise<MainRegistration | null> {
    const user = await this.registroRepository.findOne({
      where: { contacto: contacto_user },
    });

    if (!user) return null;

    return this.toDomain(user);
  }

  async getRegistrationByLocalidad(
    localidad_user: string
  ): Promise<MainRegistration | null> {
    const user = await this.registroRepository.findOne({
      where: { localidad: localidad_user },
    });

    if (!user) return null;

    return this.toDomain(user);
  }
  async getRegistrationByRol(rol_user: string): Promise<MainRegistration[]> {
    try {
      const users = await this.registroRepository.find({
        where: { rol: rol_user },
      });
      return users.map(this.toDomain);
    } catch (error) {
      console.error('Error obteniendo usuario: ', Error);
      throw new Error('Error en la lista de usuarios');
    }
  }

  async getAllRegistrations(): Promise<MainRegistration[]> {
    try {
      const users = await this.registroRepository.find({
        where: { status_user: true },
      });
      return users.map(this.toDomain);
    } catch (error) {
      console.error('Error obteniendo usuarioa: ', Error);
      throw new Error('Error en la lista de usuarios');
    }
  }
}
