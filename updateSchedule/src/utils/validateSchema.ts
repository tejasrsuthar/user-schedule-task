export const validateSchema = async (request, schema) => {
  await schema.validate(request);
};
