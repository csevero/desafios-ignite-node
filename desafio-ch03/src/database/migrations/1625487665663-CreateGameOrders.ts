import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateGameOrders1625487665663 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "games_orders",
        columns: [
          { name: "orderId", type: "uuid", isPrimary: true },
          { name: "gamesId", type: "uuid", isPrimary: true },
        ],
        foreignKeys: [
          {
            columnNames: ["orderId"],
            referencedTableName: "orders",
            referencedColumnNames: ["id"],
          },
          {
            columnNames: ["gamesId"],
            referencedTableName: "games",
            referencedColumnNames: ["id"],
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("games_orders");
  }
}
