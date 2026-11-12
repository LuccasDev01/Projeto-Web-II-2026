// Importar a biblioteca express;
import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Situation } from "../entity/Situations";
import { PaginationServices } from "../services/PaginationServices";
import * as yup from 'yup';
import { InstanceChecker,Not } from "typeorm";


// Criar a Aplicação Express 
const router = express.Router();

// Criar a lista
router.get("/situations", async (req: Request, res: Response) => {
    try {

        //Obter a repertório da entidade Situation
        const situationRepository = AppDataSource.getRepository(Situation);

        // Receber o número da pagina e definir 1 como padrão
        const page = parseInt(req.query.page as string) || 1;

        // Definir o limite de registros por página

        const limit = Number(req.query.limit) || 10;

        const result = await PaginationServices.paginate(situationRepository, page, limit, { id: "DESC" });

        //  Retornar a resposta com os dados e as informações de paginação
               res.status(200).json(result);
               return;


    } catch (error) {
        console.error(error);
        res.status(500).json({
            messagem: "Erro ao listar situações!",
        });
        return;
    }
});

// Visualizar uma situação pelo id
router.get("/situations/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const situationRepository = AppDataSource.getRepository(Situation);
        const situation = await situationRepository.findOneBy({ id: parseInt(id as string) });

        if (!situation) {
            res.status(404).json({
                messagem: "Situação não encontrada!",
            });
            return;
        }

        res.status(200).json(situation);
        return;

    } catch (error) {
        console.error(error);
        res.status(500).json({
            messagem: "Erro ao listar situação!",
        });
        return;
    }
});

// Cadastra item no banco de dados 
router.post("/situations", async (req: Request, res: Response) => {
    try {
        var data = req.body;

        const schema = yup.object().shape({
            nameSituation: yup.string()
            .required("O nome da situação é obrigatório!")
            .min(3, "O nome da situação deve ter no mínimo 3 caracteres!")
        });

        await schema.validate(data, { abortEarly: false });

        const situationRepository = AppDataSource.getRepository(Situation);

        const existingSituation = await situationRepository.findOne({ 
            where: { nameSituation: data.nameSituation }
      
        });

        if (existingSituation) {
    res.status(400).json({
        messagem: "Já existe uma situação com esse nome!",   
    });
    return;
}

        const newSituation = situationRepository.create(data);

        await situationRepository.save(newSituation);

        res.status(201).json({
            messagem: "Situação criada com sucesso!",
            situation: newSituation,
        });
        return;

    } catch (error: any) {
        console.error(error);

        if (error instanceof yup.ValidationError) {
    res.status(400).json({
        messagem: "Dados inválidos!",
        errors: error.errors,
    });
    return;
}

        // Violação de UNIQUE no MySQL
        if (error.code === "ER_DUP_ENTRY") {
            res.status(409).json({
                messagem: "Situação já existe!",
            });
            return;
        }

        res.status(500).json({
            messagem: "Erro ao visualizar situação!",
        });
        return;
    }
});

// Faz a atualização de uma situação pelo id
router.put("/situations/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        var data = req.body;

        const schema = yup.object().shape({
            nameSituation: yup.string()
            .required("O nome da situação é obrigatório!")
            .min(3, "O nome da situação deve ter no mínimo 3 caracteres!")
        });

        await schema.validate(data, { abortEarly: false });

        const situationRepository = AppDataSource.getRepository(Situation);


        const situation = await situationRepository.findOneBy({ id: parseInt(id as string) });

        if (!situation) {
            res.status(404).json({
                messagem: "Situação não encontrada!",
            });
            return;
        }

         const existingSituation = await situationRepository.findOne({ 
            where: { 
                nameSituation: data.nameSituation,
                id: Not(parseInt(id as string)),
            }
      
        });

        if (existingSituation) {
    res.status(400).json({
        messagem: "Já existe uma situação com esse nome!",   
    });
    return;
}
        //Atualiza os dados da situação com os novos dados recebidos
        situationRepository.merge(situation, data);
        
        //Salva as alterações de dados
        const updatedSituation = await situationRepository.save(situation);

        res.status(200).json({
            messagem: "Situação atualizada com sucesso!",
            situation: updatedSituation,
        });
        return;

    } catch (error) {
        if (error instanceof yup.ValidationError) {
    res.status(400).json({
        messagem: "Dados inválidos!",
        errors: error.errors,
    });
    return;
}
        console.error(error);
        res.status(500).json({
            messagem: "Erro ao atualizar situação!",
        });
    }
});

//remove o item cadastrado no banco de dados
router.delete("/situations/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;


        const situationRepository = AppDataSource.getRepository(Situation);
        const situation = await situationRepository.findOneBy({ id: parseInt(id as string) });

        if (!situation) {
            res.status(404).json({
                messagem: "Situação não encontrada!",
            });
            return;
        }
        //Remove os dados no banco de dados
        await situationRepository.remove(situation);
        

        res.status(200).json({
            messagem: "Situação removida com sucesso!",
        });
        return;

    } catch (error) {
        console.error(error);
        res.status(500).json({
            messagem: "Erro ao atualizar situação!",
        });
        return;
    }
});

//Exportar a instrução da rota
export default router;