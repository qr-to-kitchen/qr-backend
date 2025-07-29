import { Injectable, NotFoundException } from '@nestjs/common';
import { Branch } from '../branches/branches.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BranchDish } from './branches-dishes.entity';
import { Repository } from 'typeorm';
import { Dish } from '../dishes/dishes.entity';
import { CreateBranchDishDto } from './dto/create-branch-dish.dto';

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

    return this.branchDishRepository.save(branchDish);
  }
}
