import {  DataSource  } from "typeorm"
import { Situation } from "../entity/Situations"

export default class CreateSituationsSeeds {

public static async run(dataSource: DataSource): Promise<void> {

    console.log("Iniciando o seed para a tabela 'Situations'...");

    const situationRepository = dataSource.getRepository(Situation);

    const existingSituations = await situationRepository.count();

    if (existingSituations > 0) {
    console.log(`A tabela 'Situations' já possui dados. Nenhum seed será executado.`);
    return;
    }

    const situationsData = [

     {nameSituation: "Ativo"},
     {nameSituation: "Inativo"},
     {nameSituation: "Pendente"},


    ]

    await situationRepository.save(situationsData);
    
    console.log(`Seed para a tabela 'Situations' concluído com sucesso!`);

 }

}