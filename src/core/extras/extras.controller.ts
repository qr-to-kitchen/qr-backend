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
import { ExtrasService } from './extras.service';
import { CreateExtraDto } from './dto/create-extra.dto';
import { CreateExtraBranchDishDto } from './dto/create-extra-branch-dish.dto';
import { UpdateExtraDto } from './dto/update-extra.dto';

@Controller('extras')
export class ExtrasController {

  constructor(private readonly extrasService: ExtrasService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createExtra(@Body() createExtraDto: CreateExtraDto) {
    return this.extrasService.createExtra(createExtraDto);
  }

  @Post('branch-dish')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createExtraBranchDish(@Body() createExtraBranchDishDto: CreateExtraBranchDishDto) {
    return this.extrasService.createExtraBranchDish(createExtraBranchDishDto);
  }

  @Get('branch/:id')
  getExtraByBranchId(@Param('id', ParseIntPipe) id: number) {
    return this.extrasService.findByBranchId(id);
  }

  @Get('branch-dish/:id')
  getExtraBranchDishByBranchId(@Param('id', ParseIntPipe) id: number) {
    return this.extrasService.findByBranchDishId(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateExtraById(@Param('id', ParseIntPipe) id: number, @Body() updateExtraDto: UpdateExtraDto) {
    return this.extrasService.updateExtraById(id, updateExtraDto);
  }

  @Delete(':id')
  deleteExtraById(@Param('id', ParseIntPipe) id: number) {
    return this.extrasService.deleteExtraById(id);
  }

  @Delete('branch-dish/:id')
  deleteExtraBranchDishById(@Param('id', ParseIntPipe) id: number) {
    return this.extrasService.deleteExtraBranchDishById(id);
  }
}
