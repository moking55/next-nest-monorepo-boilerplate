import { Optional } from '@nestjs/common';
import { UserRole } from 'shared-types';
import { Column, Entity, Index } from 'typeorm';

import { BaseCustomEntity } from '../../../common/utils/base-entity';

@Entity('users')
export class UserEntity extends BaseCustomEntity {
  @Column({ length: 255, nullable: false })
  @Index('username_unique', ['username'], { where: 'is_active = true' })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 255 })
  full_name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.ADMIN })
  role: UserRole;

  @Column({ length: 255, nullable: true })
  @Optional()
  phone: string;
}
