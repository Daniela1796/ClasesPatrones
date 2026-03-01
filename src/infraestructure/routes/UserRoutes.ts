import { UserApplication } from "../../application/UserApplication";
import { UserAdapter } from "../adapter/UserAdapter";
import { UserController } from "../controller/UserController";
import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { authenticateToken } from "../web/authMiddleware";

const router = Router();

//inicialización de las capas
const userAdapter = new UserAdapter();
const userApp = new UserApplication(userAdapter);
const userController = new UserController(userApp);

//definición de las rutas

router.post("/login", async (req, res) => {
  await userController.login(req, res);
});

export default router;

