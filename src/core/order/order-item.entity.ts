import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { BranchDish } from '../branches-dishes/branches-dishes.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Order, order => order.items)
  order: Order;

  @ManyToOne(() => BranchDish)
  branchDish: BranchDish;
}
