import { UserDonaciones } from "../../application/LoteApplication";
import { LoteAdapter } from "../adapter/LoteAdapter";
import { loteController } from "../controller/LoteController";
import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { authenticateToken } from "../web/authMiddleware";

const router = Router();

const loteAdaptador = new LoteAdapter();
const loteApp = new UserDonaciones(loteAdaptador);
const loteControlador = new loteController(loteApp);

//Crear registro
router.post("/lote", authenticateToken, async (req, res) => {
  await loteControlador.createLote(req, res);
});

//Visualizar registros
router.get("/verlotes/:id", authenticateToken, async (req, res) => {
  await loteControlador.getLotesByDonante(req, res);
});

//Actualizar registro
router.put("/actualizarLote/:id", authenticateToken, async (req, res) => {
  try {
    await loteControlador.updateLote(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la donación" });
  }
});

router.delete("/eliminarLote/:id", authenticateToken, async (req, res) => {
  try {
    await loteControlador.deleteLote(req, res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el item donado: ", error });
  }
});

export default router;
