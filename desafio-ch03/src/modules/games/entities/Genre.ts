import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";
import { Game } from "./Game";

@Entity("genres")
class Genre {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Game, (game) => game.genres)
  games: Game[];
}

export { Genre };
