import { Injectable, NotFoundException } from '@nestjs/common';
import { Configuration } from './configuration.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from '../restaurants/restaurants.entity';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

@Injectable()
export class ConfigurationService {
  
  constructor(
    @InjectRepository(Configuration)
    private configurationRepository: Repository<Configuration>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>
  ) {}
  
  async create(createConfigurationDto: CreateConfigurationDto) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: createConfigurationDto.restaurantId }
    });
    if (!restaurant) {
      throw new NotFoundException({
        message: ['Restaurante no encontrado.'],
        error: "Bad Request",
        statusCode: 404
      });
    }
    
    const newConfiguration = this.configurationRepository.create({
      primaryColor: createConfigurationDto.primaryColor,
      primaryFont: createConfigurationDto.primaryFont,
      restaurant: restaurant
    });

    const savedConfiguration = await this.configurationRepository.save(newConfiguration);

    return { configuration: savedConfiguration };
  }
  
  async findByRestaurantId(restaurantId: number) {
    const configuration = await this.configurationRepository.findOne({
      where: { restaurant: { id: restaurantId } }
    });
    if (!configuration) {
      throw new NotFoundException({
        message: ['Configuración no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { configuration };
  }

  async findById(id: number) {
    const configuration = await this.configurationRepository.findOneBy({
      id
    });
    if (!configuration) {
      throw new NotFoundException({
        message: ['Configuración no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { configuration };
  }
  
  async updateById(id: number, updateConfigurationDto: UpdateConfigurationDto) {
    const configuration = await this.configurationRepository.findOneBy({
      id
    });
    if (!configuration) {
      throw new NotFoundException({
        message: ['Configuración no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    await this.configurationRepository.update(id, updateConfigurationDto);

    return this.findById(id);
  }
  
  async deleteById(id: number) {
    const result = await this.configurationRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException({
        message: ['Configuración no encontrada.'],
        error: 'Not Found',
        statusCode: 404
      });
    } else {
      return {
        message: 'Configuración eliminada correctamente.'
      }
    }
  }
}
