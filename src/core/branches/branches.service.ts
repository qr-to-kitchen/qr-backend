import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from './branches.entity';
import { DataSource, Repository } from 'typeorm';
import { User, UserRole } from '../users/entity/users.entity';
import { Restaurant } from '../restaurants/restaurants.entity';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { CreateBranchUserDto } from './dto/create-branch-user.dto';
import * as bcrypt from 'bcrypt';
import { BranchDish } from '../branches-dishes/branches-dishes.entity';
import { ExtraBranch } from '../extras/entities/extras-branches.entity';

@Injectable()
export class BranchesService {

  constructor(
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    private dataSource: DataSource
  ) {}

  async create(createBranchDto: CreateBranchDto) {
    const user = await this.userRepository.findOne({
      where: { id: createBranchDto.userId }
    });
    if (!user) {
      throw new NotFoundException({
        message: ['Usuario no encontrado.'],
        error: "Bad Request",
        statusCode: 404
      });
    }

    if (user.role !== UserRole.BRANCH) {
      throw new BadRequestException({
        message: ['Solo los usuarios secundarios pueden tener sedes.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const restaurant = await this.restaurantRepository.findOne({
      where: { id: createBranchDto.restaurantId }
    });
    if (!restaurant) {
      throw new NotFoundException({
        message: ['Restaurante no encontrado.'],
        error: "Bad Request",
        statusCode: 404
      });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const branch = this.branchRepository.create({
      address: createBranchDto.address,
      dailyCode: code,
      dailyCodeUpdatedAt: new Date(),
      user: user,
      restaurant: restaurant
    });

    const savedBranch = await this.branchRepository.save(branch);

    return { branch: savedBranch };
  }

  async createBranchWithUser(createBranchUserDto: CreateBranchUserDto) {
    const branchId = await this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const branchRepo = manager.getRepository(Branch);
      const restaurantRepo = manager.getRepository(Restaurant);
      const branchDishRepo = manager.getRepository(BranchDish);
      const extraBranchRepo = manager.getRepository(ExtraBranch);

      const userExisting = await userRepo.findOne({
        where: [{ email: createBranchUserDto.user.email }, { username: createBranchUserDto.user.username }],
      });
      if (userExisting) {
        throw new BadRequestException({
          message: ['Email o username ya están en uso.'],
          error: "Bad Request",
          statusCode: 400
        });
      }

      const hashedPassword = await bcrypt.hash(createBranchUserDto.user.password, 10);
      const newUser = userRepo.create({
        ...createBranchUserDto.user,
        password: hashedPassword
      });
      const savedUser = await userRepo.save(newUser);

      const restaurant = await restaurantRepo.findOne({
        where: { id: createBranchUserDto.branch.restaurantId }
      });
      if (!restaurant) {
        throw new NotFoundException({
          message: ['Restaurante no encontrado.'],
          error: "Bad Request",
          statusCode: 404
        });
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();

      const branch = branchRepo.create({
        address: createBranchUserDto.branch.address,
        dailyCode: code,
        dailyCodeUpdatedAt: new Date(),
        user: savedUser,
        restaurant: restaurant
      });

      const savedBranch = await branchRepo.save(branch);

      if (createBranchUserDto.branch.sourceBranchId) {
        const sourceBranchDishes = await branchDishRepo.find({
          where: { id: createBranchUserDto.branch.sourceBranchId }
        });
        if (!sourceBranchDishes.length) {
          throw new NotFoundException({
            message: ['Platos en sede no encontrados.'],
            error: "Not Found",
            statusCode: 404
          });
        }

        for (const sourceBranchDish of sourceBranchDishes) {
          const newBranchDish = branchDishRepo.create({
            isAvailable: true,
            branch: savedBranch,
            dish: sourceBranchDish.dish
          });
          await branchDishRepo.save(newBranchDish);
        }

        const sourceBranchExtras = await extraBranchRepo.find({
          where: { id: createBranchUserDto.branch.sourceBranchId }
        });
        if (!sourceBranchExtras.length) {
          throw new NotFoundException({
            message: ['Extras en sede no encontrados.'],
            error: "Not Found",
            statusCode: 404
          })
        }

        for (const sourceBranchExtra of sourceBranchExtras) {
          const newExtraBranch = extraBranchRepo.create({
            branch: savedBranch,
            extra: sourceBranchExtra.extra
          });
          await extraBranchRepo.save(newExtraBranch);
        }
      }

      return savedBranch.id;
    });

    return this.findById(branchId);
  }

  async findByUserId(userId: number) {
    const branch =  await this.branchRepository.findOne({
      where: { user: { id: userId } },
      relations: ['restaurant']
    });
    if (!branch) {
      throw new NotFoundException({
        message: ['Sede no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { branch };
  }

  async findByRestaurantId(restaurantId: number) {
    const branches =  await this.branchRepository.find({
      where: { restaurant: { id: restaurantId } },
      relations: ['restaurant', 'branchDishes', 'extraBranches']
    });
    if (!branches.length) {
      throw new NotFoundException({
        message: ['Sedes no encontradas.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { branches };
  }

  async findById(id: number) {
    const branch = await this.branchRepository.findOne({
      where: { id },
      relations: ['restaurant', 'branchDishes', 'extraBranches']
    });
    if (!branch) {
      throw new NotFoundException({
        message: ['Sede no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { branch };
  }

  async getAll() {
    const branches = await this.branchRepository.find();
    if (!branches.length) {
      throw new NotFoundException({
        message: ['Sedes no encontradas.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { branches };
  }

  async updateById(id: number, updateBranchDto: UpdateBranchDto) {
    const branch = await this.branchRepository.findOneBy({
      id
    });
    if (!branch) {
      throw new NotFoundException({
        message: ['Sede no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    await this.branchRepository.update(id, updateBranchDto);

    return this.findById(id);
  }

  async refreshDailyCodeByBranchId(id: number) {
    const branch = await this.branchRepository.findOneBy({
      id
    });
    if (!branch) {
      throw new NotFoundException({
        message: ['Sede no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await this.branchRepository.update(id, { dailyCode: code, dailyCodeUpdatedAt: new Date() });

    return this.findById(id);
  }

  async deleteById(id: number) {
    const result = await this.branchRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException({
        message: ['Sede no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    } else {
      return {
        message: 'Sede eliminada correctamente.'
      }
    }
  }
}
