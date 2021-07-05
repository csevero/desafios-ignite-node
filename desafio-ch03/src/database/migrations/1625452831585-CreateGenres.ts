import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class CreateGenres1625452831585 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "genres",
        columns: [
          { name: "id", type: "uuid", isPrimary: true },
          { name: "name", type: "varchar" },
        ],
      })
    );

    
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("genres");
    await queryRunner.dropTable("genre_games");
  }
}
