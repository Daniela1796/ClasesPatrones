import { Request, Response, NextFunction } from "express";
import { AuthApplication } from "../../application/AuthApplication";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ error: "Token requerido" });
  }

  try {
    const decoded = AuthApplication.verifyToken(token);
    console.log("decoded:", decoded);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};
