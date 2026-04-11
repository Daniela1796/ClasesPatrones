import joi from 'joi';

export type ReturnRegistroData = {
  nombreCompleto: string;
  email: string;
  password: string;
  rol: string;
  localidad: string;
  contacto: string;
  status: boolean;
};

// Tipos específicos por rol que extienden el base
export type ReturnRegistroEmpresaData = ReturnRegistroData & {
  nit: string;
  razonSocial: string;
  tipoEntidad: string;
};

export type ReturnRegistroVoluntarioData = ReturnRegistroData & {
  cedula: string;
  proyectoSocial: string;
};

export type ReturnRegistroEntidadData = ReturnRegistroData & {
  nit: string;
  razonSocial: string;
  tipoEntidad: string;
};

type ValidationEmpresaData = {
  error: joi.ValidationError | undefined;
  value: ReturnRegistroEmpresaData;
};

type ValidationEntidadData = {
  error: joi.ValidationError | undefined;
  value: ReturnRegistroEntidadData;
};

type ValidationVoluntarioData = {
  error: joi.ValidationError | undefined;
  value: ReturnRegistroVoluntarioData;
};

// Tipo final de retorno
export type ReturnFormatoRegistro =
  | ReturnRegistroEmpresaData
  | ReturnRegistroVoluntarioData
  | ReturnRegistroEntidadData;

function validateRegistroEmpresaData(data: any): ValidationEmpresaData {
  const userSchema = joi
    .object({
      email: joi
        .string()
        .trim()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          'string.base': `El correo debe ser un texto`,
          'string.empty': `El correo es requerido`,
          'string.email': `El correo debe tener un formato válido`,
        }),

      password: joi
        .string()
        .min(6)
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
        .required()
        .messages({
          'string.min': `La contraseña debe tener al menos 6 caracteres`,
          'string.pattern.base': `La contraseña debe contener al menos una letra y un número`,
          'string.empty': `La contraseña es requerida`,
        }),

      rol: joi
        .string()
        .valid('empresa', 'voluntario', 'entidad')
        .required()
        .messages({
          'string.base':
            'El rol debe ser un texto: Empresa, Voluntario, Entidad',
          'string.empty': 'El rol es requerido',
          'any.required': 'El rol es requerido',
          'any.only': 'El rol debe ser: empresa, voluntario o entidad', // ← este es el clave
        }),

      nombreCompleto: joi
        .string()
        .trim()
        .min(10)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/) // ← igual que razonSocial
        .required()
        .messages({
          'string.base': `El nombre completo debe ser un texto`,
          'string.empty': `El nombre completo es requerido`,
          'string.min': `El nombre completo debe tener al menos 10 caracteres`,
          'string.pattern.base': `El nombre completo solo puede contener letras y espacios`,
        }),

      localidad: joi
        .string()
        .trim()
        .custom((value) => {
          const normalizar = (str: string) =>
            str
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .toLowerCase();

          const localidades = [
            'Usaquen',
            'Chapinero',
            'Santa Fe',
            'San Cristobal',
            'Usme',
            'Tunjuelito',
            'Bosa',
            'Kennedy',
            'Fontibon',
            'Engativa',
            'Suba',
            'Barrios Unidos',
            'Teusaquillo',
            'Los Martires',
            'Antonio Narino',
            'Puente Aranda',
            'La Candelaria',
            'Rafael Uribe Uribe',
            'Ciudad Bolivar',
            'Sumapaz',
          ];

          const encontrada = localidades.find(
            (loc) => normalizar(loc) === normalizar(value)
          );

          if (!encontrada) throw new Error('localidad_invalida');
          return encontrada; // retorna el valor normalizado con tilde correcta
        })
        .required()
        .messages({
          'any.custom':
            'La localidad debe ser una de las 20 localidades de Bogotá',
          'string.empty': 'La localidad es requerida',
          'any.required': 'La localidad es requerida',
        }),

      contacto: joi
        .string()
        .trim()
        .pattern(/^\d{8,10}$/)
        .required()
        .messages({
          'number.base': 'El contacto debe ser un número',
          'number.min': 'El contacto debe tener 10 dígitos',
          'number.max': 'El contacto debe tener 10 dígitos',
          'any.required': 'El contacto es requerido',
        }),

      //Propiedades de empresa

      nit: joi
        .string()
        .trim()
        .min(10)
        .pattern(/^\d{9,10}-\d{1}$/)
        .required()
        .messages({
          'string.base': `El nombre debe ser un texto`,
          'string.empty': `El nombre es requerido`,
          'string.min': `El nombre debe tener al menos 5 caracteres`,
          'string.pattern.base': `El nombre solo puede contener letras y espacios`,
        }),

      razonSocial: joi
        .string()
        .trim()
        .min(10)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/) // ← incluye tildes y ñ
        .required()
        .messages({
          'string.base': `La razón social debe ser un texto`,
          'string.empty': `La razón social es requerida`,
          'string.min': `La razón social debe tener al menos 10 caracteres`,
          'string.pattern.base': `La razón social solo puede contener letras y espacios`, // ← mensaje correcto
        }),

      tipoEntidad: joi
        .string()
        .trim()
        .valid('Privada', 'Publica', 'Mixta')
        .required()
        .messages({
          'any.only': 'El tipo de entidad no es válido',
          'string.empty': 'El tipo de entidad es requerido',
          'any.required': 'El tipo de entidad es requerido',
        }),
    })
    .unknown(false); // No permitir campos adicionales

  const { error, value } = userSchema.validate(data, { abortEarly: false });

  return { error, value: value as ReturnRegistroEmpresaData };
}

