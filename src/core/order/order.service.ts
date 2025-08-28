import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from './entity/order.entity';
import { Between, In, Repository } from 'typeorm';
import { OrderItem } from './entity/order-item.entity';
import { Branch } from '../branches/branches.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { BranchDish } from '../branches-dishes/branches-dishes.entity';
import { ExtraBranchDish } from '../extras/entities/extras-branch-dish.entity';
import { GetOrdersByFilterDto } from './dto/get-orders-by-filter.dto';

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
        itemDto.extraUnitPrices = {};
        for (const extraBranchDishId of itemDto.extraBranchDishIds) {
          const extraBranchDish = await this.extraBranchDishRepository.findOne({
            where: { id: extraBranchDishId },
            relations: ['extraBranch.extra']
          });
          if (!extraBranchDish) {
            throw new NotFoundException({
              message: [`Extra en Plato en Sede con ID ${extraBranchDishId} no encontrado`],
              error: "Bad Request",
              statusCode: 404
            });
          }

          const extraUnitPrice = extraBranchDish.customPrice || extraBranchDish.extraBranch.extra.basePrice;

          itemDto.unitPrice = itemDto.unitPrice + extraUnitPrice;
          itemDto.extraUnitPrices[extraBranchDishId] = extraUnitPrice;
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
        comment: itemDto.comment,
        branchDish: { id: itemDto.branchDishId },
        itemExtras: (itemDto.extraBranchDishIds ?? []).map(extraBranchDishId => ({
          extraBranchDish: { id: extraBranchDishId },
          unitPrice: itemDto.extraUnitPrices?.[extraBranchDishId]
        }))
      }))
    });

    const savedOrder = await this.orderRepository.save(order);

    const orderCreated = await this.orderRepository.findOne({
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
    if (!orderCreated) {
      throw new NotFoundException({
        message: ['Orden no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { order: orderCreated };
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

    const orderCreated = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['branch', 'items', 'items.branchDish', 'items.branchDish.dish']
    });
    if (!orderCreated) {
      throw new NotFoundException({
        message: ['Orden no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { order: orderCreated };
  }

  async getOrderByFilter(getOrderByFilterDto: GetOrdersByFilterDto) {
    const statuses = [OrderStatus.ENTREGADO, OrderStatus.CANCELADO];
    const [orders, total] = await this.orderRepository.findAndCount({
      skip: (getOrderByFilterDto.page - 1) * 10,
      take: 10,
      where: {
        branch: { id: getOrderByFilterDto.branchId },
        createdAt: Between(getOrderByFilterDto.startDate, getOrderByFilterDto.endDate),
        status: In(statuses)
      },
      relations: [
        'branch',
        'items.branchDish.dish',
        'items.itemExtras.extraBranchDish.extraBranch.extra'
      ]
    });
    if (!orders.length) {
      throw new NotFoundException({
        message: ['Órdenes no encontradas.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { orders, total };
  }

  async findByBranchId(branchId: number) {
    const orders = await this.orderRepository.find({
      where: { branch: { id: branchId } },
      relations: [
        'branch',
        'items.branchDish.dish',
        'items.itemExtras.extraBranchDish.extraBranch.extra'
      ]
    });
    if (!orders.length) {
      throw new NotFoundException({
        message: ['Órdenes no encontradas.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { orders };
  }

  async findActiveByBranchId(branchId: number) {
    const statuses = [OrderStatus.CREADO, OrderStatus.COCINANDO, OrderStatus.LISTO];

    const orders = await this.orderRepository.find({
      where: { branch: { id: branchId }, status: In(statuses) },
      relations: [
        'branch',
        'items.branchDish.dish',
        'items.itemExtras.extraBranchDish.extraBranch.extra'
      ]
    });
    if (!orders.length) {
      throw new NotFoundException({
        message: ['Órdenes no encontradas.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { orders };
  }

  async findByBranchIdAndPage(branchId: number, page: number) {
    const [orders, total] = await this.orderRepository.findAndCount({
      skip: (page - 1) * 10,
      take: 10,
      where: { branch: { id: branchId } },
      relations: [
        'branch',
        'items.branchDish.dish',
        'items.itemExtras.extraBranchDish.extraBranch.extra'
      ]
    });
    if (!orders.length) {
      throw new NotFoundException({
        message: ['Órdenes no encontradas.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { orders, total };
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

    return { orders };
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

    return { orders };
  }

  async findById(id: number) {
    const order =  await this.orderRepository.findOne({
      where: { id },
      relations: [
        'branch',
        'items.branchDish.dish',
        'items.itemExtras.extraBranchDish.extraBranch.extra'
      ]
    });
    if (!order) {
      throw new NotFoundException({
        message: ['Orden no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { order };
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

    return this.findById(id);
  }
}
