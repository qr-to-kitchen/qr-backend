import { Injectable, NotFoundException } from '@nestjs/common';
import { Dish } from './dishes.entity';
import { Restaurant } from '../restaurants/restaurants.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDishDto } from './dto/create-dish.dto';

@Injectable()
export class DishesService {

  constructor(
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>
  ) {}

  async create(createDishDto: CreateDishDto) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: createDishDto.restaurantId }
    });

    if (!restaurant) {
      throw new NotFoundException({
        message: ['Restaurante no encontrado.'],
        error: "Bad Request",
        statusCode: 404
      });
    }

    const dish = this.dishRepository.create({
      name: createDishDto.name,
      description: createDishDto.description,
      basePrice: createDishDto.basePrice,
      restaurant: restaurant
    });

    return this.dishRepository.save(dish);
  }
}
