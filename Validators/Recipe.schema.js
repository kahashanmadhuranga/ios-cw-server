import Joi from "joi";

export const recipeSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  ingredients: Joi.array(),
  imageUrls: Joi.array(),
  steps: Joi.array(),
});

export default { recipeSchema };
