import { Module } from '@nestjs/common';
import { DishesController } from './dishes.controller';
import { DishesService } from './dishes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from '../restaurants/restaurants.entity';
import { Dish } from './dishes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dish, Restaurant]),
  ],
  controllers: [DishesController],
  providers: [DishesService]
})
export class DishesModule {}
