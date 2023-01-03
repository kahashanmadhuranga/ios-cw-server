import { Router } from "express";
import {
  create,
  getAll,
  deleteById,
} from "../Controllers/WishListController.js";
// import { verifyAccessToken } from "../Helpers/jwt_helper.js";

const router = Router();

router.post("/", create);
router.get("/:id", getAll);
router.delete("/:userId/:recipeId", deleteById);

export default router;