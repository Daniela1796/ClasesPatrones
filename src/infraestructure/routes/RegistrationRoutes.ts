import { UserRegistration } from "../../application/RegistrationApplication";
import { RegistroAdapter } from "../adapter/RegistroAdapter";
import { registroController } from "../controller/RegistrationController";
import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { authenticateToken } from "../web/authMiddleware";

const router = Router();

//inicialización de las capas
const registroAdapt = new RegistroAdapter();
const registroApp = new UserRegistration(registroAdapt);
const registroControll = new registroController(registroApp);

//Definción de rutas

router.post("/registro", async (req, res) => {
  await registroControll.Createregistro(req, res);
});

router.put(
  "/updateRegistroEmpresa/:id",
  authenticateToken,
  async (req, res) => {
    try {
      await registroControll.UpdateEmpresa(req, res);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al actualizar el perfil: ", error });
    }
  }
);

router.put(
  "/updateRegistroEntidad/:id",
  authenticateToken,
  async (req, res) => {
    try {
      await registroControll.UpdateEntidad(req, res);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al actualizar el perfil: ", error });
    }
  },
);

router.put(
  "/updateRegistroVoluntario/:id",
  authenticateToken,
  async (req, res) => {
    try {
      await registroControll.UpdateVoluntario(req, res);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al actualizar el perfil: ", error });
    }
  },
);

router.delete("/deleteRegistro/:id", authenticateToken, async (req, res) => {
  try {
    await registroControll.deleteRegistro(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el perfil: ", error });
  }
});

export default router;
