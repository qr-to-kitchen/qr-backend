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
import { ConfigurationService } from './configuration.service';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

@Controller('configuration')
export class ConfigurationController {

  constructor(private readonly configurationService: ConfigurationService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createConfigurationDto: CreateConfigurationDto) {
    return this.configurationService.create(createConfigurationDto);
  }

  @Get('restaurant/:id')
  getConfigurationByRestaurantId(@Param('id', ParseIntPipe) id: number) {
    return this.configurationService.findByRestaurantId(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateById(@Param('id', ParseIntPipe) id: number, @Body() updateConfigurationDto: UpdateConfigurationDto) {
    return this.configurationService.updateById(id, updateConfigurationDto);
  }

  @Delete(':id')
  deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.configurationService.deleteById(id);
  }
}
