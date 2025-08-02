import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from '../order/entity/order-item.entity';
import { Order } from '../order/entity/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItem, Order])
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService]
})
export class StatisticsModule {}