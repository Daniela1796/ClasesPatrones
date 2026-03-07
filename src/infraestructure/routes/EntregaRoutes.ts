import { userEntrega } from "../../application/EntregaApplication";
import { EntregaAdapter } from "../adapter/EntregaAdapter";
import { EntregaController } from "../controller/EntregaController";
import { Router } from "express";
import { authenticateToken } from "../web/authMiddleware";
import { LoteAdapter } from "../adapter/LoteAdapter";
import { RegistroAdapter } from "../adapter/RegistroAdapter";

const router = Router();

const entregaAdapter = new EntregaAdapter();
const loteAdapter = new LoteAdapter();
const userAdapter = new RegistroAdapter();
const entregaApp = new userEntrega(entregaAdapter, loteAdapter, userAdapter);
const entregaControlador = new EntregaController(entregaApp);

//mostrar lotes

router.get("/verLotesDisponibles", authenticateToken, async (req, res) => {
  await entregaControlador.getLotesDisponibles(req, res);
});

router.post("/crearEntrega", authenticateToken, async (req, res) => {
  await entregaControlador.createEntrega(req, res);
});

router.put("/actualizarEntrega/:id", authenticateToken, async (req, res) => {
  await entregaControlador.updateEntrega(req, res);
});

router.delete("/eliminarEntrega/:id", authenticateToken, async (req, res) => {
  try {
    await entregaControlador.deleteEntrega(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la entrega: ", error });
  }
});

router.put("/confirmarEntrega/:id", authenticateToken, async (req, res) => {
  return await entregaControlador.confirmedEntrega(req, res);
});

export default router;
