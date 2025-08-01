import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';

@Controller('dishes')
export class DishesController {

  constructor(private readonly dishesService: DishesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createDishDto: CreateDishDto) {
    return this.dishesService.create(createDishDto);
  }

  @Get('restaurant/:id')
  getDishByRestaurantId(@Param('id', ParseIntPipe) id: number) {
    return this.dishesService.findByRestaurantId(id);
  }

  @Get(':id')
  getDishById(@Param('id', ParseIntPipe) id: number) {
    return this.dishesService.findById(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateById(@Param('id', ParseIntPipe) id: number, @Body() updateDishDto: UpdateDishDto) {
    return this.dishesService.updateById(id, updateDishDto);
  }

  @Delete(':id')
  deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.dishesService.deleteById(id);
  }
}
