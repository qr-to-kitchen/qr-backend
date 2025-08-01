import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './restaurants.entity';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entity/users.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantsService {

  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto) {
    const user = await this.userRepository.findOne({
      where: { id: createRestaurantDto.userId }
    });
    if (!user) {
      throw new NotFoundException({
        message: ['Usuario no encontrado.'],
        error: "Bad Request",
        statusCode: 404
      });
    }

    if (user.role !== UserRole.ADMIN) {
      throw new BadRequestException({
        message: ['Solo los usuarios administradores pueden tener restaurantes.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const newRestaurant = this.restaurantRepository.create({
      name: createRestaurantDto.name,
      user: user
    });

    return this.restaurantRepository.save(newRestaurant);
  }

  async findByUserId(userId: number) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { user: { id: userId } }
    });
    if (!restaurant) {
      throw new NotFoundException({
        message: ['Restaurante no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return restaurant;
  }

  async findById(id: number) {
    const restaurant = await this.restaurantRepository.findOneBy({
      id
    });
    if (!restaurant) {
      throw new NotFoundException({
        message: ['Restaurante no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return restaurant;
  }

  async getAll() {
    const restaurants = await this.restaurantRepository.find();
    if (!restaurants.length) {
      throw new NotFoundException({
        message: ['Restaurantes no encontrados.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return restaurants;
  }

  async updateById(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    const restaurant = await this.restaurantRepository.findOneBy({
      id
    });
    if (!restaurant) {
      throw new NotFoundException({
        message: ['Restaurante no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    await this.restaurantRepository.update(id, updateRestaurantDto);

    return this.restaurantRepository.findOneBy({ id });
  }

  async deleteById(id: number) {
    const result = await this.restaurantRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException({
        message: ['Restaurante no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    } else {
      return {
        message: 'Restaurante eliminado correctamente.'
      }
    }
  }
}
