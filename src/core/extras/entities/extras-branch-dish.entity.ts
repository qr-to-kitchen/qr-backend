import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { BranchDish } from '../../branches-dishes/branches-dishes.entity';
import { Extra } from './extras.entity';

@Entity()
export class ExtraBranchDish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Extra)
  extra: Extra;

  @ManyToOne(() => BranchDish)
  branchDish: BranchDish;
}
