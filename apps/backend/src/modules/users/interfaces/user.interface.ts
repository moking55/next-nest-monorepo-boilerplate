import { ApiProperty } from '@nestjs/swagger';

export interface User {
  id: string;
  userId: string;
  password: string;
  name: string;
  expirationDate: Date | null;
}

export class UserResponse implements User {
  @ApiProperty({
    description: 'User unique identifier (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'User ID (unique username)',
    example: 'user123',
  })
  userId: string;

  @ApiProperty({
    description: 'User password (hashed)',
    example: '$2b$10$...',
  })
  password: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'User account expiration date',
    example: '2025-12-31T23:59:59Z',
    nullable: true,
  })
  expirationDate: Date | null;
}
