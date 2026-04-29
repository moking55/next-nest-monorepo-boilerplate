import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

import { AppService } from './app.service';
import { createSuccessResponse } from './common/utils/http-response';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public getHello(@Res() res: Response) {
    const message = this.appService.getHello();
    return res.status(HttpStatus.OK).json(message);
  }

  @Get('health')
  public getHealth(@Res() res: Response) {
    const healthCheck = this.appService.getHealth();
    return res
      .status(HttpStatus.OK)
      .json(createSuccessResponse('app', healthCheck));
  }
}
