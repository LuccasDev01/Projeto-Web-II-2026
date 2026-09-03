// Importar biblioteca express
import express, {Request, Response} from "express";

// Criar a Aplicação Express 
const router = express.Router();

// Criar a rota GET principal
router.get("/", (req: Request, res: Response) => {
    res.send("Bem vindo pessoal!! Tela de login na rota ");
});

//Exportar a imstrução da rota

export default router;