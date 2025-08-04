import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Branch } from '../../branches/branches.entity';
import { ExtraBranchDish } from './extras-branch-dish.entity';

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

  @ManyToOne(() => Branch)
  branch: Branch;

  @OneToMany(() => ExtraBranchDish, extraBranchDishes => extraBranchDishes.extra)
  extraBranchDishes: ExtraBranchDish[];
}
