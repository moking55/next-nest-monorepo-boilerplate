import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from 'shared-types';

export class CreateUserDto {
  @ApiProperty({
    name: 'username',
    description: 'Username (unique)',
    example: 'user123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({
    description: 'User password',
    example: 'securePassword123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    name: 'name',
    description: 'User full name',
    example: 'John Doe',
  })
  @Expose({ name: 'name' })
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiProperty({
    description: 'User role',
    example: 'admin',
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({
    description: 'User account expiration date',
    example: '2025-12-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expirationDate?: Date;
}
