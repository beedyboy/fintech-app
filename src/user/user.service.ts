import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/dtos/user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(
    userData: Partial<User>,
  ): Promise<{ status: string; message: string }> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: userData.email },
      });
      if (existingUser) {
        return { status: 'fail', message: 'Email already in use' };
      }

      const user = this.userRepository.create(userData);
      await this.userRepository.save(user);
      return {
        status: 'success',
        message: 'User registered successfully',
      };
    } catch (error) {
      return {
        status: 'fail',
        message: 'An error occurred while registering the user',
      };
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ status: string; message: string; data?: any }> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        return { status: 'fail', message: 'Invalid email or password' };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return { status: 'fail', message: 'Invalid email or password' };
      }

      const token = await this.generateAccessToken(user);

      return {
        status: 'success',
        message: 'Login successful',
        data: { token },
      };
    } catch (error) {
      return { status: 'fail', message: 'An error occurred while logging in' };
    }
  }

  async generateAccessToken(user: Partial<User>) {
    const { id, firstName, lastName, email } = user;

    const payload: IUser = {
      id,
      firstName,
      lastName,
      email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION'),
    });

    return accessToken;
  }
}
