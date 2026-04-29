import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { AuthResponse } from 'shared-types';

import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { username, password } = loginDto;

    if (!username || !password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username, role: user.role };

    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
        phone: user.phone || null,
      },
    };
  }
}
