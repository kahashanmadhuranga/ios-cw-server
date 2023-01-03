import { Router } from "express";
import {
  create,
  getAll,
  getById,
  deleteById,
  update,
} from "../Controllers/Recipe.controller.js";
import { verifyAccessToken } from "../Helpers/jwt_helper.js";

const router = Router();

router.post("/", verifyAccessToken, create);
router.put("/:id", verifyAccessToken, update);
router.get("/", getAll);
router.get("/:id", getById);
router.delete("/:id", verifyAccessToken, deleteById);

export default router;
