import { Injectable, NotFoundException } from '@nestjs/common';
import { Branch } from '../branches/branches.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BranchDish } from './branches-dishes.entity';
import { DataSource, In, Not, Repository } from 'typeorm';
import { Dish } from '../dishes/dishes.entity';
import { CreateBranchDishDto } from './dto/create-branch-dish.dto';
import { UpdateBranchDishDto } from './dto/update-branch-dish.dto';
import { BulkSaveBranchDishes } from './dto/bulk-save-branch-dishes';
import { SocketGateway } from '../../socket/socket.gateway';

@Injectable()
export class BranchesDishesService {

  constructor(
    @InjectRepository(BranchDish)
    private branchDishRepository: Repository<BranchDish>,
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    private dataSource: DataSource,
    private socketGateway: SocketGateway
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

    return this.findById(savedBranchDish.id);
  }

  async findByBranchId(branchId: number) {
    const branchesDishes = await this.branchDishRepository.find({
      where: { branch: { id: branchId } },
      relations: ['dish.category']
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

  async findByBranchIdAndCategoryId(branchId: number, categoryId: number) {
    const branchesDishes = await this.branchDishRepository.find({
      where: { branch: { id: branchId }, dish: { category: { id: categoryId } }, isAvailable: true },
      relations: ['branch.restaurant', 'dish.category']
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

  async findByRestaurantIdAndNotBranchId(restaurantId: number, branchId: number) {
    const branchDishes = await this.branchDishRepository.find({
      where: { branch: { id: branchId } },
      relations: ['dish']
    });
    if (!branchDishes.length) {
      throw new NotFoundException({
        message: ['Platos en sede no encontrados.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    const dishIdsInBranch = branchDishes.map(bd => bd.dish.id);

    const dishesNotInBranch = await this.dishRepository.find({
      where: { restaurant: { id: restaurantId }, id: Not(In(dishIdsInBranch)) }
    });

    return { dishes: dishesNotInBranch };
  }

  async findByBranchIdAndDishId(branchId: number, dishId: number) {
    const branchDish = await this.branchDishRepository.findOne({
      where: { branch: { id: branchId }, dish: { id: dishId } },
      relations: ['dish', 'branch']
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

  async findById(id: number) {
    const branchDish = await this.branchDishRepository.findOne({
      where: { id },
      relations: ['dish.category', 'branch']
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

  async bulkSave(bulkSaveBranchDishes: BulkSaveBranchDishes) {
    return await this.dataSource.transaction(async (manager) => {
      const branchDishRepo = manager.getRepository(BranchDish);
      const branchRepo = manager.getRepository(Branch);
      const dishRepo = manager.getRepository(Dish);

      const branchesDishes: BranchDish[] = [];

      for (const createOrUpdateBranchDish of bulkSaveBranchDishes.branchDishes) {
        if (createOrUpdateBranchDish.id) {
          const updateBranchDishDto: UpdateBranchDishDto = {
            customPrice: createOrUpdateBranchDish.customPrice,
            isAvailable: createOrUpdateBranchDish.isAvailable
          }

          const branchDish = await branchDishRepo.findOneBy({
            id: createOrUpdateBranchDish.id
          });
          if (!branchDish) {
            throw new NotFoundException({
              message: ['Plato en sede no encontrado.'],
              error: 'Not Found',
              statusCode: 404
            });
          }

          await branchDishRepo.update(branchDish.id, updateBranchDishDto);

          const updatedBranchDish = await branchDishRepo.findOne({
            where: { id: branchDish.id },
            relations: ['dish', 'branch']
          });
          if (!updatedBranchDish) {
            throw new NotFoundException({
              message: ['Plato en sede no encontrado.'],
              error: 'Not Found',
              statusCode: 404
            });
          }

          branchesDishes.push(updatedBranchDish);
          this.socketGateway.server.to(bulkSaveBranchDishes.socketId).emit('small-snackbar-updates', {
            current: branchesDishes.length,
            total: bulkSaveBranchDishes.branchDishes.length
          });
        } else {
          if (createOrUpdateBranchDish.branchId && createOrUpdateBranchDish.dishId && createOrUpdateBranchDish.isAvailable !== undefined) {
            const createBranchDishDto: CreateBranchDishDto = {
              customPrice: createOrUpdateBranchDish.customPrice,
              isAvailable: createOrUpdateBranchDish.isAvailable,
              branchId: createOrUpdateBranchDish.branchId,
              dishId: createOrUpdateBranchDish.dishId
            }

            const branch = await branchRepo.findOne({
              where: { id: createBranchDishDto.branchId }
            });
            if (!branch) {
              throw new NotFoundException({
                message: ['Sede no encontrada.'],
                error: "Bad Request",
                statusCode: 404
              });
            }

            const dish = await dishRepo.findOne({
              where: { id: createBranchDishDto.dishId }
            });
            if (!dish) {
              throw new NotFoundException({
                message: ['Plato no encontrado.'],
                error: "Bad Request",
                statusCode: 404
              });
            }

            const branchDish = branchDishRepo.create({
              customPrice: createBranchDishDto.customPrice,
              isAvailable: createBranchDishDto.isAvailable,
              branch: branch,
              dish: dish
            });
            const savedBranchDish = await branchDishRepo.save(branchDish);

            branchesDishes.push(savedBranchDish);
            this.socketGateway.server.to(bulkSaveBranchDishes.socketId).emit('small-snackbar-updates', {
              current: branchesDishes.length,
              total: bulkSaveBranchDishes.branchDishes.length
            });
          } else {
            throw new NotFoundException({
              message: ['Datos incorrectos.'],
              error: 'Bad Request',
              statusCode: 400
            });
          }
        }
      }

      return { branchesDishes };
    });
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
