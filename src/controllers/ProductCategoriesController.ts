import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ProductCategory } from "../entity/ProductCategories";
import { PaginationServices } from "../services/PaginationServices";

const router = express.Router();

// Listar com paginação
router.get("/product-categories", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductCategory);
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
        res.status(500).json({ messagem: "Erro ao listar categorias!" });
        return;
    }
});

// Visualizar pelo id
router.get("/product-categories/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductCategory);
        const item = await repository.findOneBy({ id: parseInt(req.params.id as string) });

        if (!item) {
            res.status(404).json({ messagem: "Categoria não encontrada!" });
            return;
        }

        res.status(200).json(item);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ messagem: "Erro ao visualizar categoria!" });
        return;
    }
});

// Criar
router.post("/product-categories", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductCategory);
        const newItem = repository.create(req.body);
        await repository.save(newItem);

        res.status(201).json({
            messagem: "Categoria criada com sucesso!",
            productCategory: newItem,
        });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ messagem: "Erro ao criar categoria!" });
        return;
    }
});

// Editar
router.put("/product-categories/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductCategory);
        const item = await repository.findOneBy({ id: parseInt(req.params.id as string) });

        if (!item) {
            res.status(404).json({ messagem: "Categoria não encontrada!" });
            return;
        }

        repository.merge(item, req.body);
        const updated = await repository.save(item);

        res.status(200).json({
            messagem: "Categoria atualizada com sucesso!",
            productCategory: updated,
        });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ messagem: "Erro ao atualizar categoria!" });
        return;
    }
});

// Apagar
router.delete("/product-categories/:id", async (req: Request, res: Response) => {
    try {
        const repository = AppDataSource.getRepository(ProductCategory);
        const item = await repository.findOneBy({ id: parseInt(req.params.id as string) });

        if (!item) {
            res.status(404).json({ messagem: "Categoria não encontrada!" });
            return;
        }

        await repository.remove(item);

        res.status(200).json({ messagem: "Categoria removida com sucesso!" });
        return;
    } catch (error: any) {
        console.error(error);

        // Categoria ainda usada por algum produto (FK com RESTRICT)
        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            res.status(409).json({ messagem: "Categoria em uso por produtos, não pode ser removida!" });
            return;
        }

        res.status(500).json({ messagem: "Erro ao apagar categoria!" });
        return;
    }
});

export default router;