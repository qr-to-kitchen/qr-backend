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
import { CreateExtraBranchDto } from './dto/create-extra-branch.dto';
import { UpdateExtraBranchDishDto } from './dto/update-extra-branch-dish.dto';

@Controller('extras')
export class ExtrasController {

  constructor(private readonly extrasService: ExtrasService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createExtra(@Body() createExtraDto: CreateExtraDto) {
    return this.extrasService.createExtra(createExtraDto);
  }

  @Post('branch')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createExtraBranch(@Body() createExtraBranchDto: CreateExtraBranchDto) {
    return this.extrasService.createExtraBranch(createExtraBranchDto);
  }

  @Post('branch-dish')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createExtraBranchDish(@Body() createExtraBranchDishDto: CreateExtraBranchDishDto) {
    return this.extrasService.createExtraBranchDish(createExtraBranchDishDto);
  }

  @Get('restaurant/:id')
  getExtraByRestaurantId(@Param('id', ParseIntPipe) id: number) {
    return this.extrasService.findByRestaurantId(id);
  }

  @Get('extraBranch/branch/:id')
  getExtraBranchByBranchId(@Param('id', ParseIntPipe) id: number) {
    return this.extrasService.findByBranchId(id);
  }

  @Get('extra/:extraId/branch/:branchId')
  getExtraBranchByExtraIdAndBranchId(@Param('extraId', ParseIntPipe) extraId: number, @Param('branchId', ParseIntPipe) branchId: number) {
    return this.extrasService.findByExtraIdAndBranchId(extraId, branchId);
  }

  @Get('extraBranch/:extraBranchId/branchDish/:branchDishId')
  getExtraBranchDishByExtraBranchIdAndBranchDishId(@Param('extraBranchId', ParseIntPipe) extraBranchId: number, @Param('branchDishId', ParseIntPipe) branchDishId: number) {
    return this.extrasService.findByExtraBranchIdAndBranchDishId(extraBranchId, branchDishId);
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

  @Put('branch-dish/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateExtraBranchDishById(@Param('id', ParseIntPipe) id: number, @Body() updateExtraBranchDishDto: UpdateExtraBranchDishDto) {
    return this.extrasService.updateExtraBranchDishById(id, updateExtraBranchDishDto);
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
