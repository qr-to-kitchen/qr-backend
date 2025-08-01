import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { OrderStatus } from './entity/order.entity';
import { ApiQuery } from '@nestjs/swagger';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrderController {

  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Post(':id/item')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  addItemToOrder(@Param('id', ParseIntPipe) id: number, @Body() createOrderItemDto: CreateOrderItemDto) {
    return this.orderService.addItemToOrder(id, createOrderItemDto);
  }

  @Get('branch/:id')
  getOrderByBranchId(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findByBranchId(id);
  }

  @Get('restaurant/:id')
  getOrderByRestaurantId(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findByRestaurantId(id);
  }

  @Get('branch/:id/status')
  @ApiQuery({ name: 'status', enum: OrderStatus, required: true })
  getOrderByStatusAndBranchId(@Param('id', ParseIntPipe) id: number, @Query('status', new ValidationPipe({ transform: true })) status: OrderStatus) {
    return this.orderService.findByStatusAndBranchId(status, id);
  }

  @Get(':id')
  getOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findById(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateStatusById(@Param('id', ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.updateStatusById(id, updateOrderDto.status);
  }
}
