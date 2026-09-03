// Importar biblioteca express
import express from "express";

// Criar a Aplicação Express 
const app = express();

//Incluir os controllers
import login from "./controllers/login";

//Criar as rotas
app.use("/", login);

//Iniciar o servidor na porta 3000
app.listen(8080, () => {
    console.log("Servidor inciado na porta 8080:http://localhost:8080");
});