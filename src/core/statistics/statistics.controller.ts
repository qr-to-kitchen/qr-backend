import { Controller, Get, Param, ParseIntPipe, Query, ValidationPipe } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('statistics')
export class StatisticsController {

  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('most-ordered-dishes-by-branch/:id/date-range')
  @ApiQuery({ name: 'startDate', type: Date, required: true })
  @ApiQuery({ name: 'endDate', type: Date, required: true })
  getMostOrderedDishes(
    @Param('id', ParseIntPipe) id: number,
    @Query('startDate', new ValidationPipe({ transform: true })) startDate: Date,
    @Query('endDate', new ValidationPipe({ transform: true })) endDate: Date
  ) {
    return this.statisticsService.getMostOrderedDishesByBranchAndDateRange(id, startDate, endDate);
  }

  @Get('orders-by-branch/:id/date-range')
  @ApiQuery({ name: 'startDate', type: Date, required: true })
  @ApiQuery({ name: 'endDate', type: Date, required: true })
  getOrdersByBranchAndDateRange(
    @Param('id', ParseIntPipe) id: number,
    @Query('startDate', new ValidationPipe({ transform: true })) startDate: Date,
    @Query('endDate', new ValidationPipe({ transform: true })) endDate: Date
  ) {
    return this.statisticsService.getOrdersByBranchAndDateRange(id, startDate, endDate);
  }
}