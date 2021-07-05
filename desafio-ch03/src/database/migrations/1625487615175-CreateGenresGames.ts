import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateGenresGames1625487615175 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "genre_games",
        columns: [
          { name: "gamesId", type: "uuid", isPrimary: true },
          { name: "genresId", type: "uuid", isPrimary: true },
        ],
        foreignKeys: [
          {
            name: "fk_gamesId",
            columnNames: ["gamesId"],
            referencedColumnNames: ["id"],
            referencedTableName: "games",
          },
          {
            name: "fk_genresId",
            columnNames: ["genresId"],
            referencedColumnNames: ["id"],
            referencedTableName: "genres",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("genre_games");
  }
}
