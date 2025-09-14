import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BranchesDishesService } from './branches-dishes.service';
import { CreateBranchDishDto } from './dto/create-branch-dish.dto';
import { UpdateBranchDishDto } from './dto/update-branch-dish.dto';
import { BulkSaveBranchDishes } from './dto/bulk-save-branch-dishes';

@Controller('branches-dishes')
export class BranchesDishesController {

  constructor(private readonly branchesDishesService: BranchesDishesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createBranchDishDto: CreateBranchDishDto) {
    return this.branchesDishesService.create(createBranchDishDto);
  }

  @Get('branch/:id')
  getBranchDishByBranchId(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.branchesDishesService.findByBranchId(id);
  }

  @Get('branch/:branchId/category/:categoryId')
  getBranchDishByBranchIdAndCategoryId(
    @Param('branchId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) branchId: number,
    @Param('categoryId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) categoryId: number
  ) {
    return this.branchesDishesService.findByBranchIdAndCategoryId(branchId, categoryId);
  }

  @Get('dish/:id')
  getBranchDishByDishId(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.branchesDishesService.findByDishId(id);
  }

  @Get('restaurant/:restaurantId/no-branch/:branchId')
  getExtraByRestaurantIdAndNotBranchId(
    @Param('restaurantId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) restaurantId: number,
    @Param('branchId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) branchId: number
  ) {
    return this.branchesDishesService.findByRestaurantIdAndNotBranchId(restaurantId, branchId);
  }

  @Get('branch/:branchId/dish/:dishId')
  getBranchDishByBranchIdAndDishId(
    @Param('branchId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) branchId: number,
    @Param('dishId', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) dishId: number
  ) {
    return this.branchesDishesService.findByBranchIdAndDishId(branchId, dishId);
  }

  @Get(':id')
  getBranchDishById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.branchesDishesService.findById(id);
  }

  @Post('bulk-save')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  bulkSave(@Body() bulkSaveBranchDishes: BulkSaveBranchDishes) {
    return this.branchesDishesService.bulkSave(bulkSaveBranchDishes);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updateBranchDishDto: UpdateBranchDishDto) {
    return this.branchesDishesService.updateById(id, updateBranchDishDto);
  }

  @Delete(':id')
  deleteById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.branchesDishesService.deleteById(id);
  }
}
