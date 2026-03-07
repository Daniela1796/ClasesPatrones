import { IncentivoApplication } from "../../application/IncentivoApplication";
import { IncentivoAdapter } from "../adapter/IncentivoAdapter";
import { IncentivoController } from "../controller/IncentivoController";
import { Router } from "express";
import { authenticateToken } from "../web/authMiddleware";
import { LoteAdapter } from "../adapter/LoteAdapter";
import { RegistroAdapter } from "../adapter/RegistroAdapter";

const router = Router();

const incentivoAdapter = new IncentivoAdapter();
const loteAdapter = new LoteAdapter();
const userAdapter = new RegistroAdapter();
const incentivoApp = new IncentivoApplication(
  incentivoAdapter,
  loteAdapter,
  userAdapter,
);
const incentivoController = new IncentivoController(incentivoApp);

router.get("/verIncentivos", authenticateToken, async (req, res) => {
  await incentivoController.getLotesEmpresa(req, res);
});

router.post("/crearIncentivo", authenticateToken, async (req, res) => {
  await incentivoController.createIncentivo(req, res);
});

router.put("/actualizarIncentivo/:id", authenticateToken, async (req, res) => {
  await incentivoController.updateIncentivo(req, res);
});

router.put("/confirmarIncentivo", authenticateToken, async (req, res) => {
  await incentivoController.confirmarIncentivo(req, res);
});

router.delete("/eliminarIncentivo", authenticateToken, async (req, res) => {
  try {
    await incentivoController.deleteIncentivo(req, res);
  } catch (error) {
    res.status(500).json({ message: "Erro al eliminar el incentivo: ", error });
  }
});

export default router;
