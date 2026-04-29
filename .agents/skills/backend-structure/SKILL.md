---
name: backend-structure
description: Create a NestJS module structure following the "features" pattern (Controller -> Service -> Entity/DTO).
author: Antigravity
---

# Backend Structure Skill

This skill defines the strict architectural pattern for `apps/backend` modules in the monorepo.

## 1. Module Structure

Each feature (e.g., `users`, `products`) is a self-contained module at `apps/backend/src/modules/[feature]`.

```
[feature]/
├── dto/
│   ├── create-[feature].dto.ts
│   └── update-[feature].dto.ts
├── entities/
│   └── [feature].entity.ts
├── enum/ (Optional)
│   └── [feature]-type.enum.ts
├── interfaces/ (Optional)
│   └── [feature].interface.ts
├── [feature].controller.ts
├── [feature].module.ts
└── [feature].service.ts
```

## 2. Controller (`[feature].controller.ts`)

- **Inheritance**: Must extend `BaseControllerOperations`.
- **Decorators**: `@Controller('[feature]')`, `@ApiTags('[feature]')`.
- **Swagger**: Explicit `@ApiOperation` and `@ApiResponse` for all endpoints.

```typescript
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BaseControllerOperations } from '@/common/utils/base-operation';
import { [Feature]Service } from './[feature].service';
import { Create[Feature]Dto } from './dto/create-[feature].dto';
import { Update[Feature]Dto } from './dto/update-[feature].dto';
import { [Feature]Entity } from './entities/[feature].entity';

@ApiTags('[feature]s')
@Controller('[feature]s')
export class [Feature]Controller extends BaseControllerOperations<
  [Feature]Entity,
  Create[Feature]Dto,
  Update[Feature]Dto,
  [Feature]Service
> {
  constructor(private readonly service: [Feature]Service) {
    super(service, '[feature]');
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new [feature]' })
  async create(@Body() createDto: Create[Feature]Dto) {
    return super.create(createDto);
  }

  // Override other methods (findAll, findOne, update, remove) as needed
}
```

## 3. Service (`[feature].service.ts`)

- **Inheritance**: Must extend `BaseServiceOperations`.
- **Injection**: Inject `Start[Feature]Entity` repository.
- **Business Logic**: Handle unique constraints, data mapping, and validation here.

```typescript
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseServiceOperations } from '@/common/utils/base-operation';
import { [Feature]Entity } from './entities/[feature].entity';
import { Create[Feature]Dto } from './dto/create-[feature].dto';
import { Update[Feature]Dto } from './dto/update-[feature].dto';

@Injectable()
export class [Feature]Service extends BaseServiceOperations<
  [Feature]Entity,
  Create[Feature]Dto,
  Update[Feature]Dto
> {
  constructor(
    @InjectRepository([Feature]Entity)
    private readonly repository: Repository<[Feature]Entity>,
  ) {
    super('[Feature]', repository);
  }

  // Override create/update to add business logic
}
```

## 4. Entity (`entities/[feature].entity.ts`)

- **Base**: Extend `BaseCustomEntity` (or `BaseEntity`).
- **Decorators**: `@Entity('[table_name]')`, `@Column`, `@Index`.

```typescript
import { Column, Entity, Index } from 'typeorm';
import { BaseCustomEntity } from '../../../common/utils/base-entity';

@Entity('[feature]s')
export class [Feature]Entity extends BaseCustomEntity {
  @Column({ length: 255 })
  @Index({ unique: true })
  name: string;

  // Add other columns
}
```

## 5. DTOs (`dto/create-[feature].dto.ts`)

- **Validation**: Use `class-validator` (`@IsString`, `@IsNotEmpty`).
- **Swagger**: Use `@ApiProperty` for automatic documentation.
- **Transformation**: Use `class-transformer` (`@Expose`, `@Type`) if needed.

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class Create[Feature]Dto {
  @ApiProperty({ example: 'Feature Name' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
```

## 6. Module (`[feature].module.ts`)

- **Imports**: `TypeOrmModule.forFeature([[Feature]Entity])`.
- **Providers/Exports**: `[Feature]Service`.
- **Controllers**: `[Feature]Controller`.

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { [Feature]Entity } from './entities/[feature].entity';
import { [Feature]Controller } from './[feature].controller';
import { [Feature]Service } from './[feature].service';

@Module({
  imports: [TypeOrmModule.forFeature([[Feature]Entity])],
  controllers: [[Feature]Controller],
  providers: [[Feature]Service],
  exports: [[Feature]Service],
})
export class [Feature]Module {}
```
