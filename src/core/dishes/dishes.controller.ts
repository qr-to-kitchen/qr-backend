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
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('dishes')
export class DishesController {

  constructor(private readonly dishesService: DishesService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  create(@UploadedFile() file: Express.Multer.File, @Body() createDishDto: CreateDishDto) {
    return this.dishesService.create(createDishDto, file);
  }

  @Get('restaurant/:id')
  getDishByRestaurantId(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.dishesService.findByRestaurantId(id);
  }

  @Get(':id')
  getDishById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.dishesService.findById(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updateDishDto: UpdateDishDto) {
    return this.dishesService.updateById(id, updateDishDto);
  }

  @Delete(':id')
  deleteById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.dishesService.deleteById(id);
  }
}
