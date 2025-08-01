import { Body, Controller, Get, Param, ParseIntPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderItemDto } from './dto/create-order-item.dto';

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

  @Get(':id')
  getOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findById(id);
  }
}
