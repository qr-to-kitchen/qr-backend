import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Branch } from '../branches/branches.entity';
import { Dish } from '../dishes/dishes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Branch, Dish])
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
