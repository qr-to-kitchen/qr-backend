import { Module } from '@nestjs/common';
import { ExtrasController } from './extras.controller';
import { ExtrasService } from './extras.service';
import { Extra } from './entities/extras.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtraBranchDish } from './entities/extras-branch-dish.entity';
import { Branch } from '../branches/branches.entity';
import { BranchDish } from '../branches-dishes/branches-dishes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Extra, ExtraBranchDish, Branch, BranchDish])
  ],
  controllers: [ExtrasController],
  providers: [ExtrasService]
})
export class ExtrasModule {}
