import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './categories.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Restaurant } from '../restaurants/restaurants.entity';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: createCategoryDto.restaurantId }
    });
    if (!restaurant) {
      throw new BadRequestException({
        message: ['Restaurante no encontrado.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const newCategory = this.categoryRepository.create({
      name: createCategoryDto.name,
      displayOrder: createCategoryDto.displayOrder,
      visible: createCategoryDto.visible,
      restaurant: restaurant
    });

    const savedCategory = await this.categoryRepository.save(newCategory);

    return this.findById(savedCategory.id);
  }

  async findByRestaurantId(restaurantId: number) {
    const categories = await this.categoryRepository.find({
      where: { restaurant: { id: restaurantId } },
      relations: ['restaurant', 'dishes']
    });
    if (!categories.length) {
      throw new NotFoundException({
        message: ['Categorías no encontrados.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { categories };
  }

  async findById(id: number) {
    const category =  await this.categoryRepository.findOne({
      where: { id },
      relations: ['restaurant', 'dishes']
    });
    if (!category) {
      throw new NotFoundException({
        message: ['Categoría no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { category };
  }

  async updateById(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOneBy({
      id
    });
    if (!category) {
      throw new NotFoundException({
        message: ['Categoría no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    await this.categoryRepository.update(id, updateCategoryDto);

    return this.findById(id);
  }
}
