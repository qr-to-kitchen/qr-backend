import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { BranchDish } from '../../branches-dishes/branches-dishes.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @ManyToOne(() => Order)
  order: Order;

  @ManyToOne(() => BranchDish)
  branchDish: BranchDish;
}
