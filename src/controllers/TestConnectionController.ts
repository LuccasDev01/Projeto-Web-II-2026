// Importar a biblioteca express
import express, { Request, Response } from "express";

// Criar a Aplicação Express
const router = express.Router();

// Criar a rota GET de teste de conexão
router.get("/test-connection", (req: Request, res: Response) => {
    res.status(200).json({ message: "Conexão com API estabelecida com sucesso!!" });
    return;
});

// Exportar a instrução da rota
export default router;