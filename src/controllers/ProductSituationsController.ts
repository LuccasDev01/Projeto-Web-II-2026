import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ProductSituation } from "../entity/ProductSituations";
import { PaginationServices } from "../services/PaginationServices";

const router = express.Router();

// Listar com paginação
router.get("/product-situations", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductSituation);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await PaginationServices.paginate(repository, page, limit, { id: "DESC" });

        res.status(200).json(result);
        return;
    } catch (error) {
        if (error instanceof Error && error.message.startsWith("Página inválida")) {
            res.status(400).json({ messagem: error.message });
            return;
        }
        console.error(error);
        res.status(500).json({ messagem: "Erro ao listar situações de produto!" });
        return;
    }
});

// Visualizar pelo id
router.get("/product-situations/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductSituation);
        const item = await repository.findOneBy({ id: parseInt(req.params.id as string) });

        if (!item) {
            res.status(404).json({ messagem: "Situação de produto não encontrada!" });
            return;
        }

        res.status(200).json(item);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ messagem: "Erro ao visualizar situação de produto!" });
        return;
    }
});

// Criar
router.post("/product-situations", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductSituation);
        const newItem = repository.create(req.body);
        await repository.save(newItem);

        res.status(201).json({
            messagem: "Situação de produto criada com sucesso!",
            productSituation: newItem,
        });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ messagem: "Erro ao criar situação de produto!" });
        return;
    }
});

// Editar
router.put("/product-situations/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductSituation);
        const item = await repository.findOneBy({ id: parseInt(req.params.id as string) });

        if (!item) {
            res.status(404).json({ messagem: "Situação de produto não encontrada!" });
            return;
        }

        repository.merge(item, req.body);
        const updated = await repository.save(item);

        res.status(200).json({
            messagem: "Situação de produto atualizada com sucesso!",
            productSituation: updated,
        });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ messagem: "Erro ao atualizar situação de produto!" });
        return;
    }
});

// Apagar
router.delete("/product-situations/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductSituation);
        const item = await repository.findOneBy({ id: parseInt(req.params.id as string) });

        if (!item) {
            res.status(404).json({ messagem: "Situação de produto não encontrada!" });
            return;
        }

        await repository.remove(item);

        res.status(200).json({ messagem: "Situação de produto removida com sucesso!" });
        return;
    } catch (error: any) {
        console.error(error);

        // Situação ainda usada por algum produto (FK com RESTRICT)
        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            res.status(409).json({ messagem: "Situação em uso por produtos, não pode ser removida!" });
            return;
        }

        res.status(500).json({ messagem: "Erro ao apagar situação de produto!" });
        return;
    }
});

export default router;