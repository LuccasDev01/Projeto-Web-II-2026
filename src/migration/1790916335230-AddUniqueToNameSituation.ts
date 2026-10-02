import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class AddUniqueToNameSituation1790916335230 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createIndex(
            "situations",
            new TableIndex({
                name: "UQ_nameSituation",
                columnNames: ["nameSituation"],
                isUnique: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex("situations", "UQ_nameSituation");
    }
}