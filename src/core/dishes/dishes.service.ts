import { Injectable, NotFoundException } from '@nestjs/common';
import { Dish } from './dishes.entity';
import { Restaurant } from '../restaurants/restaurants.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';

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

  async findByRestaurantId(restaurantId: number) {
    const dishes = await this.dishRepository.find({
      where: { restaurant: { id: restaurantId } }
    });
    if (!dishes.length) {
      throw new NotFoundException({
        message: ['Platos no encontrados.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return dishes;
  }

  async findById(id: number) {
    const dish = await this.dishRepository.findOneBy({
      id
    });
    if (!dish) {
      throw new NotFoundException({
        message: ['Plato no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return dish;
  }

  async updateById(id: number, updateDishDto: UpdateDishDto) {
    const dish = await this.dishRepository.findOneBy({
      id
    });
    if (!dish) {
      throw new NotFoundException({
        message: ['Plato no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    await this.dishRepository.update(id, updateDishDto);

    return this.dishRepository.findOneBy({ id });
  }

  async deleteById(id: number) {
    const result = await this.dishRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException({
        message: ['Plato no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    } else {
      return {
        message: 'Plato eliminado correctamente.'
      }
    }
  }
}
