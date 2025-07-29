import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/users.entity';
import { Branch } from '../branchs/branches.entity';
import { Dish } from '../dishes/dishes.entity';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => User, (user) => user.restaurant)
  @JoinColumn()
  user: User;

  @OneToMany(() => Branch, (branch) => branch.restaurant)
  branches: Branch[];

  @OneToMany(() => Dish, (dish) => dish.restaurant)
  dishes: Dish[];
}