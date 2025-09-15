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
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CreateRestaurantUserDto } from './dto/create-restaurant-user.dto';

@Controller('restaurants')
export class RestaurantsController {

  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantsService.create(createRestaurantDto);
  }

  @Post('restaurant-user')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createRestaurantWithUser(@Body() createRestaurantUserDto: CreateRestaurantUserDto) {
    return this.restaurantsService.createRestaurantWithUser(createRestaurantUserDto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  getMyRestaurant(@Request() req: any) {
    return this.restaurantsService.findByUserId(req.user.id);
  }

  @Get('user/:id')
  getRestaurantByUserId(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.restaurantsService.findByUserId(id);
  }

  @Get(':id')
  getRestaurantById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.restaurantsService.findById(id);
  }

  @Get()
  getAll() {
    return this.restaurantsService.getAll();
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updateRestaurantDto: UpdateRestaurantDto) {
    return this.restaurantsService.updateById(id, updateRestaurantDto);
  }

  @Delete(':id')
  deleteById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number) {
    return this.restaurantsService.deleteById(id);
  }
}
