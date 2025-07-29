import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @ManyToOne(() => Branch, (branch) => branch.branchDishes)
  branch: Branch;

  @ManyToOne(() => Dish, (dish) => dish.branchDishes)
  dish: Dish;
}
