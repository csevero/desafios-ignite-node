import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Game } from "../../games/entities/Game";
import { User } from "../../users/entities/User";

@Entity("orders")
class Order {
  @PrimaryColumn()
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToMany(() => Game)
  games: Game[];

  @CreateDateColumn()
  created_at: Date;
}

export { Order };
