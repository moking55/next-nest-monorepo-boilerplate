import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseServiceOperations } from '@/common/utils/base-operation';

import { ProductEntity } from './entities/product.entity';

import type { CreateProductDto } from './dto/create-product.dto';
import type { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService extends BaseServiceOperations<
  ProductEntity,
  CreateProductDto,
  UpdateProductDto
> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {
    super('Product', productRepository);
  }
}
