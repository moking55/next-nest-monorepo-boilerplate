import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import type { LoginRequest } from 'shared-types';

export class LoginDto implements LoginRequest {
  @ApiProperty({ description: 'The username', example: 'admin' })
  @IsNotEmpty()
  @IsString()
  username?: string;

  @ApiProperty({ description: 'The password', example: 'password' })
  @IsNotEmpty()
  @IsString()
  password?: string;
}
