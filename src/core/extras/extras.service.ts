import { Injectable, NotFoundException } from '@nestjs/common';
import { ExtraBranchDish } from './entities/extras-branch-dish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Extra } from './entities/extras.entity';
import { Repository } from 'typeorm';
import { CreateExtraDto } from './dto/create-extra.dto';
import { Branch } from '../branches/branches.entity';
import { CreateExtraBranchDishDto } from './dto/create-extra-branch-dish.dto';
import { BranchDish } from '../branches-dishes/branches-dishes.entity';
import { UpdateExtraDto } from './dto/update-extra.dto';

@Injectable()
export class ExtrasService {

  constructor(
    @InjectRepository(Extra)
    private extraRepository: Repository<Extra>,
    @InjectRepository(ExtraBranchDish)
    private extraBranchDishRepository: Repository<ExtraBranchDish>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    @InjectRepository(BranchDish)
    private branchDishRepository: Repository<BranchDish>
  ) {}

  async createExtra(createExtraDto: CreateExtraDto) {
    const branch = await this.branchRepository.findOne({
      where: { id: createExtraDto.branchId }
    });
    if (!branch) {
      throw new NotFoundException({
        message: ['Sede no encontrada.'],
        error: "Bad Request",
        statusCode: 404
      });
    }

    const extra = this.extraRepository.create({
      name: createExtraDto.name,
      branch: branch
    });

    return this.extraRepository.save(extra);
  }

  async createExtraBranchDish(createExtraBranchDishDto: CreateExtraBranchDishDto) {
    const extra = await this.extraRepository.findOne({
      where: { id: createExtraBranchDishDto.extraId }
    });
    if (!extra) {
      throw new NotFoundException({
        message: ['Extra no encontrado.'],
        error: "Bad Request",
        statusCode: 404
      });
    }

    const branchDish = await this.branchDishRepository.findOne({
      where: { id: createExtraBranchDishDto.branchDishId }
    });
    if (!branchDish) {
      throw new NotFoundException({
        message: ['Plato en sede no encontrado.'],
        error: "Bad Request",
        statusCode: 404
      });
    }

    const extraBranchDish = this.extraBranchDishRepository.create({
      extra: extra,
      branchDish: branchDish
    });

    return this.extraBranchDishRepository.save(extraBranchDish);
  }

  async findByBranchId(branchId: number) {
    const extras = await this.extraRepository.find({
      where : { branch: { id: branchId } }
    });
    if (!extras.length) {
      throw new NotFoundException({
        message: ['Extras no encontrados.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return extras;
  }

  async findByBranchDishId(branchDishId: number) {
    const extraBranchDishes = await this.extraBranchDishRepository.find({
      where : { branchDish: { id: branchDishId } }
    });
    if (!extraBranchDishes.length) {
      throw new NotFoundException({
        message: ['Extras en plato en sede no encontrados.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return extraBranchDishes;
  }

  async updateExtraById(id: number, updateExtraDto: UpdateExtraDto) {
    const extra = await this.extraRepository.findOneBy({
      id
    });
    if (!extra) {
      throw new NotFoundException({
        message: ['Extra no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    await this.extraRepository.update(id, updateExtraDto);

    return this.extraRepository.findOneBy({ id });
  }

  async deleteExtraById(extraId: number) {
    const result = await this.extraRepository.softDelete(extraId);

    if (result.affected === 0) {
      throw new NotFoundException({
        message: ['Extra no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    } else {
      return {
        message: 'Extra eliminado correctamente.'
      }
    }
  }

  async deleteExtraBranchDishById(extraBranchDishId: number) {
    const result = await this.extraBranchDishRepository.softDelete(extraBranchDishId);

    if (result.affected === 0) {
      throw new NotFoundException({
        message: ['Extra en plato en sede no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    } else {
      return {
        message: 'Extra en plato en sede eliminado correctamente.'
      }
    }
  }
}
