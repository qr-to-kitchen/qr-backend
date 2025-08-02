import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Branch } from '../branches/branches.entity';
import { Dish } from '../dishes/dishes.entity';

@Entity()
export class BranchDish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  customPrice: number;

  @Column()
  isAvailable: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Branch, (branch) => branch.branchDishes)
  branch: Branch;

  @ManyToOne(() => Dish, (dish) => dish.branchDishes)
  dish: Dish;
}
