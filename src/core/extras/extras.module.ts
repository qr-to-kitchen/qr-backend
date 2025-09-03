import { Module } from '@nestjs/common';
import { ExtrasController } from './extras.controller';
import { ExtrasService } from './extras.service';
import { Extra } from './entities/extras.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtraBranchDish } from './entities/extras-branch-dish.entity';
import { Branch } from '../branches/branches.entity';
import { BranchDish } from '../branches-dishes/branches-dishes.entity';
import { Restaurant } from '../restaurants/restaurants.entity';
import { ExtraBranch } from './entities/extras-branches.entity';
import { SocketGateway } from '../../socket/socket.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Extra, ExtraBranch, ExtraBranchDish, Restaurant, Branch, BranchDish])
  ],
  controllers: [ExtrasController],
  providers: [ExtrasService, SocketGateway]
})
export class ExtrasModule {}
