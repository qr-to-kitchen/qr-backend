import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from './branches.entity';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entity/users.entity';
import { Restaurant } from '../restaurants/restaurants.entity';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchesService {

  constructor(
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>
  ) {}

  async create(createBranchDto: CreateBranchDto): Promise<Branch> {
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

    return this.branchRepository.save(branch);
  }

  async findByUserId(userId: number) {
    const branch =  await this.branchRepository.findOne({
      where: { user: { id: userId } }
    });
    if (!branch) {
      throw new NotFoundException({
        message: ['Sede no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return branch;
  }

  async findByRestaurantId(restaurantId: number) {
    const branch =  await this.branchRepository.find({
      where: { restaurant: { id: restaurantId } }
    });
    if (!branch) {
      throw new NotFoundException({
        message: ['Sede no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return branch;
  }

  async findById(id: number) {
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

    return branch;
  }

  getAll() {
    return this.branchRepository.find();
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

    return this.branchRepository.findOneBy({ id });
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
