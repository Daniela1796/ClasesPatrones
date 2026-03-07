import Joi from "joi";

export type ReturnUpdateIncentivoData = {
  lotesID: number[];
};

type ValidationUpdateIncentivoData = {
  error: Joi.ValidationError | undefined;
  value: ReturnUpdateIncentivoData;
};

function validateUpdateIncentivoData(data: any): ValidationUpdateIncentivoData {
  const schema = Joi.object({
    lotesID: Joi.array()
      .items(Joi.number().integer().min(1))
      .min(1)
      .optional()
      .messages({
        "array.base": "Los lotes deben ser un arreglo",
        "array.min": "Debe seleccionar al menos un lote",
        "any.required": "Los lotes son requeridos",
      }),
  }).unknown(false);

  const { error, value } = schema.validate(data, { abortEarly: false });
  return { error, value: value as ReturnUpdateIncentivoData };
}

export const loadUpdateIncentivoData = (
  data: any,
): ReturnUpdateIncentivoData => {
  const result = validateUpdateIncentivoData(data);
  if (result.error) {
    const message = result.error.details.map((d) => d.message).join(", ");
    throw new Error(message);
  }
  return result.value;
};
