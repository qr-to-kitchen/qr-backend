import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BranchDish } from '../../branches-dishes/branches-dishes.entity';
import { ExtraBranch } from './extras-branches.entity';

@Entity()
export class ExtraBranchDish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isAvailable: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => ExtraBranch)
  extraBranch: ExtraBranch;

  @ManyToOne(() => BranchDish)
  branchDish: BranchDish;
}
