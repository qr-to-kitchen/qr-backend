import { Module } from '@nestjs/common';
import { DishesController } from './dishes.controller';
import { DishesService } from './dishes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from '../restaurants/restaurants.entity';
import { Dish } from './dishes.entity';
import { ImagesService } from '../images/images.service';
import { Category } from '../categories/categories.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dish, Restaurant, Category]),
  ],
  controllers: [DishesController],
  providers: [DishesService, ImagesService]
})
export class DishesModule {}
