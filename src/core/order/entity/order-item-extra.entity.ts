import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { ExtraBranchDish } from '../../extras/entities/extras-branch-dish.entity';

@Entity()
export class OrderItemExtra {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @ManyToOne(() => OrderItem)
  orderItem: OrderItem;

  @ManyToOne(() => ExtraBranchDish)
  extraBranchDish: ExtraBranchDish;
}
