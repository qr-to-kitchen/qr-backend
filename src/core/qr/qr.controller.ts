import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { QrService } from './qr.service';
import { CreateQrDto } from './dto/create-qr.dto';

@Controller('qr')
export class QrController {

  constructor(private readonly qrService: QrService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createQrDto: CreateQrDto) {
    return this.qrService.create(createQrDto);
  }

  @Get(':id')
  getQrById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: string) {
    return this.qrService.findById(id);
  }

  @Post('regenerate')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  regenerate(@Body() createQrDto: CreateQrDto) {
    return this.qrService.regenerate(createQrDto);
  }
}
