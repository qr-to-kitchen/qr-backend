import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Restaurant } from '../../restaurants/restaurants.entity';
import { ExtraBranch } from './extras-branches.entity';

@Entity()
export class Extra {
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

  @ManyToOne(() => Restaurant)
  restaurant: Restaurant;

  @OneToMany(() => ExtraBranch, extraBranch => extraBranch.extra)
  extraBranch: ExtraBranch[];
}
