---
agent: agent
description: This prompt is used to create a NestJS module template with TypeORM integration, including entity, DTOs, service, controller, and module files.
---

Create a module following this template:

````markdown
# NestJS Module Template (TypeORM)

## Directory Structure
```
src/modules/{module-name}/
├── dto/
│   ├── create-{entity-name}.dto.ts
│   └── update-{entity-name}.dto.ts
├── entities/
│   └── {entity-name}.entity.ts
├── {module-name}.controller.ts
├── {module-name}.service.ts
└── {module-name}.module.ts
```

## File Templates

### 1. Entity: `entities/{entity-name}.entity.ts`
```typescript
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('{table-name}')
export class {EntityName} extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  uniqueField: string;

  @Column({ type: 'varchar' })
  field: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 2. Create DTO: `dto/create-{entity-name}.dto.ts`
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class Create{EntityName}Dto {
  @ApiProperty({
    description: 'Unique field description',
    example: 'example-value',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  uniqueField: string;

  @ApiProperty({
    description: 'Field description',
    example: 'example-value',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  field: string;
}
```

### 3. Update DTO: `dto/update-{entity-name}.dto.ts`
```typescript
import { PartialType } from '@nestjs/swagger';
import { Create{EntityName}Dto } from './create-{entity-name}.dto';

export class Update{EntityName}Dto extends PartialType(
  Create{EntityName}Dto,
) {}
```

### 4. Service: `{module-name}.service.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseServiceOperations } from '@/common/utils/base-operation';

import { {EntityName} } from './entities/{entity-name}.entity';
import type { Create{EntityName}Dto } from './dto/create-{entity-name}.dto';
import type { Update{EntityName}Dto } from './dto/update-{entity-name}.dto';

@Injectable()
export class {ModuleName}Service extends BaseServiceOperations<
  {EntityName},
  Create{EntityName}Dto,
  Update{EntityName}Dto
> {
  constructor(
    @InjectRepository({EntityName})
    private readonly {entity}Repository: Repository<{EntityName}>,
  ) {
    super('{entity}', {entity}Repository);
  }
}
```

### 5. Controller: `{module-name}.controller.ts`
```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import { BaseControllerOperations } from '@/common/utils/base-operation';

import { Create{EntityName}Dto } from './dto/create-{entity-name}.dto';
import { Update{EntityName}Dto } from './dto/update-{entity-name}.dto';
import { {EntityName} } from './entities/{entity-name}.entity';
import { {ModuleName}Service } from './{module-name}.service';

@ApiTags('{module-name}')
@ApiBearerAuth()
@Controller('{module-name}')
export class {ModuleName}Controller extends BaseControllerOperations<
  {ModuleName}Service,
  Create{EntityName}Dto,
  Update{EntityName}Dto
