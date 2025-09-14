import {
  Controller,
  Get,
} from '@nestjs/common';

@Controller()
export class AppController {

  @Get('version')
  getVersion() {
    return {
      version: '2.6.0'
    };
  }
}
