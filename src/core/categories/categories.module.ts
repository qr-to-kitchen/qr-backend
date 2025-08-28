import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './categories.entity';
import { Restaurant } from '../restaurants/restaurants.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Restaurant])
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService]
})
export class CategoriesModule {}
