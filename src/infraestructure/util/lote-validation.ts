import Joi from "joi";

export type ReturnLoteData = {
  idDonante: number;
  tipoDonante: string;
  alimento: string;
  clasificacion: string;
  fechaVencimiento: Date;
};

export type ReturnLoteEmpresaData = ReturnLoteData & {
  cantidadDeCajas: number;
  precioPorCaja: number;
};

export type ReturnLoteVoluntarioData = ReturnLoteData & {
  cantidadPorUnidad: number;
};

type ValidationLoteEmpresaData = {
  error: Joi.ValidationError | undefined;
  value: ReturnLoteEmpresaData;
};

type ValidationLoteVoluntarioData = {
  error: Joi.ValidationError | undefined;
  value: ReturnLoteVoluntarioData;
};


function validateLoteEmpresaData(data: any): ValidationLoteEmpresaData {
  const schema = Joi.object({
    alimento: Joi.string()
      .trim()
      .min(3)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        "string.empty": "El alimento es requerido",
        "string.min": "El alimento debe tener al menos 3 caracteres",
        "string.pattern.base": "El alimento solo puede contener letras",
      }),

    clasificacion: Joi.string().valid("A", "B", "C", "D").required().messages({
      "any.only": "La clasificación debe ser A, B, C o D",
      "any.required": "La clasificación es requerida",
    }),

    cantidadDeCajas: Joi.number().integer().min(1).required().messages({
      "number.min": "La cantidad mínima es 1 caja",
      "any.required": "La cantidad de cajas es requerida",
    }),

    precioPorCaja: Joi.number().min(1).required().messages({
      "number.min": "El precio mínimo es 1",
      "any.required": "El precio por caja es requerido",
    }),

    fechaVencimiento: Joi.date()
      .min(new Date(Date.now() + 48 * 60 * 60 * 1000)) // 👈 ahora + 48 horas
      .required()
      .messages({
        "date.min":
          "La fecha de vencimiento debe ser al menos 48 horas desde ahora",
        "any.required": "La fecha de vencimiento es requerida",
      }),
  }).unknown(false);

  const { error, value } = schema.validate(data, { abortEarly: false });
  return { error, value: value as ReturnLoteEmpresaData };
}

function validateLoteVoluntarioData(data: any): ValidationLoteVoluntarioData {
  const schema = Joi.object({
    alimento: Joi.string()
      .trim()
      .min(3)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        "string.empty": "El alimento es requerido",
        "string.min": "El alimento debe tener al menos 3 caracteres",
        "string.pattern.base": "El alimento solo puede contener letras",
      }),

    clasificacion: Joi.string().valid("A", "B", "C", "D").required().messages({
      "any.only": "La clasificación debe ser A, B, C o D",
      "any.required": "La clasificación es requerida",
    }),

    cantidadPorUnidad: Joi.number().integer().min(5).required().messages({
      "number.min": "La cantidad mínima por alimento son 5 unidades",
      "any.required": "La cantidad de unidades de alimento es requerida",
    }),

    fechaVencimiento: Joi.date()
      .min(new Date(Date.now() + 48 * 60 * 60 * 1000)) 
      .required()
      .messages({
        "date.min":
          "La fecha de vencimiento debe ser al menos 48 horas desde ahora",
        "any.required": "La fecha de vencimiento es requerida",
      }),
  }).unknown(false);

  const { error, value } = schema.validate(data, { abortEarly: false });
  return { error, value: value as ReturnLoteVoluntarioData };
}

export const loadLoteEmpresa = (data: any): ReturnLoteEmpresaData => {
  const { error, value } = validateLoteEmpresaData(data);
  if (error) throw new Error(error.details.map((d) => d.message).join(", "));
  return value;
};


export const loadLoteVoluntario = (data: any): ReturnLoteVoluntarioData => {
  const { error, value } = validateLoteVoluntarioData(data);
  if (error) throw new Error(error.details.map((d) => d.message).join(", "));
  return value;
};
