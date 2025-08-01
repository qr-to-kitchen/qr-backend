import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/entity/users.entity';
import { Branch } from '../branches/branches.entity';
import { Dish } from '../dishes/dishes.entity';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => User, (user) => user.restaurant)
  @JoinColumn()
  user: User;

  @OneToMany(() => Branch, (branch) => branch.restaurant)
  branches: Branch[];

  @OneToMany(() => Dish, (dish) => dish.restaurant)
  dishes: Dish[];
}