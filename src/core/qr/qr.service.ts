import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Qr } from './qr.entity';
import { CreateQrDto } from './dto/create-qr.dto';
import { Branch } from '../branches/branches.entity';
import * as QRCode from 'qrcode';

@Injectable()
export class QrService {

  constructor(
    @InjectRepository(Qr)
    private qrRepository: Repository<Qr>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>
  ) {}

  async create(createQrDto: CreateQrDto) {
    const branch = await this.branchRepository.findOne({
      where: { id: createQrDto.branchId }
    });
    if (!branch) {
      throw new NotFoundException({
        message: ['Sede no encontrada.'],
        error: "Bad Request",
        statusCode: 404
      });
    }

    const qrExisting = await this.qrRepository.findOne({
      where: [{ branchId: createQrDto.branchId, tableNumber: createQrDto.tableNumber }],
    });
    if (qrExisting) {
      throw new BadRequestException({
        message: ['Qr ya creado.'],
        error: "Bad Request",
        statusCode: 400
      });
    }

    const qr = this.qrRepository.create({
      tableNumber: createQrDto.tableNumber,
      branchId: branch.id
    });

    const savedQr = await this.qrRepository.save(qr);

    const url = `${process.env.FRONT_DOMAIN}/r/${savedQr.id}`;
    const qrCode = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 2,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    return { qr: savedQr, qrCode };
  }

  async findById(id: string) {
    const qr = await this.qrRepository.findOneBy({
      id
    });
    if (!qr) {
      throw new NotFoundException({
        message: ['QR no encontrado.'],
        error: 'Not Found',
        statusCode: 404
      });
    }

    return { qr };
  }

  async regenerate(createQrDto: CreateQrDto) {
    const branch = await this.branchRepository.findOne({
      where: { id: createQrDto.branchId }
    });
    if (!branch) {
      throw new NotFoundException({
        message: ['Sede no encontrada.'],
        error: "Bad Request",
        statusCode: 404
      });
    }

    const qr = await this.qrRepository.findOne({
      where: { branchId: branch.id, tableNumber: createQrDto.tableNumber }
    });
    if (!qr) {
      throw new NotFoundException({
        message: ['QR no encontrado.'],
        error: 'Not Found',
      })
    }

    const url = `${process.env.FRONT_DOMAIN}/r/${qr.id}`;
    const qrCode = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 2,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    return { qrCode };
  }
}
