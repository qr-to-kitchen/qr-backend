import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { BranchDish } from '../../branches-dishes/branches-dishes.entity';
import { OrderItemExtra } from './order-item-extra.entity';

export enum OrderStatusItem {
  CREADO = 'CREADO', COCINANDO = 'COCINANDO', LISTO = 'LISTO', ENTREGADO = 'ENTREGADO'
}

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ nullable: true })
  comment: string;

  @Column({ type: 'enum', enum: OrderStatusItem })
  status: OrderStatusItem;

  @ManyToOne(() => Order)
  order: Order;

  @ManyToOne(() => BranchDish)
  branchDish: BranchDish;

  @OneToMany(() => OrderItemExtra, itemExtra => itemExtra.orderItem, { cascade: true })
  itemExtras: OrderItemExtra[];
}
