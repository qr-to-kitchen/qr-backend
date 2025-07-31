import { Module } from '@nestjs/common';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from './branches.entity';
import { Restaurant } from '../restaurants/restaurants.entity';
import { User } from '../users/entity/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Branch, Restaurant, User]),
  ],
  controllers: [BranchesController],
  providers: [BranchesService]
})
export class BranchesModule {}
