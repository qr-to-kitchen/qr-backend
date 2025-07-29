import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/create-dish.dto';

@Controller('dishes')
export class DishesController {

  constructor(private readonly dishesService: DishesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createDishDto: CreateDishDto) {
    return this.dishesService.create(createDishDto);
  }
}
