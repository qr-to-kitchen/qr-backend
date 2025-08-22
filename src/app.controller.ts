import {
  Controller,
  Get,
} from '@nestjs/common';

@Controller()
export class AppController {

  @Get('version')
  getVersion() {
    return {
      version: '1.2.0'
    };
  }
}
