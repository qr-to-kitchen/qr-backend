import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../order/entity/order-item.entity';
import { MostOrderedDishDto } from './dto/most-ordered-dishes.dto';

@Injectable()
export class StatisticsService {

  constructor(
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>
  ) {}

  async getMostOrderedDishes(branchId: number): Promise<MostOrderedDishDto[]> {
    const result = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .leftJoinAndSelect('orderItem.branchDish', 'branchDish')
      .leftJoinAndSelect('branchDish.dish', 'dish')
      .select([
        'dish.id as dishId',
        'dish.name as dishName',
        'dish.description as dishDescription',
        'SUM(orderItem.quantity) as totalOrdered'
      ])
      .where('branchDish.branchId = :branchId', { branchId })
      .groupBy('dish.id')
      .orderBy('totalOrdered', 'DESC')
      .getRawMany();

    if (!result?.length) {
      return [];
    }

    return result.map(item => ({
      dishName: item.dishName,
      dishDescription: item.dishDescription,
      totalOrdered: parseInt(item.totalOrdered)
    }));
  }
}