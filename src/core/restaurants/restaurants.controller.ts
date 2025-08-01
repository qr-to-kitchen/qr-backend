import {
  Body,
  Controller, Delete,
  Get,
  Param,
  ParseIntPipe,
  Post, Put,
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

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateById(@Param('id', ParseIntPipe) id: number, @Body() updateRestaurantDto: UpdateRestaurantDto) {
    return this.restaurantsService.updateById(id, updateRestaurantDto);
  }

  @Delete(':id')
  deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantsService.deleteById(id);
  }
}
