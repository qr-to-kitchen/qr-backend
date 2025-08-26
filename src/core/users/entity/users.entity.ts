import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Restaurant } from '../../restaurants/restaurants.entity';
import { Branch } from '../../branches/branches.entity';

export enum UserRole {
  ADMIN = 'ADMIN', BRANCH = 'BRANCH'
}

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

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ default: 0 })
  tokenVersion: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => Restaurant, (restaurant) => restaurant.user)
  restaurant: Restaurant;

  @OneToOne(() => Branch, (branch) => branch.user)
  branch: Branch;
}