> {
  constructor(private readonly {entity}Service: {ModuleName}Service) {
    super({entity}Service, '{module-name}');
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new {entity name}' })
  @ApiResponse({
    status: 201,
    description: '{Ent successfully created',
    type: {EntityName}Response,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or validation error',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: Record with unique field already exists',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async create(@Body() createDto: Create{EntityName}Dto) {
    return this.create(createDto);
  }

  @Post('search')
  @ApiOperation({ summary: 'Search {module-name} by filter criteria' })
  @ApiResponse({
    status: 200,
    description: 'Search results',
    type: [{EntityName}],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid filter criteria',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async search(@Body() filter: Record<string, unknown>) {
    return this.search(filter);
  }

  @Get()
  @ApiOperation({ summary: 'Get all {module-name}' })
  @ApiQuery({
    name: 'filter',
    required: false,
    description: 'Filter criteria as JSON string',
    example: '{}',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all {module-name}',
    type: [{EntityName}],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findAll(@Query('filter') filter?: string) {
    const filterObj = filter ? JSON.parse(filter) : undefined;
    return this.findAll(filterObj);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated {module-name}' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (starting from 1)',
    example: '1',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of records per page',
    example: '10',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    description: 'Filter criteria as JSON string',
    example: '{}',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of {module-name}',
    type: [{EntityName}],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid pagination parameters',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findPaginated(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('filter') filter?: string,
  ) {
    const filterObj = filter ? JSON.parse(filter) : undefined;
    return this.findPaginated(
      parseInt(page),
      parseInt(limit),
      '{module-name}',
      filterObj,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get {entity name} by ID' })
  @ApiParam({
    name: 'id',
    description: '{EntityName} ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: '{EntityName} found',
    type: {EntityName},
  })
  @ApiResponse({
    status: 404,
    description: '{EntityName} not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findOne(@Param('id') id: string) {
    return this.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update {entity name} by ID' })
  @ApiParam({
    name: 'id',
    description: '{EntityName} ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: '{EntityName} successfully updated',
    type: {EntityName},
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or validation error',
  })
  @ApiResponse({
    status: 404,
    description: '{EntityName} not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: Record with unique field already exists',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: Update{EntityName}Dto,
  ) {
    return this.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete {entity name} by ID' })
  @ApiParam({
    name: 'id',
    description: '{EntityName} ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: '{EntityName} successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: '{EntityName} not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async remove(@Param('id') id: string) {
    return this.remove(id);
  }
}
```

### 6. Module: `{module-name}.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { {EntityName} } from './entities/{entity-name}.entity';
import { {ModuleName}Controller } from './{module-name}.controller';
import { {ModuleName}Service } from './{module-name}.service';

@Module({
  imports: [TypeOrmModule.forFeature([{EntityName}])],
  controllers: [{ModuleName}Controller],
  providers: [{ModuleName}Service],
})
export class {ModuleName}Module {}
```

## Usage Instructions

1. **Replace placeholders** in all files:
   - `{ModuleName}` → PascalCase module name (e.g., `Users`, `Products`)
   - `{EntityName}` → PascalCase entity name (e.g., `User`, `Product`)
   - `{entity}` → camelCase entity name (e.g., `user`, `product`)
   - `{module-name}` → kebab-case module name (e.g., `users`, `products`)
   - `{entity-name}` → kebab-case entity name (e.g., `user`, `product`)
   - `{table-name}` → snake_case table name (e.g., `users`, `products`)
   - `{entity name}` → readable name (e.g., `user`, `product`)

2. **Features included**:
   - UUID primary keys
   - Unique constraint with TypeORM auto-generation
   - Timestamp tracking (createdAt, updatedAt) via decorators
   - Swagger/OpenAPI documentation with @ApiBearerAuth
   - Pagination support
   - Search/filter functionality
   - Proper error handling via global exception filter
   - JSON:API-style responses via BaseServiceOperations
   - Class validation via class-validator

3. **TypeORM entity considerations**:
   - Extend BaseEntity for repository methods
   - Use PrimaryGeneratedColumn('uuid') for auto-generation
   - Apply unique constraints at Column decorator level
   - Use CreateDateColumn and UpdateDateColumn for automatic timestamps
   - Import entity type interfaces from shared-types when applicable

4. **Service integration**:
   - Extend BaseServiceOperations<Entity, CreateDto, UpdateDto>
   - Pass 'entity' name (singular, lowercase) to super() constructor
   - Inject the TypeORM Repository with @InjectRepository decorator
   - Keep service methods minimal; base class handles CRUD operations

5. **Controller integration**:
   - Extend BaseControllerOperations<Service, CreateDto, UpdateDto>
   - Pass service instance and 'module-name' (kebab-case) to super() constructor
   - Add @ApiBearerAuth() for API authentication
    - Call inherited methods: create(), findAll(), findOne(), findPaginated(), update(), remove(), search()
    - Important: Inspect the base classes (`BaseControllerOperations` and `BaseServiceOperations`) before adding controller methods to avoid naming collisions. If a controller method uses the same name as an inherited method (for example `create`, `update`, `findOne`, `remove`, `search`, `findAll`, `findPaginated`), it will shadow the base implementation and calls like `this.create()` will recurse into the subclass.
      - Recommendation: prefer distinct controller method names such as `create{EntityName}`, `search{ModuleName}`, `get{EntityName}ById`, `update{EntityName}`, `delete{EntityName}` so they can safely call the inherited helpers (e.g., `return this.create(createDto)` will call the base method when the subclass does not declare `create`).
      - Alternative: if you must keep the same method name, explicitly call the base implementation with `super.create(...)` or call the service directly with `this.service.create(...)` to avoid recursion.
   - Document each endpoint with @ApiOperation and @ApiResponse

6. **Register module** in `app.module.ts`:
   ```typescript
   import { {ModuleName}Module } from './modules/{module-name}/{module-name}.module';
   
   @Module({
     imports: [{ModuleName}Module],
   })
   export class AppModule {}
   ```
   
7. **TypeORM auto-sync**:
   - Entities are auto-discovered and auto-synced when `synchronize: true`
   - No manual migration needed for development
   - For production, use TypeORM migrations via `npm run migration:generate
