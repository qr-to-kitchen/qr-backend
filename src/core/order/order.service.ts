import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from './entity/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entity/order-item.entity';
import { Branch } from '../branches/branches.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { BranchDish } from '../branches-dishes/branches-dishes.entity';
import { ExtraBranchDish } from '../extras/entities/extras-branch-dish.entity';

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
    private branchRepository: Repository<Branch>,
    @InjectRepository(ExtraBranchDish)
    private extraBranchDishRepository: Repository<ExtraBranchDish>
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

    for (const itemDto of createOrderDto.items) {
      const branchDish = await this.branchDishRepository.findOne({
        where: { id: itemDto.branchDishId },
        relations: ['dish']
      });
      if (!branchDish) {
        throw new NotFoundException({
          message: [`Plato con ID ${itemDto.branchDishId} no encontrado`],
          error: "Bad Request",
          statusCode: 404
        });
      }

      itemDto.unitPrice = branchDish.customPrice || branchDish.dish.basePrice;

      if (itemDto.extraBranchDishIds?.length) {
        for (const extraBranchDishId of itemDto.extraBranchDishIds) {
          const extraBranchDish = await this.extraBranchDishRepository.findOne({
            where: { id: extraBranchDishId }
          });
          if (!extraBranchDish) {
            throw new NotFoundException({
              message: [`Extra en Plato en Sede con ID ${extraBranchDishId} no encontrado`],
              error: "Bad Request",
              statusCode: 404
            });
          }
        }
      }
    }

    const order = this.orderRepository.create({
      description: createOrderDto.description,
      tableNumber: createOrderDto.tableNumber,
      status: createOrderDto.status,
      branch: branch,
      items: createOrderDto.items.map(itemDto => ({
        quantity: itemDto.quantity,
        unitPrice: itemDto.unitPrice,
        branchDish: { id: itemDto.branchDishId },
        itemExtras: (itemDto.extraBranchDishIds ?? []).map(extraBranchDishId => ({
          extraBranchDish: { id: extraBranchDishId }
        }))
      }))
    });

    const savedOrder = await this.orderRepository.save(order);

    return this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: [
        'branch',
        'items',
        'items.branchDish',
        'items.branchDish.dish',
        'items.itemExtras',
        'items.itemExtras.extraBranchDish',
        'items.itemExtras.extraBranchDish.extra'
      ]
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
      where: { id: createOrderItemDto.branchDishId },
      relations: ['dish']
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
      unitPrice: branchDish.customPrice || branchDish.dish.basePrice,
      order: order,
      branchDish: branchDish
    });

    await this.orderItemRepository.save(orderItem);

    return this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['branch', 'items', 'items.branchDish', 'items.branchDish.dish']
    });
  }

  async findByBranchId(branchId: number) {
    const orders = await this.orderRepository.find({
      where: { branch: { id: branchId } },
      relations: ['items', 'items.branchDish', 'items.branchDish.dish']
    });
    if (!orders.length) {
      throw new NotFoundException({
        message: ['Órdenes no encontradas.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return orders;
  }

  async findByRestaurantId(restaurantId: number) {
    const orders = await this.orderRepository.find({
      where: { branch: { restaurant: { id: restaurantId } } },
      relations: ['branch', 'items', 'items.branchDish', 'items.branchDish.dish']
    });
    if (!orders.length) {
      throw new NotFoundException({
        message: ['Órdenes no encontradas.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return orders;
  }

  async findByStatusAndBranchId(status: OrderStatus, branchId: number) {
    const orders = await this.orderRepository.find({
      where: { branch: { id: branchId }, status: status },
      relations: ['branch', 'items', 'items.branchDish', 'items.branchDish.dish']
    });
    if (!orders.length) {
      throw new NotFoundException({
        message: ['Órdenes no encontradas.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return orders;
  }

  async findById(id: number) {
    const order =  await this.orderRepository.findOne({
      where: { id },
      relations: ['branch', 'items', 'items.branchDish', 'items.branchDish.dish']
    });
    if (!order) {
      throw new NotFoundException({
        message: ['Orden no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return order;
  }

  async updateStatusById(id: number, status: OrderStatus) {
    const order = await this.orderRepository.findOneBy({
      id
    });
    if (!order) {
      throw new NotFoundException({
        message: ['Orden no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    if (status.toString() === OrderStatus.LISTO) {
      await this.orderRepository.update(id, { status: status, readyAt: new Date() });
    } else {
      await this.orderRepository.update(id, { status });
    }

    return this.orderRepository.findOneBy({ id });
  }
}
