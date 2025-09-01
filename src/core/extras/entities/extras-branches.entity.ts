import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Branch } from '../../branches/branches.entity';
import { Extra } from './extras.entity';
import { ExtraBranchDish } from './extras-branch-dish.entity';

@Entity()
export class ExtraBranch {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Branch)
  branch: Branch;

  @ManyToOne(() => Extra, (extra) => extra.extraBranches)
  extra: Extra;

  @OneToMany(() => ExtraBranchDish, extraBranchDishes => extraBranchDishes.extraBranch)
  extraBranchDishes: ExtraBranchDish[];
}
