import createError from "http-errors";
import Recipe from "../Models/Recipe.model.js";
import { recipeSchema, typeValidateSchema } from "../Validators/Recipe.schema.js";
import { mongooseIdSchema } from "../Validators/Mongoose.schema.js";

export const create = async (req, res, next) => {
  try {
    const result = await recipeSchema.validateAsync(req.body);
    const recipe = new Recipe(result);
    const savedRecipe = await recipe.save();
    res.send(savedRecipe);
  } catch (err) {
    if (err.isJoi === true) err.status = 422;
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const id = mongooseIdSchema(req.params.id);
    const result = await recipeSchema.validateAsync(req.body);
    const recipe = await Recipe.findOne({ _id: id });
    if (!recipe) throw createError.NotFound();
    const updatedRecipe = await recipe.update(result);
    res.send(updatedRecipe);
  } catch (err) {
    if (err.isJoi === true) err.status = 422;
    next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const key = req.query.key;
    const type = req.query.type;
    if(type){
      await typeValidateSchema.validateAsync({type});
    }
    const result = await Recipe.find(key ? { title: {'$regex' : key, '$options' : 'i'} } : (type ? {type} : {}));
    if (result.length === 0) throw createError.NotFound();
    res.send(result);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const id = mongooseIdSchema(req.params.id);
    const result = await Recipe.findOne({ _id: id });
    if (!result) throw createError.NotFound();
    res.send(result);
  } catch (err) {
    next(err);
  }
};

export const deleteById = async (req, res, next) => {
  try {
    const id = mongooseIdSchema(req.params.id);
    const result = await Recipe.deleteOne({ _id: id });
    if (result && result.deletedCount === 0) throw createError.BadRequest();
    console.log(result);
    res.send(result);
  } catch (err) {
    next(err);
  }
};

export default { create, update, getAll, getById, deleteById };
