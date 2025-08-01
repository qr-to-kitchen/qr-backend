import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Restaurant } from '../restaurants/restaurants.entity';

@Entity()
export class Configuration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  primaryColor: string;

  @Column()
  primaryFont: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => Restaurant)
  @JoinColumn()
  restaurant: Restaurant;
}