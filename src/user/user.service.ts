import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRATION },
      );
      return {
        status: 'success',
        message: 'Login successful',
        data: { token },
      };
    } catch (error) {
      return { status: 'fail', message: 'An error occurred while logging in' };
    }
  }
}
