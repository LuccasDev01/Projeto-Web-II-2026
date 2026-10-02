import { MigrationInterface, QueryRunner, TableUnique } from "typeorm";

export class AddUniqueToNameSituationXXXXXXXXXXXXX implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createUniqueConstraint(
            "situations",
            new TableUnique({
                columnNames: ["nameSituation"],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("situations");
        const uniqueConstraint = table?.uniques.find((uq) =>
            uq.columnNames.includes("nameSituation")
        );
        if (uniqueConstraint) {
            await queryRunner.dropUniqueConstraint("situations", uniqueConstraint);
        }
    }
}