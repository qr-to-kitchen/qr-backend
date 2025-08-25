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

    const branch = this.branchRepository.create({
      address: createBranchDto.address,
      user: user,
      restaurant: restaurant
    });

    const savedBranch = await this.branchRepository.save(branch);

    return { branch: savedBranch };
  }

  async createBranchWithUser(createBranchUserDto: CreateBranchUserDto) {
    return await this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const branchRepo = manager.getRepository(Branch);
      const restaurantRepo = manager.getRepository(Restaurant);

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

      const branch = branchRepo.create({
        address: createBranchUserDto.branch.address,
        user: savedUser,
        restaurant: restaurant
      });

      const savedBranch = await branchRepo.save(branch);

      return { branch: savedBranch }
    });
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
      relations: ['restaurant']
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
