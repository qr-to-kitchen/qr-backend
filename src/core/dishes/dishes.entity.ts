import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Restaurant } from '../restaurants/restaurants.entity';
import { BranchDish } from '../branches-dishes/branches-dishes.entity';
import { Category } from '../categories/categories.entity';

@Entity()
export class Dish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  basePrice: number;

  @Column()
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Restaurant)
  restaurant: Restaurant;

  @ManyToOne(() => Category)
  category: Category;

  @OneToMany(() => BranchDish, (branchDish) => branchDish.dish)
  branchDishes: BranchDish[];
}
