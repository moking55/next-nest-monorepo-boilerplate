import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { BaseServiceOperations } from '@/common/utils/base-operation';

import { UserEntity } from './entities/user.entity';

import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService extends BaseServiceOperations<
  UserEntity,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super('User', userRepository);
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { username },
    });
  }

  async create(createDto: CreateUserDto): Promise<{
    message: string;
    data: UserEntity;
  }> {
    // Check for unique username
    const existing = await this.userRepository.findOne({
      where: { username: createDto.username },
    });

    if (existing) {
      throw new ConflictException('Username already exists');
    }

    // Hash password & Map DTO to Entity
    const hashedPassword = await bcrypt.hash(createDto.password, 10);
    const newUser = this.userRepository.create({
      ...createDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);

    return {
      message: 'Create new User successfully',
      data: savedUser,
    };
  }

  async update(
    id: string,
    updateDto: UpdateUserDto,
  ): Promise<{
    message: string;
    data: UserEntity | null;
  }> {
    const record = await this.userRepository.findOne({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException('User not found');
    }

    // Check for username conflicts if updating
    if (updateDto.username && updateDto.username !== record.username) {
      const existing = await this.userRepository.findOne({
        where: { username: updateDto.username },
      });

      if (existing) {
        throw new ConflictException('Username already exists');
      }
    }

    if (updateDto.password) {
      updateDto.password = await bcrypt.hash(updateDto.password, 10);
    }

    await this.userRepository.update({ id }, updateDto);

    const updatedUser = await this.userRepository.findOne({
      where: { id },
    });

    return {
      message: 'User updated successfully',
      data: updatedUser as UserEntity,
    };
  }
}
