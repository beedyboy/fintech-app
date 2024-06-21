import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto, LoginDto } from 'src/dtos/userdto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a new user', async () => {
    const result = {
      status: 'success',
      message: 'User registered successfully',
    };
    jest.spyOn(service, 'register').mockResolvedValue(result);

    const createUserDto: CreateUserDto = {
      email: 'boladebode@gmail.com',
      firstName: 'Bolade',
      lastName: 'Akinniyi',
      password: 'password123',
    };

    expect(await controller.register(createUserDto)).toBe(result);
  });

  it('should fail to register a user with an existing email', async () => {
    const result = { status: 'fail', message: 'Email already in use' };
    jest.spyOn(service, 'register').mockResolvedValue(result);

    const createUserDto: CreateUserDto = {
      email: 'boladebode@gmail.com',
      firstName: 'Joseph',
      lastName: 'Smith',
      password: 'password123',
    };

    expect(await controller.register(createUserDto)).toBe(result);
  });

  it('should login and return a jwt token', async () => {
    const result = {
      status: 'success',
      message: 'Login successful',
      data: { token: 'token' },
    };
    jest.spyOn(service, 'login').mockResolvedValue(result);

    const loginUserDto: LoginDto = {
      email: 'boladebode@gmail.com',
      password: 'password123',
    };

    expect(await controller.login(loginUserDto)).toBe(result);
  });

  it('should fail to login with invalid credentials', async () => {
    const result = { status: 'fail', message: 'Invalid email or password' };
    jest.spyOn(service, 'login').mockResolvedValue(result);

    const loginUserDto: LoginDto = {
      email: 'boladebode@gmail.com',
      password: 'password',
    };

    expect(await controller.login(loginUserDto)).toBe(result);
  });
});
