import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Restaurant } from '../restaurants/restaurants.entity';
import { Branch } from '../branchs/branches.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  role: 'ADMIN' | 'BRANCH';

  @OneToOne(() => Restaurant, (restaurant) => restaurant.user, { nullable: true })
  restaurant: Restaurant;

  @OneToOne(() => Branch, (branch) => branch.user, { nullable: true })
  branch: Branch;
}