//Entidad
function validateRegistroEntidadData(data: any): ValidationEntidadData {
  const userSchema = joi
    .object({
      email: joi
        .string()
        .trim()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          'string.base': `El correo debe ser un texto`,
          'string.empty': `El correo es requerido`,
          'string.email': `El correo debe tener un formato válido`,
        }),

      password: joi
        .string()
        .min(6)
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
        .required()
        .messages({
          'string.min': `La contraseña debe tener al menos 6 caracteres`,
          'string.pattern.base': `La contraseña debe contener al menos una letra y un número`,
          'string.empty': `La contraseña es requerida`,
        }),

      rol: joi
        .string()
        .valid('empresa', 'voluntario', 'entidad')
        .required()
        .messages({
          'string.base':
            'El rol debe ser un texto: Empresa, Voluntario, Entidad',
          'string.empty': 'El rol es requerido',
          'any.required': 'El rol es requerido',
          'any.only': 'El rol debe ser: empresa, voluntario o entidad', // ← este es el clave
        }),

      nombreCompleto: joi
        .string()
        .trim()
        .min(10)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/) // ← igual que razonSocial
        .required()
        .messages({
          'string.base': `El nombre completo debe ser un texto`,
          'string.empty': `El nombre completo es requerido`,
          'string.min': `El nombre completo debe tener al menos 10 caracteres`,
          'string.pattern.base': `El nombre completo solo puede contener letras y espacios`,
        }),

      localidad: joi
        .string()
        .trim()
        .custom((value) => {
          const normalizar = (str: string) =>
            str
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .toLowerCase();

          const localidades = [
            'Usaquen',
            'Chapinero',
            'Santa Fe',
            'San Cristobal',
            'Usme',
            'Tunjuelito',
            'Bosa',
            'Kennedy',
            'Fontibon',
            'Engativa',
            'Suba',
            'Barrios Unidos',
            'Teusaquillo',
            'Los Martires',
            'Antonio Narino',
            'Puente Aranda',
            'La Candelaria',
            'Rafael Uribe Uribe',
            'Ciudad Bolivar',
            'Sumapaz',
          ];

          const encontrada = localidades.find(
            (loc) => normalizar(loc) === normalizar(value)
          );

          if (!encontrada) throw new Error('localidad_invalida');
          return encontrada; // retorna el valor normalizado con tilde correcta
        })
        .required()
        .messages({
          'any.custom':
            'La localidad debe ser una de las 20 localidades de Bogotá',
          'string.empty': 'La localidad es requerida',
          'any.required': 'La localidad es requerida',
        }),

      contacto: joi
        .string()
        .trim()
        .pattern(/^\d{8,10}$/)
        .required()
        .messages({
          'number.base': 'El contacto debe ser un número',
          'number.min': 'El contacto debe tener 10 dígitos',
          'number.max': 'El contacto debe tener 10 dígitos',
          'any.required': 'El contacto es requerido',
        }),

      //Propiedades de entidades

      nit: joi
        .string()
        .trim()
        .min(10)
        .pattern(/^\d{9,10}-\d{1}$/)
        .required()
        .messages({
          'string.base': `El nit debe ser un texto`,
          'string.empty': `El nit es requerido`,
          'string.min': `El nit debe tener al menos 5 caracteres`,
          'string.pattern.base': `El nit solo puede contener letras y espacios`,
        }),

      razonSocial: joi
        .string()
        .trim()
        .min(10)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/) // ← incluye tildes y ñ
        .required()
        .messages({
          'string.base': `La razón social debe ser un texto`,
          'string.empty': `La razón social es requerida`,
          'string.min': `La razón social debe tener al menos 10 caracteres`,
          'string.pattern.base': `La razón social solo puede contener letras y espacios`, // ← mensaje correcto
        }),

      tipoEntidad: joi
        .string()
        .trim()
        .valid(
          'Colegio',
          'Universidad',
          'Guarderia',
          'Banco de Alimentos',
          'Comedor Comunitario',
          'Iglesia',
          'Fundacion',
          'ONG',
          'Hospital',
          'Hogar Infantil'
        )
        .required()
        .messages({
          'any.only': 'El tipo de entidad no es válido',
          'string.empty': 'El tipo de entidad es requerido',
          'any.required': 'El tipo de entidad es requerido',
        }),
    })
    .unknown(false); // No permitir campos adicionales

  const { error, value } = userSchema.validate(data, { abortEarly: false });

  return { error, value: value as ReturnRegistroEntidadData };
}

