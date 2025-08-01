import {
  Body,
  Controller, Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';

@Controller('restaurants')
export class RestaurantsController {

  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantsService.create(createRestaurantDto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  getMyRestaurant(@Request() req: any) {
    return this.restaurantsService.findByUserId(req.user.id);
  }

  @Get('user/:id')
  getRestaurantByUserId(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantsService.findByUserId(id);
  }

  @Get(':id')
  getRestaurantById(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantsService.findById(id);
  }

  @Get()
  getAll() {
    return this.restaurantsService.getAll();
  }

  @Delete(':id')
  deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantsService.deleteById(id);
  }
}
