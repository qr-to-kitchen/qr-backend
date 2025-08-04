import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { ExtraBranchDish } from '../../extras/entities/extras-branch-dish.entity';

@Entity()
export class OrderItemExtra {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderItem)
  orderItem: OrderItem;

  @ManyToOne(() => ExtraBranchDish)
  extraBranchDish: ExtraBranchDish;
}
