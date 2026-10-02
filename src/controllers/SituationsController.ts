// Importar a biblioteca express;
import express, {Request, Response} from "express";
import { AppDataSource } from "../data-source";
import { Situation } from "../entity/Situations";

// Criar a Aplicação Express 
const router = express.Router();

// Criar a rota GET principal
router.get("/situations", (req: Request, res: Response) => {
    res.send("Bem vindo pessoal!! Tela de situations na rota ");
});

// Criar a rota POST 
router.post("/situations", async (req: Request, res: Response) => {

    try {
        var data = req.body;

        const situationRepository = AppDataSource.getRepository(Situation);
        const newSituation = situationRepository.create(data);

        await situationRepository.save(newSituation);

        res.status(201).json({
            messagem: "Situação criada com sucesso!",
            situation: newSituation,
        });

    } catch (error: any) {
        console.error(error);

        // Verifica se o erro é de duplicidade (violação de UNIQUE no MySQL)
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                messagem: "Essa situação já existe!",
            });
        }

        res.status(500).json({
            messagem: "Erro ao criar situação!",
        });
    }

});

//Exportar a instrução da rota

export default router;