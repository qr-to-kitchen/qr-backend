import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';
import { Branch } from '../branches/branches.entity';
import { BranchDish } from '../branches-dishes/branches-dishes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Branch, BranchDish])
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
