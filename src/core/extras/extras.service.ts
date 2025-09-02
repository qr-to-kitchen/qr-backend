import { Injectable, NotFoundException } from '@nestjs/common';
import { ExtraBranchDish } from './entities/extras-branch-dish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Extra } from './entities/extras.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateExtraDto } from './dto/create-extra.dto';
import { Branch } from '../branches/branches.entity';
import { CreateExtraBranchDishDto } from './dto/create-extra-branch-dish.dto';
import { BranchDish } from '../branches-dishes/branches-dishes.entity';
import { UpdateExtraDto } from './dto/update-extra.dto';
import { Restaurant } from '../restaurants/restaurants.entity';
import { ExtraBranch } from './entities/extras-branches.entity';
import { CreateExtraBranchDto } from './dto/create-extra-branch.dto';
import { UpdateExtraBranchDishDto } from './dto/update-extra-branch-dish.dto';
import { BulkSaveExtraBranchDishes } from './dto/bulk-save-extra-branch-dishes';

@Injectable()
export class ExtrasService {

  constructor(
    @InjectRepository(Extra)
    private extraRepository: Repository<Extra>,
    @InjectRepository(ExtraBranch)
    private extraBranchRepository: Repository<ExtraBranch>,
    @InjectRepository(ExtraBranchDish)
    private extraBranchDishRepository: Repository<ExtraBranchDish>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    @InjectRepository(BranchDish)
    private branchDishRepository: Repository<BranchDish>,
    private dataSource: DataSource,
  ) {}

