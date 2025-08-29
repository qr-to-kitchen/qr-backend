import {
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

@Controller('branches-dishes')
export class BranchesDishesController {

  constructor(private readonly branchesDishesService: BranchesDishesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createBranchDishDto: CreateBranchDishDto) {
    return this.branchesDishesService.create(createBranchDishDto);
  }

  @Get('branch/:id')
  getBranchDishByBranchId(@Param('id', ParseIntPipe) id: number) {
    return this.branchesDishesService.findByBranchId(id);
  }

  @Get('branch/:branchId/category/:categoryId')
  getBranchDishByBranchIdAndCategoryId(@Param('branchId', ParseIntPipe) branchId: number, @Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.branchesDishesService.findByBranchIdAndCategoryId(branchId, categoryId);
  }

  @Get('dish/:id')
  getBranchDishByDishId(@Param('id', ParseIntPipe) id: number) {
    return this.branchesDishesService.findByDishId(id);
  }

  @Get('branch/:id/dish/:id2')
  getBranchDishByBranchIdAndDishId(@Param('id', ParseIntPipe) id: number, @Param('id2', ParseIntPipe) id2: number) {
    return this.branchesDishesService.findByBranchIdAndDishId(id, id2);
  }

  @Get(':id')
  getBranchDishById(@Param('id', ParseIntPipe) id: number) {
    return this.branchesDishesService.findById(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateById(@Param('id', ParseIntPipe) id: number, @Body() updateBranchDishDto: UpdateBranchDishDto) {
    return this.branchesDishesService.updateById(id, updateBranchDishDto);
  }

  @Delete(':id')
  deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.branchesDishesService.deleteById(id);
  }
}
