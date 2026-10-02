// Importar biblioteca express
import express from "express";

//Importar variáveis de ambiente
import dotenv from "dotenv";

//Carregar as variáveis de ambiente do arquivo .env
dotenv.config();

// Importar a conexão com o banco de dados
import { AppDataSource } from "./data-source";

// Criar a Aplicação Express 
const app = express();

// Criar um middleware para receber os dados no corpo da requisição
app.use(express.json());

//Incluir os controllers
import AuthController from "./controllers/AuthController";
import SituationsController from "./controllers/SituationsController";

//Criar as rotas
app.use("/", AuthController);
app.use("/", SituationsController);

//Inicializar a conexão com o banco de dados
AppDataSource.initialize().then(() => {
    console.log("Conexão com o banco de dados estabelecida com sucesso!");

    //Iniciar o servidor só depois que o banco conectar
    app.listen(process.env.PORT, () => {
        console.log(`Servidor iniciado na porta ${process.env.PORT}:http://localhost:${process.env.PORT}`);
    });
}).catch((error) => {
    console.error("Erro ao conectar com o banco de dados: ", error);
});