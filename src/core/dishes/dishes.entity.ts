import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Restaurant } from '../restaurants/restaurants.entity';
import { BranchDish } from '../branches-dishes/branches-dishes.entity';

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

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.dishes)
  restaurant: Restaurant;

  @OneToMany(() => BranchDish, (branchDish) => branchDish.dish)
  branchDishes: BranchDish[];
}
