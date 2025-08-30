import { Module } from '@nestjs/common';
import { QrController } from './qr.controller';
import { QrService } from './qr.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Qr } from './qr.entity';
import { Branch } from '../branches/branches.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Qr, Branch])
  ],
  controllers: [QrController],
  providers: [QrService]
})
export class QrModule {}
