import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './restaurants.entity';
import { DataSource, Repository } from 'typeorm';
import { User, UserRole } from '../users/entity/users.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import * as bcrypt from 'bcrypt';
import { CreateRestaurantUserDto } from './dto/create-restaurant-user.dto';

@Injectable()
export class RestaurantsService {

  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto) {
    const user = await this.userRepository.findOne({
      where: { id: createRestaurantDto.userId }
    });
    if (!user) {
      throw new BadRequestException({
        message: ['Usuario no encontrado.'],
        error: "Bad Request",
        statusCode: 400
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

    const savedRestaurant = await this.restaurantRepository.save(newRestaurant);

    return { restaurant: savedRestaurant };
  }

  async createRestaurantWithUser(createRestaurantUserDto: CreateRestaurantUserDto) {
    const restaurantId = await this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const restaurantRepo = manager.getRepository(Restaurant);

      const userExisting = await userRepo.findOne({
        where: [{ email: createRestaurantUserDto.user.email }, { username: createRestaurantUserDto.user.username }],
      });
      if (userExisting) {
        throw new BadRequestException({
          message: ['Email o username ya están en uso.'],
          error: "Bad Request",
          statusCode: 400
        });
      }

      const hashedPassword = await bcrypt.hash(createRestaurantUserDto.user.password, 10);
      const newUser = userRepo.create({
        ...createRestaurantUserDto.user,
        password: hashedPassword
      });
      const savedUser = await userRepo.save(newUser);

      const restaurant = restaurantRepo.create({
        name: createRestaurantUserDto.restaurant.name,
        user: savedUser
      });

      const savedRestaurant = await restaurantRepo.save(restaurant);

      return savedRestaurant.id;
    });

    return this.findById(restaurantId);
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

    return { restaurant };
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

    return { restaurant };
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

    return { restaurants };
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

    return this.findById(id);
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
