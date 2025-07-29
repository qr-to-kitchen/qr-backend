import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/users.entity';
import { Restaurant } from '../restaurants/restaurants.entity';
import { BranchDish } from '../branches-dishes/branches-dishes.entity';

@Entity()
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @OneToOne(() => User, (user) => user.branch)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.branches)
  restaurant: Restaurant;

  @OneToMany(() => BranchDish, (branchDish) => branchDish.branch)
  branchDishes: BranchDish[];
}