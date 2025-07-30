import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Branch } from '../branches/branches.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { BranchDish } from '../branches-dishes/branches-dishes.entity';

@Injectable()
export class OrderService {

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(BranchDish)
    private branchDishRepository: Repository<BranchDish>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const branch = await this.branchRepository.findOne({
      where: { id: createOrderDto.branchId }
    });

    if (!branch) {
      throw new NotFoundException({
        message: ['Sede no encontrada.'],
        error: "Bad Request",
        statusCode: 404
      });
    }

    const order = this.orderRepository.create({
      status: createOrderDto.status,
      branch: branch
    });

    const savedOrder = await this.orderRepository.save(order);

    await Promise.all(
      createOrderDto.items.map(async (itemDto) => {
        const branchDish = await this.branchDishRepository.findOne({
          where: { id: itemDto.branchDishId }
        });
        if (!branchDish) {
          throw new NotFoundException({
            message: [`Plato con ID ${itemDto.branchDishId} no encontrado`],
            error: "Bad Request",
            statusCode: 404
          });
        }

        const orderItem = this.orderItemRepository.create({
          quantity: itemDto.quantity,
          order: savedOrder,
          branchDish: branchDish
        });

        return await this.orderItemRepository.save(orderItem);
      })
    );

    return this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['branch', 'items', 'items.branchDish', 'items.branchDish.dish']
    });
  }

  async addItemToOrder(orderId: number, createOrderItemDto: CreateOrderItemDto) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId }
    });

    if (!order) {
      throw new NotFoundException({
        message: [`Orden con ID ${orderId} no encontrada`],
        error: "Bad Request",
        statusCode: 404
      });
    }

    const branchDish = await this.branchDishRepository.findOne({
      where: { id: createOrderItemDto.branchDishId }
    });

    if (!branchDish) {
      throw new NotFoundException({
        message: [`Plato con ID ${createOrderItemDto.branchDishId} no encontrado`],
        error: "Bad Request",
        statusCode: 404
      });
    }

    const orderItem = this.orderItemRepository.create({
      quantity: createOrderItemDto.quantity,
      order: order,
      branchDish: branchDish
    });

    await this.orderItemRepository.save(orderItem);

    return this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['branch', 'items', 'items.branchDish', 'items.branchDish.dish']
    });
  }

  getOrderById(id: number) {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['branch', 'items', 'items.branchDish', 'items.branchDish.dish']
    })
  }
}
