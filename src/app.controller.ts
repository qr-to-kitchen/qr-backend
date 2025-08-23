import {
  Controller,
  Get,
} from '@nestjs/common';

@Controller()
export class AppController {

  @Get('version')
  getVersion() {
    const x: number = "texto";
    return {
      version: '1.2.0'
    };
  }
}
