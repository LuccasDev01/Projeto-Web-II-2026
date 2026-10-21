import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Products";
import { PaginationServices } from "../services/PaginationServices";

const router = express.Router();

// Listar com paginação
router.get("/products", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(Product);
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
        res.status(500).json({ messagem: "Erro ao listar produtos!" });
        return;
    }
});

// Visualizar pelo id, já com a situação e a categoria do produto
router.get("/products/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(Product);
        const item = await repository.findOne({
            where: { id: parseInt(req.params.id as string) },
           relations: { productSituation: true, productCategory: true },
        });

        if (!item) {
            res.status(404).json({ messagem: "Produto não encontrado!" });
            return;
        }

        res.status(200).json(item);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ messagem: "Erro ao visualizar produto!" });
        return;
    }
});

// Criar
router.post("/products", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(Product);
        const newItem = repository.create(req.body);
        await repository.save(newItem);

        res.status(201).json({
            messagem: "Produto criado com sucesso!",
            product: newItem,
        });
        return;
    } catch (error: any) {
        console.error(error);

        // productSituationId ou productCategoryId que não existe
        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            res.status(400).json({ messagem: "Situação ou categoria do produto não existe!" });
            return;
        }

        res.status(500).json({ messagem: "Erro ao criar produto!" });
        return;
    }
});

// Editar
router.put("/products/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(Product);
        const item = await repository.findOneBy({ id: parseInt(req.params.id as string) });

        if (!item) {
            res.status(404).json({ messagem: "Produto não encontrado!" });
            return;
        }

        repository.merge(item, req.body);
        const updated = await repository.save(item);

        res.status(200).json({
            messagem: "Produto atualizado com sucesso!",
            product: updated,
        });
        return;
    } catch (error: any) {
        console.error(error);

        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            res.status(400).json({ messagem: "Situação ou categoria do produto não existe!" });
            return;
        }

        res.status(500).json({ messagem: "Erro ao atualizar produto!" });
        return;
    }
});

// Apagar
router.delete("/products/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(Product);
        const item = await repository.findOneBy({ id: parseInt(req.params.id as string) });

        if (!item) {
            res.status(404).json({ messagem: "Produto não encontrado!" });
            return;
        }

        await repository.remove(item);

        res.status(200).json({ messagem: "Produto removido com sucesso!" });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ messagem: "Erro ao apagar produto!" });
        return;
    }
});

export default router;