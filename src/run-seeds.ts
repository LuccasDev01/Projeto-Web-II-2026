import { AppDataSource } from "./data-source";
import CreateSituationsSeeds from "./seeds/CreateSituationsSeeds";

const runSeeds = async () => {

console.log("Iniciando o processo de execução dos seeds...")

await AppDataSource.initialize();

console.log("Conexão com o banco de dados estabelecida com sucesso!");

try {
    // Executa o método estático run da classe do Seed
    await CreateSituationsSeeds.run(AppDataSource);

} catch (error) {

console.error("Erro ao executar os seeds:", error);
   
}finally {

    await AppDataSource.destroy();
    console.log("Conexão com o banco de dados encerrada.");


}

}

runSeeds();