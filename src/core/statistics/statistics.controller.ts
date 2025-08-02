import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {

  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('most-ordered-dishes-by-branch/:id')
  getMostOrderedDishes(@Param('id', ParseIntPipe) id: number) {
    return this.statisticsService.getMostOrderedDishes(id);
  }
}