//Voluntario

function validateRegistroVoluntarioData(data: any): ValidationVoluntarioData {
  const userSchema = joi
    .object({
      nombreCompleto: joi
        .string()
        .trim()
        .min(10)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/) // ← igual que razonSocial
        .required()
        .messages({
          'string.base': `El nombre completo debe ser un texto`,
          'string.empty': `El nombre completo es requerido`,
          'string.min': `El nombre completo debe tener al menos 10 caracteres`,
          'string.pattern.base': `El nombre completo solo puede contener letras y espacios`,
        }),

      email: joi
        .string()
        .trim()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          'string.base': `El correo debe ser un texto`,
          'string.empty': `El correo es requerido`,
          'string.email': `El correo debe tener un formato válido`,
        }),

      password: joi
        .string()
        .min(6)
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
        .required()
        .messages({
          'string.min': `La contraseña debe tener al menos 6 caracteres`,
          'string.pattern.base': `La contraseña debe contener al menos una letra y un número`,
          'string.empty': `La contraseña es requerida`,
        }),

      rol: joi
        .string()
        .valid('empresa', 'voluntario', 'entidad')
        .required()
        .messages({
          'string.base':
            'El rol debe ser un texto: Empresa, Voluntario, Entidad',
          'string.empty': 'El rol es requerido',
          'any.required': 'El rol es requerido',
          'any.only': 'El rol debe ser: empresa, voluntario o entidad', // ← este es el clave
        }),

      localidad: joi
        .string()
        .trim()
        .custom((value) => {
          const normalizar = (str: string) =>
            str
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .toLowerCase();

          const localidades = [
            'Usaquen',
            'Chapinero',
            'Santa Fe',
            'San Cristobal',
            'Usme',
            'Tunjuelito',
            'Bosa',
            'Kennedy',
            'Fontibon',
            'Engativa',
            'Suba',
            'Barrios Unidos',
            'Teusaquillo',
            'Los Martires',
            'Antonio Narino',
            'Puente Aranda',
            'La Candelaria',
            'Rafael Uribe Uribe',
            'Ciudad Bolivar',
            'Sumapaz',
          ];

          const encontrada = localidades.find(
            (loc) => normalizar(loc) === normalizar(value)
          );

          if (!encontrada) throw new Error('localidad_invalida');
          return encontrada; // retorna el valor normalizado con tilde correcta
        })
        .required()
        .messages({
          'any.custom':
            'La localidad debe ser una de las 20 localidades de Bogotá',
          'string.empty': 'La localidad es requerida',
          'any.required': 'La localidad es requerida',
        }),

      contacto: joi
        .string()
        .trim()
        .pattern(/^\d{8,10}$/)
        .required()
        .messages({
          'number.base': 'El contacto debe ser un número',
          'number.min': 'El contacto debe tener 10 dígitos',
          'number.max': 'El contacto debe tener 10 dígitos',
          'any.required': 'El contacto es requerido',
        }),

      cedula: joi
        .string()
        .trim()
        .pattern(/^\d{8,10}$/)
        .required()
        .messages({
          'string.base': `La cédula solo pueden ser números`,
          'string.empty': `La cédula es requerida`,
          'string.pattern.base': `La cédula debe tener entre 8 y 10 dígitos`,
        }),

      proyectoSocial: joi
        .string()
        .trim()
        .pattern(/^[a-zA-Z\s]+$/)
        .required()
        .messages({
          'string.base': `El proyecto social debe ser un texto`,
          'string.empty': `El proyecto social es obligatorio`,
        }),
    })
    .unknown(false); // No permitir campos adicionales

  const { error, value } = userSchema.validate(data, { abortEarly: false });

  return { error, value: value as ReturnRegistroVoluntarioData };
}

export const loadRegistroData = (data: any): ReturnFormatoRegistro => {
  if (data.rol === 'empresa') {
    const { error, value } = validateRegistroEmpresaData(data);
    if (error) throw new Error(error.details.map((d) => d.message).join(', '));
    return value;
  }

  if (data.rol === 'voluntario') {
    const { error, value } = validateRegistroVoluntarioData(data);
    if (error) throw new Error(error.details.map((d) => d.message).join(', '));
    return value;
  }

  if (data.rol === 'entidad') {
    const { error, value } = validateRegistroEntidadData(data);
    if (error) throw new Error(error.details.map((d) => d.message).join(', '));
    return value;
  }

  throw new Error('Rol inválido, no fue posible registrar el perfil');
};
