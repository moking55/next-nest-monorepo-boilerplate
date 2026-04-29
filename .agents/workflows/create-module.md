---
description: Create a NestJS module with TypeORM in backend-redesign app
---

# Create NestJS Module

Follow these steps to create a new NestJS module with TypeORM integration in `apps/backend-redesign`.

> **Important**: This workflow uses `MongoRepository` and UUID primary keys. Check shared-types first for existing interfaces.

## Step 1: Check Shared Types

Before creating the module, check if a shared type exists:

1. Look in `packages/shared-types/src/model/` for existing interface
2. If not found, create `packages/shared-types/src/model/{entity-name}.ts`:

```typescript
export interface {EntityName} {
  id: string;
  // Define properties matching your entity
  createdAt: Date;
  updatedAt: Date;
}
```

3. Export in `packages/shared-types/src/index.ts`

## Step 2: Create Module Directory

Create folder structure:

```
apps/backend-redesign/src/modules/{module-name}/
├── dto/
│   ├── create-{entity-name}.dto.ts
│   └── update-{entity-name}.dto.ts
├── entities/
│   └── {entity-name}.entity.ts
├── {module-name}.controller.ts
├── {module-name}.service.ts
└── {module-name}.module.ts
```

## Step 3: Create Entity

Create `entities/{entity-name}.entity.ts`:

**Basic Entity** (no relations):

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

  @Column({ type: 'varchar' })
  fieldName: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**Entity with Relations**:

```typescript
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Department } from "../../departments/entities/department.entity";
import { Task } from "../../tasks/entities/task.entity";

@Entity("employees")
export class Employee extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  name: string;

  // === ManyToOne Relation ===
  // Store the foreign key explicitly
  @Column({ type: "uuid", nullable: true })
  departmentId: string;

  // Define the relation (eager: false = lazy loading, must use { relations: ['department'] })
  @ManyToOne(() => Department, (department) => department.employees, {
    eager: false,
  })
  @JoinColumn({ name: "departmentId" })
  department: Department;

  // === OneToMany Relation ===
  // Inverse side - no @Column needed, no @JoinColumn needed
  @OneToMany(() => Task, (task) => task.assignee)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**Relation Loading Options**:

| Option                   | How to Use                                                       | When to Use                       |
| ------------------------ | ---------------------------------------------------------------- | --------------------------------- |
| `eager: true`            | Auto-loads relation on every query                               | Small, always-needed relations    |
| `eager: false` (default) | Use `{ relations: ['department'] }` in find options              | Large or optional relations       |
| Lazy loading             | Access via `await entity.department` (requires `Promise<>` type) | Rarely - has performance overhead |

> **Tip**: For BaseServiceOperations, pass relations in the `options` parameter:
>
> ```typescript
> this.findById(id, { relations: ["department", "tasks"] });
> ```

## Step 4: Create DTOs

**Create DTO** (`dto/create-{entity-name}.dto.ts`):

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class Create{EntityName}Dto {
  @ApiProperty({
    description: 'Field description',
    example: 'example-value',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  fieldName: string;
}
```

**Update DTO** (`dto/update-{entity-name}.dto.ts`):

```typescript
import { PartialType } from '@nestjs/swagger';
import { Create{EntityName}Dto } from './create-{entity-name}.dto';

export class Update{EntityName}Dto extends PartialType(Create{EntityName}Dto) {}
```

## Step 5: Create Service

Create `{module-name}.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

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
    private readonly {entity}Repository: MongoRepository<{EntityName}>,
  ) {
    super('{entity}', {entity}Repository);
  }
}
```

## Step 6: Create Controller

Create `{module-name}.controller.ts`:

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
  ApiBearerAuth,
} from '@nestjs/swagger';

import { BaseControllerOperations } from '@/common/utils/base-operation';

import { Create{EntityName}Dto } from './dto/create-{entity-name}.dto';
import { Update{EntityName}Dto } from './dto/update-{entity-name}.dto';
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
  @ApiResponse({ status: 201, description: 'Created successfully' })
  async createOne(@Body() createDto: Create{EntityName}Dto) {
    return super.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all {module-name}' })
  @ApiResponse({ status: 200, description: 'List of all {module-name}' })
  async getAll(@Query('filter') filter?: string) {
    const filterObj = filter ? JSON.parse(filter) : undefined;
    return super.findAll(filterObj);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated {module-name}' })
  @ApiQuery({ name: 'page', required: false, example: '1' })
  @ApiQuery({ name: 'limit', required: false, example: '10' })
  async getPaginated(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('filter') filter?: string,
  ) {
    const filterObj = filter ? JSON.parse(filter) : undefined;
    return super.findPaginated(parseInt(page), parseInt(limit), '{module-name}', filterObj);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get {entity name} by ID' })
  @ApiParam({ name: 'id', description: 'UUID' })
  @ApiResponse({ status: 200, description: 'Found' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async getOne(@Param('id') id: string) {
    return super.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update {entity name} by ID' })
  @ApiParam({ name: 'id', description: 'UUID' })
  async updateOne(@Param('id') id: string, @Body() updateDto: Update{EntityName}Dto) {
    return super.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete {entity name} by ID' })
  @ApiParam({ name: 'id', description: 'UUID' })
  async deleteOne(@Param('id') id: string) {
    return super.remove(id);
  }

  @Post('search')
  @ApiOperation({ summary: 'Search by filter criteria' })
  async searchAll(@Body() filter: Record<string, unknown>) {
    return super.search(filter);
  }
}
```

> **Note**: Use distinct method names (`createOne`, `getAll`, etc.) to avoid shadowing inherited base methods.

## Step 7: Create Module

Create `{module-name}.module.ts`:

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
  exports: [{ModuleName}Service],
})
export class {ModuleName}Module {}
```

## Step 8: Register Module

Add to `src/app.module.ts`:

```typescript
import { {ModuleName}Module } from './modules/{module-name}/{module-name}.module';

@Module({
  imports: [
    // ... existing imports
    {ModuleName}Module,
  ],
})
export class AppModule {}
```

## Naming Conventions

| Placeholder     | Case       | Example       |
| --------------- | ---------- | ------------- |
| `{ModuleName}`  | PascalCase | `Departments` |
| `{EntityName}`  | PascalCase | `Department`  |
| `{entity}`      | camelCase  | `department`  |
| `{module-name}` | kebab-case | `departments` |
| `{entity-name}` | kebab-case | `department`  |
| `{table-name}`  | snake_case | `departments` |
| `{entity name}` | readable   | `department`  |

## Verification

// turbo

1. Run `npm run dev:backend-redesign` to start the server
2. Check Swagger UI at `http://localhost:3000/api` for new endpoints
3. Test CRUD operations via Swagger or API client
