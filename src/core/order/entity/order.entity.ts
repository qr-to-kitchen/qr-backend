import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Branch } from '../../branches/branches.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  CREADO = 'CREADO', COCINANDO = 'COCINANDO', LISTO = 'LISTO', CERRADO = 'CERRADO', ENTREGADO = 'ENTREGADO'
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  description: string;

  @Column()
  tableNumber: number;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  readyAt: Date;

  @ManyToOne(() => Branch)
  branch: Branch;

  @OneToMany(() => OrderItem, item => item.order, { cascade: true })
  items: OrderItem[];
}
