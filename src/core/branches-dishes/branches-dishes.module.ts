import { Module } from '@nestjs/common';
import { BranchesDishesController } from './branches-dishes.controller';
import { BranchesDishesService } from './branches-dishes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchDish } from './branches-dishes.entity';
import { Branch } from '../branches/branches.entity';
import { Dish } from '../dishes/dishes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BranchDish, Branch, Dish]),
  ],
  controllers: [BranchesDishesController],
  providers: [BranchesDishesService]
})
export class BranchesDishesModule {}
