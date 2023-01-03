import createError from "http-errors";
import WishList from "../Models/WishList.model.js";
import Recipe from "../Models/Recipe.model.js";
import { wishListSchema } from "../Validators/WishList.schema.js";
import { mongooseIdSchema } from "../Validators/Mongoose.schema.js";
import mongoose from "mongoose";

export const create = async (req, res, next) => {
  try {
    const result = await wishListSchema.validateAsync(req.body);
    mongooseIdSchema(result.userId);
    mongooseIdSchema(result.recipeId);
    const existingItem = await WishList.findOne(result);
    if (existingItem) {
      existingItem.deleteOne();
      return res.send({ message: "removed from the wishlist" });
    }
    const wishList = new WishList(result);
    const savedwishList = await wishList.save();
    res.send({ message: "added to the wishlist", savedwishList });
  } catch (err) {
    if (err.isJoi === true) err.status = 422;
    next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const id = mongooseIdSchema(req.params.id);
    const wishlistItems = await WishList.find({ userId: id }).select([
      "recipeId",
    ]);
    const recipeIds = wishlistItems.map((item) => {
      return mongoose.Types.ObjectId(item.recipeId);
    });
    const result = await Recipe.find({ _id: { $in: recipeIds } });
    if (result.length === 0) throw createError.NotFound();
    res.send(result);
  } catch (err) {
    next(err);
  }
};

export const deleteById = async (req, res, next) => {
  try {
    const userId = mongooseIdSchema(req.params.userId);
    const recipeId = mongooseIdSchema(req.params.recipeId);
    const result = await WishList.deleteOne({ userId, recipeId });
    if (result && result.deletedCount === 0) throw createError.BadRequest();
    res.send(result);
  } catch (err) {
    next(err);
  }
};

export default { create, getAll, deleteById };
