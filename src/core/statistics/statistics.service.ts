import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { OrderItem } from '../order/entity/order-item.entity';
import { MostOrderedDishDto } from './dto/most-ordered-dishes.dto';
import { Order } from '../order/entity/order.entity';

@Injectable()
export class StatisticsService {

  constructor(
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>
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
      throw new NotFoundException({
        message: ['Estadística sin datos.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return result.map(item => ({
      dishName: item.dishName,
      dishDescription: item.dishDescription,
      totalOrdered: parseInt(item.totalOrdered)
    }));
  }

  async getOrdersByBranchAndDateRange(branchId: number, startDate: Date, endDate: Date) {
    const orders = await this.orderRepository.find({
      where: { branch: { id: branchId }, createdAt: Between(startDate, endDate) },
      relations: ['branch', 'items', 'items.branchDish', 'items.branchDish.dish'],
      order: { createdAt: 'DESC' }
    });

    if (!orders?.length) {
      throw new NotFoundException({
        message: ['Estadística sin datos.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return orders;
  }
}