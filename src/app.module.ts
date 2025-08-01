import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './core/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SocketModule } from './socket/socket.module';
import { RestaurantsModule } from './core/restaurants/restaurants.module';
import { BranchesModule } from './core/branches/branches.module';
import { DishesModule } from './core/dishes/dishes.module';
import { BranchesDishesModule } from './core/branches-dishes/branches-dishes.module';
import { OrderModule } from './core/order/order.module';
import { ConfigurationModule } from './core/configuration/configuration.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    SocketModule,
    RestaurantsModule,
    BranchesModule,
    DishesModule,
    BranchesDishesModule,
    OrderModule,
    ConfigurationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
