import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}
  public getHello(): Record<string, string> {
    return { message: 'Hello World! API is running.' };
  }

  public getHealth(): Record<string, any> {
    return {
      status: 'ok',
      timestamp: dayjs(),
      uptime: process.uptime(),
      version: this.configService.get<string>('VERSION') || 'N/A',
      version_code: this.configService.get<string>('VERSION_CODENAME') || 'N/A',
    };
  }
}