  async createExtra(createExtraDto: CreateExtraDto) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: createExtraDto.restaurantId }
    });
    if (!restaurant) {
      throw new NotFoundException({
        message: ['Restaurante no encontrado.'],
        error: "Bad Request",
        statusCode: 404
      });
    }

    const extra = this.extraRepository.create({
      name: createExtraDto.name,
      basePrice: createExtraDto.basePrice,
      restaurant: restaurant
    });

    const savedExtra = await this.extraRepository.save(extra);

    if (createExtraDto.saveInAllBranches) {
      await this.dataSource.transaction(async (manager) => {
        const branchRepo = manager.getRepository(Branch);
        const extraBranchRepo = manager.getRepository(ExtraBranch);

        const branches = await branchRepo.find({
          where: { restaurant: { id: restaurant.id } }
        });
        for (const branch of branches) {
          const extraBranch = extraBranchRepo.create({
            extra: savedExtra,
            branch: branch
          });

          await extraBranchRepo.save(extraBranch);
        }
      });
    }

    return this.findById(savedExtra.id);
  }

  async createExtraBranch(createExtraBranchDto: CreateExtraBranchDto) {
    const extra = await this.extraRepository.findOne({
      where: { id: createExtraBranchDto.extraId }
    });
    if (!extra) {
      throw new NotFoundException({
        message: ['Extra no encontrado.'],
        error: "Bad Request",
        statusCode: 404
      });
    }

    const branch = await this.branchRepository.findOne({
      where: { id: createExtraBranchDto.branchId }
    });
    if (!branch) {
      throw new NotFoundException({
        message: ['Sede no encontrada.'],
        error: "Bad Request",
        statusCode: 404
      });
    }

    const extraBranch = this.extraBranchRepository.create({
      extra: extra,
      branch: branch
    });

    const savedExtraBranch = await this.extraBranchRepository.save(extraBranch);

    return { extraBranch: savedExtraBranch };
  }

  async createExtraBranchDish(createExtraBranchDishDto: CreateExtraBranchDishDto) {
    const extraBranch = await this.extraBranchRepository.findOne({
      where: { id: createExtraBranchDishDto.extraBranchId }
    });
    if (!extraBranch) {
      throw new NotFoundException({
        message: ['Extra en sede no encontrado.'],
        error: "Bad Request",
        statusCode: 404
      });
    }

    const branchDish = await this.branchDishRepository.findOne({
      where: { id: createExtraBranchDishDto.branchDishId },
      relations: ['dish']
    });
    if (!branchDish) {
      throw new NotFoundException({
        message: ['Plato en sede no encontrado.'],
        error: "Bad Request",
        statusCode: 404
      });
    }

    const extraBranchDish = this.extraBranchDishRepository.create({
      isAvailable: createExtraBranchDishDto.isAvailable,
      extraBranch: extraBranch,
      branchDish: branchDish
    });

    const savedExtraBranchDish = await this.extraBranchDishRepository.save(extraBranchDish);

    return { extraBranchDish: savedExtraBranchDish };
  }

  async findById(id: number) {
    const extra = await this.extraRepository.findOne({
      where: { id },
      relations: ['restaurant', 'extraBranches.branch']
    });
    if (!extra) {
      throw new NotFoundException({
        message: ['Extra no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { extra };
  }

  async findExtraBranchDishById(id: number) {
    const extraBranchDish = await this.extraBranchDishRepository.findOne({
      where: { id },
      relations: ['extraBranch', 'branchDish', 'branchDish.dish']
    });
    if (!extraBranchDish) {
      throw new NotFoundException({
        message: ['Extra en plato en sede no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { extraBranchDish };
  }

  async findByRestaurantId(restaurantId: number) {
    const extras = await this.extraRepository.find({
      where : { restaurant: { id: restaurantId } },
      relations: ['restaurant', 'extraBranches.branch']
    });
    if (!extras.length) {
      throw new NotFoundException({
        message: ['Extras no encontrados.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { extras };
  }

  async findByBranchId(branchId: number) {
    const extraBranches = await this.extraBranchRepository.find({
      where : { branch: { id: branchId } },
      relations: ['extra', 'branch', 'extraBranchDishes']
    });
    if (!extraBranches.length) {
      throw new NotFoundException({
        message: ['Extras en sede no encontrados.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { extraBranches };
  }

  async findByExtraIdAndBranchId(extraId: number, branchId: number) {
    const extraBranch = await this.extraBranchRepository.findOne({
      where: { extra: { id: extraId }, branch: { id: branchId } },
      relations: ['extra', 'branch']
    });
    if (!extraBranch) {
      throw new NotFoundException({
        message: ['Extra en sede no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { extraBranch };
  }

  async findByExtraBranchIdAndBranchDishId(extraBranchId: number, branchDishId: number) {
    const extraBranchDish = await this.extraBranchDishRepository.findOne({
      where: { extraBranch: { id: extraBranchId }, branchDish: { id: branchDishId } },
      relations: ['extraBranch', 'branchDish', 'branchDish.dish']
    });
    if (!extraBranchDish) {
      throw new NotFoundException({
        message: ['Extra en plato en sede no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { extraBranchDish };
  }

  async findByBranchDishId(branchDishId: number) {
    const extraBranchDishes = await this.extraBranchDishRepository.find({
      where : { branchDish: { id: branchDishId } },
      relations: ['extraBranch.extra']
    });
    if (!extraBranchDishes.length) {
      throw new NotFoundException({
        message: ['Extras en plato en sede no encontrados.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { extraBranchDishes };
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

    return this.findById(id);
  }

  async updateExtraBranchDishById(id: number, updateExtraBranchDishDto: UpdateExtraBranchDishDto) {
    const extraBranchDish = await this.extraBranchDishRepository.findOneBy({
      id
    });
    if (!extraBranchDish) {
      throw new NotFoundException({
        message: ['Extra en plato en sede no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    await this.extraBranchDishRepository.update(id, updateExtraBranchDishDto);

    return this.findExtraBranchDishById(id);
  }

  async bulkSave(bulkSaveExtraBranchDishes: BulkSaveExtraBranchDishes) {
    return await this.dataSource.transaction(async (manager) => {
      const extraBranchDishRepo = manager.getRepository(ExtraBranchDish);
      const extraBranchRepo = manager.getRepository(ExtraBranch);
      const branchDishRepo = manager.getRepository(BranchDish);

      const extraBranchDishes: ExtraBranchDish[] = [];

      for (const createOrUpdateExtraBranchDish of bulkSaveExtraBranchDishes.extraBranchDishes) {
        if (createOrUpdateExtraBranchDish.id) {
          const updateExtraBranchDishDto: UpdateExtraBranchDishDto = {
            isAvailable: createOrUpdateExtraBranchDish.isAvailable,
            customPrice: createOrUpdateExtraBranchDish.customPrice
          }

          const extraBranchDish = await extraBranchDishRepo.findOneBy({
            id: createOrUpdateExtraBranchDish.id
          });
          if(!extraBranchDish) {
            throw new NotFoundException({
              message: ['Extra en plato en sede no encontrado.'],
              error: 'Not Found',
              statusCode: 404
            });
          }

          await extraBranchDishRepo.update(extraBranchDish.id, updateExtraBranchDishDto);

          const updatedExtraBranchDish = await extraBranchDishRepo.findOne({
            where: { id: extraBranchDish.id },
            relations: ['extraBranch', 'branchDish', 'branchDish.dish']
          });
          if (!updatedExtraBranchDish) {
            throw new NotFoundException({
              message: ['Extra en plato en sede no encontrado.'],
              error: 'Not Found',
              statusCode: 404
            });
          }

          extraBranchDishes.push(updatedExtraBranchDish);
        } else {
          if (createOrUpdateExtraBranchDish.extraBranchId && createOrUpdateExtraBranchDish.branchDishId && createOrUpdateExtraBranchDish.isAvailable !== undefined) {
            const createExtraBranchDishDto: CreateExtraBranchDishDto = {
              customPrice: createOrUpdateExtraBranchDish.customPrice,
              isAvailable: createOrUpdateExtraBranchDish.isAvailable,
              extraBranchId: createOrUpdateExtraBranchDish.extraBranchId,
              branchDishId: createOrUpdateExtraBranchDish.branchDishId
            }

            const extraBranch = await extraBranchRepo.findOneBy({
              id: createExtraBranchDishDto.extraBranchId
            });
            if (!extraBranch) {
              throw new NotFoundException({
                message: ['Extra en sede no encontrado.'],
                error: 'Not Found',
                statusCode: 404
              });
            }

            const branchDish = await branchDishRepo.findOne({
              where: { id: createExtraBranchDishDto.branchDishId },
              relations: ['dish']
            });
            if (!branchDish) {
              throw new NotFoundException({
                message: ['Plato en sede no encontrado.'],
                error: "Not Found",
                statusCode: 404
              });
            }

            const extraBranchDish = extraBranchDishRepo.create({
              customPrice: createExtraBranchDishDto.customPrice,
              isAvailable: createExtraBranchDishDto.isAvailable,
              extraBranch: extraBranch,
              branchDish: branchDish
            });
            const savedExtraBranchDish = await extraBranchDishRepo.save(extraBranchDish);

            extraBranchDishes.push(savedExtraBranchDish);
          } else {
            throw new NotFoundException({
              message: ['Datos incorrectos.'],
              error: 'Bad Request',
              statusCode: 400
            });
          }
        }
      }

      return { extraBranchDishes };
    });
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
