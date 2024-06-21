import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto, LoginDto } from '../dtos/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginDto) {
    return this.userService.login(loginUserDto.email, loginUserDto.password);
  }
}
