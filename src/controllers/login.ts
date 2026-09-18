// Importar a biblioteca express;
import express, {Request, Response} from "express";

//Importar o arquivo com as credênciais do banco de dados
import { AppDataSource } from "../data-source";

// Criar a Aplicação Express 
const router = express.Router();

//Inicializar a conexão com o banco de dados
AppDataSource.initialize().then(() =>(
    console.log("Conexão com o banco de dados estabelecida com sucesso!")
)).catch((error: any) => (
    console.error("Erro ao conectar com o banco de dados: ", error)
))

// Criar a rota GET principal
router.get("/", (req: Request, res: Response) => {
    res.send("Bem vindo pessoal!! Tela de login na rota ");
});

//Exportar a imstrução da rota

export default router;