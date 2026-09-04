// Importar biblioteca express
import express from "express";

//Importar variáveis de ambiente
import dotenv from "dotenv";

//Carregar as variáveis de ambiente do arquivo .env
dotenv.config();

// Criar a Aplicação Express 
const app = express();

//Incluir os controllers
import login from "./controllers/login";

//Criar as rotas
app.use("/", login);

//Iniciar o servidor na porta 3000
app.listen(process.env.PORT, () => {
    console.log(`Servidor inciado na porta ${process.env.PORT}:http://localhost:${process.env.PORT}`);
});