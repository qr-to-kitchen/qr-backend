import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { MostOrderedDishDto } from './dto/most-ordered-dishes.dto';
import { Order, OrderStatus } from '../order/entity/order.entity';
import { DishesIncomeDishesDto } from './dto/dishes-income-dishes.dto';
import { AveragePreparationTimeDto } from './dto/average-preparation-time.dto';

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

  async getDishesIncomeByBranchAndDateRange(branchId: number, startDate: Date, endDate: Date): Promise<DishesIncomeDishesDto[]> {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items','orderItem')
      .leftJoinAndSelect('orderItem.branchDish', 'branchDish')
      .leftJoinAndSelect('branchDish.dish', 'dish')
      .select([
        'dish.id as dishId',
        'dish.name as dishName',
        'dish.description as dishDescription',
        'SUM(orderItem.unitPrice * orderItem.quantity) as totalIncome'
      ])
      .where('branchDish.branchId = :branchId', { branchId })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('dish.id')
      .orderBy('totalIncome', 'DESC')
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
      totalIncome: parseFloat(item.totalIncome)
    }));
  }

  async getAveragePreparationTimeByBranchAndDateRange(branchId: number, startDate: Date, endDate: Date): Promise<AveragePreparationTimeDto> {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.branchId = :branchId', { branchId })
      .andWhere('order.status = :status', { status: OrderStatus.LISTO })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .andWhere('order.readyAt IS NOT NULL')
      .getMany();

    if (!result?.length) {
      throw new NotFoundException({
        message: ['Estadística sin datos.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    const totalMinutes = result.reduce((sum, order) => {
      const preparationTime = order.readyAt.getTime() - order.createdAt.getTime();
      return sum + (preparationTime / (1000 * 60));
    }, 0);

    const averageTimeInMinutes = Math.round(totalMinutes / result.length);

    return {
      averageTimeInMinutes: averageTimeInMinutes,
      averageTimeFormatted: `${Math.floor(averageTimeInMinutes / 60)}h ${averageTimeInMinutes % 60}m`,
      totalOrders: result.length
    };
  }
}