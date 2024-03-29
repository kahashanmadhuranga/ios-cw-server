import { Router } from "express";
import {
  create,
  getAll,
  deleteById,
} from "../Controllers/WishListController.js";
import { verifyAccessToken } from "../Helpers/jwt_helper.js";

const router = Router();

router.post("/", verifyAccessToken, create);
router.get("/:id", verifyAccessToken, getAll);
router.delete("/:userId/:recipeId", verifyAccessToken, deleteById);

export default router;
