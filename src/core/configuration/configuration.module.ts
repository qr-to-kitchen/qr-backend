import { Module } from '@nestjs/common';
import { ConfigurationController } from './configuration.controller';
import { ConfigurationService } from './configuration.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from './configuration.entity';
import { Restaurant } from '../restaurants/restaurants.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Configuration, Restaurant])
  ],
  controllers: [ConfigurationController],
  providers: [ConfigurationService]
})
export class ConfigurationModule {}
