import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './restaurants.entity';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/users.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

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

  findByUserId(userId: number) {
    return this.restaurantRepository.findOne({
      where: { user: { id: userId } }
    });
  }
}
