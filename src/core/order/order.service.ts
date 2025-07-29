import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Dish } from '../dishes/dishes.entity';
import { Branch } from '../branches/branches.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
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
        const dish = await this.dishRepository.findOne({
          where: { id: itemDto.dishId }
        });
        if (!dish) {
          throw new NotFoundException({
            message: [`Plato con ID ${itemDto.dishId} no encontrado`],
            error: "Bad Request",
            statusCode: 404
          });
        }

        const orderItem = this.orderItemRepository.create({
          quantity: itemDto.quantity,
          order: savedOrder,
          dish: dish
        });

        return await this.orderItemRepository.save(orderItem);
      })
    );

    return this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['branch', 'items', 'items.dish']
    });
  }
}
