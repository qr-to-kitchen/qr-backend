import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
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
}
