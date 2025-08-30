import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/entity/users.entity';
import { Restaurant } from '../restaurants/restaurants.entity';
import { BranchDish } from '../branches-dishes/branches-dishes.entity';

@Entity()
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column({ nullable: true })
  dailyCode: string;

  @Column({ nullable: true })
  dailyCodeUpdatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => User, (user) => user.branch)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.branches)
  restaurant: Restaurant;

  @OneToMany(() => BranchDish, (branchDish) => branchDish.branch)
  branchDishes: BranchDish[];
}