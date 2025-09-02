import { Injectable, NotFoundException } from '@nestjs/common';
import { Dish } from './dishes.entity';
import { Restaurant } from '../restaurants/restaurants.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { ImagesService } from '../images/images.service';
import { Category } from '../categories/categories.entity';
import { Branch } from '../branches/branches.entity';
import { BranchDish } from '../branches-dishes/branches-dishes.entity';

@Injectable()
export class DishesService {

  constructor(
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private readonly imagesService: ImagesService,
    private dataSource: DataSource
  ) {}

  async create(createDishDto: CreateDishDto, file: Express.Multer.File) {
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

    const category = await this.categoryRepository.findOne({
      where: { id: createDishDto.categoryId }
    });
    if (!category) {
      throw new NotFoundException({
        message: ['Categoría no encontrada.'],
        error: "Bad Request",
        statusCode: 404
      });
    }

    const imageUrl = await this.imagesService.uploadImageReturnUrl(file);

    const dish = this.dishRepository.create({
      name: createDishDto.name,
      description: createDishDto.description,
      basePrice: createDishDto.basePrice,
      imageUrl: imageUrl,
      restaurant: restaurant,
      category: category,
    });

    const savedDish = await this.dishRepository.save(dish);

    if (createDishDto.saveInAllBranches) {
      await this.dataSource.transaction(async (manager) => {
        const branchRepo = manager.getRepository(Branch);
        const branchDishRepo = manager.getRepository(BranchDish);

        const branches = await branchRepo.find({
          where: { restaurant: { id: restaurant.id } }
        });
        for (const branch of branches) {
          const branchDish = branchDishRepo.create({
            isAvailable: true,
            branch: branch,
            dish: savedDish
          });

          await branchDishRepo.save(branchDish);
        }
      });
    }

    return { dish: savedDish };
  }

  async findByRestaurantId(restaurantId: number) {
    const dishes = await this.dishRepository.find({
      where: { restaurant: { id: restaurantId } },
      relations: ['restaurant', 'category']
    });
    if (!dishes.length) {
      throw new NotFoundException({
        message: ['Platos no encontrados.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { dishes };
  }

  async findById(id: number) {
    const dish =  await this.dishRepository.findOne({
      where: { id },
      relations: ['restaurant', 'category']
    });
    if (!dish) {
      throw new NotFoundException({
        message: ['Plato no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { dish };
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

    if (updateDishDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateDishDto.categoryId }
      });
      if (!category) {
        throw new NotFoundException({
          message: ['Categoría no encontrada.'],
          error: "Bad Request",
          statusCode: 404
        });
      }

      updateDishDto.category = category;
      delete updateDishDto.categoryId;
    }

    await this.dishRepository.update(id, updateDishDto);

    return this.findById(id);
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
