import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { BranchesDishesService } from './branches-dishes.service';
import { CreateBranchDishDto } from './dto/create-branch-dish.dto';

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

  @Get('dish/:id')
  getBranchDishByDishId(@Param('id', ParseIntPipe) id: number) {
    return this.branchesDishesService.findByDishId(id);
  }

  @Get(':id')
  getBranchDishById(@Param('id', ParseIntPipe) id: number) {
    return this.branchesDishesService.findById(id);
  }

  @Delete(':id')
  deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.branchesDishesService.deleteById(id);
  }
}
