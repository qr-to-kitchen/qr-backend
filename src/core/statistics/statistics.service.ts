import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { MostOrderedDishDto } from './dto/most-ordered-dishes.dto';
import { Order } from '../order/entity/order.entity';

@Injectable()
export class StatisticsService {

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>
  ) {}

  async getMostOrderedDishesByBranchAndDateRange(branchId: number, startDate: Date, endDate: Date): Promise<MostOrderedDishDto[]> {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items','orderItem')
      .leftJoinAndSelect('orderItem.branchDish', 'branchDish')
      .leftJoinAndSelect('branchDish.dish', 'dish')
      .select([
        'dish.id as dishId',
        'dish.name as dishName',
        'dish.description as dishDescription',
        'SUM(orderItem.quantity) as totalOrdered'
      ])
      .where('branchDish.branchId = :branchId', { branchId })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
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