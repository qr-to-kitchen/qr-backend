import { Injectable, NotFoundException } from '@nestjs/common';
import { Branch } from '../branches/branches.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BranchDish } from './branches-dishes.entity';
import { Repository } from 'typeorm';
import { Dish } from '../dishes/dishes.entity';
import { CreateBranchDishDto } from './dto/create-branch-dish.dto';
import { UpdateBranchDishDto } from './dto/update-branch-dish.dto';

@Injectable()
export class BranchesDishesService {

  constructor(
    @InjectRepository(BranchDish)
    private branchDishRepository: Repository<BranchDish>,
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>
  ) {}

  async create(createBranchDishDto: CreateBranchDishDto) {
    const branch = await this.branchRepository.findOne({
      where: { id: createBranchDishDto.branchId }
    });
    if (!branch) {
      throw new NotFoundException({
        message: ['Sede no encontrada.'],
        error: "Bad Request",
        statusCode: 404
      });
    }

    const dish = await this.dishRepository.findOne({
      where: { id: createBranchDishDto.dishId }
    });
    if (!dish) {
      throw new NotFoundException({
        message: ['Plato no encontrado.'],
        error: "Bad Request",
        statusCode: 404
      });
    }

    const branchDish = this.branchDishRepository.create({
      customPrice: createBranchDishDto.customPrice,
      isAvailable: createBranchDishDto.isAvailable,
      branch: branch,
      dish: dish
    });

    const savedBranchDish = await this.branchDishRepository.save(branchDish);

    return { branchDish: savedBranchDish };
  }

  async findByBranchId(branchId: number) {
    const branchesDishes = await this.branchDishRepository.find({
      where: { branch: { id: branchId } },
      relations: ['dish']
    });
    if (!branchesDishes.length) {
      throw new NotFoundException({
        message: ['Platos en sede no encontrados.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { branchesDishes };
  }

  async findByDishId(dishId: number) {
    const branchesDishes = await this.branchDishRepository.find({
      where: { dish: { id: dishId } },
      relations: ['dish']
    });
    if (!branchesDishes) {
      throw new NotFoundException({
        message: ['Platos en sede no encontrados.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { branchesDishes };
  }

  async findById(id: number) {
    const branchDish = await this.branchDishRepository.findOne({
      where: { id },
      relations: ['dish']
    });
    if (!branchDish) {
      throw new NotFoundException({
        message: ['Plato en sede no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { branchDish };
  }

  async updateById(id: number, updateBranchDishDto: UpdateBranchDishDto) {
    const branchDish = await this.branchDishRepository.findOneBy({
      id
    });
    if (!branchDish) {
      throw new NotFoundException({
        message: ['Plato en sede no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    await this.branchDishRepository.update(id, updateBranchDishDto);

    return this.findById(id);
  }

  async deleteById(id: number) {
    const result = await this.branchDishRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException({
        message: ['Plato en sede no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    } else {
      return {
        message: 'Plato en sede eliminado correctamente.'
      }
    }
  }
}
