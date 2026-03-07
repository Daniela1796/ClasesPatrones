import Joi from "joi";

export type ReturnIncentivoData = {
  lotesID: number[];
};

type ValidationIncentivoData = {
  error: Joi.ValidationError | undefined;
  value: ReturnIncentivoData;
};

function validateIncentivoData(data: any): ValidationIncentivoData {
  const schema = Joi.object({
    lotesID: Joi.array()
      .items(Joi.number().integer().min(1))
      .min(1)
      .required()
      .messages({
        "array.base": "Los lotes deben ser un arreglo",
        "array.min": "Debe seleccionar al menos un lote",
        "any.required": "Los lotes son requeridos",
      }),
  }).unknown(false);

  const { error, value } = schema.validate(data, { abortEarly: false });
  return { error, value: value as ReturnIncentivoData };
}

export const loadIncentivoData = (data: any): ReturnIncentivoData => {
  const result = validateIncentivoData(data);
  if (result.error) {
    const message = result.error.details.map((d) => d.message).join(", ");
    throw new Error(message);
  }
  return result.value;
};
