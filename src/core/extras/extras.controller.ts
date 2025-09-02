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
import { BulkSaveExtraBranchDishes } from './dto/bulk-save-extra-branch-dishes';
import { BulkSaveExtraBranches } from './dto/bulk-save-extra-branches';

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

  @Get('restaurant/:restaurantId/no-branch/:branchId')
  getExtraByRestaurantIdAndNotBranchId(@Param('restaurantId', ParseIntPipe) restaurantId: number, @Param('branchId', ParseIntPipe) branchId: number) {
    return this.extrasService.findByRestaurantIdAndNotBranchId(restaurantId, branchId);
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

  @Get('extraBranchDish/branchDish/:id')
  getExtraBranchDishByBranchId(@Param('id', ParseIntPipe) id: number) {
    return this.extrasService.findByBranchDishId(id);
  }

  @Post('bulk-save')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  bulkSave(@Body() bulkSaveExtraBranchDishes: BulkSaveExtraBranchDishes) {
    return this.extrasService.bulkSave(bulkSaveExtraBranchDishes);
  }

  @Post('bulk-save/extra-branches')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  bulkSaveExtraBranch(@Body() bulkSaveExtraBranches: BulkSaveExtraBranches) {
    return this.extrasService.bulkSaveExtraBranch(bulkSaveExtraBranches);
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
