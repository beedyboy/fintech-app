import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        JwtService,
        ConfigService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new user', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);
    jest.spyOn(repository, 'create').mockReturnValue({} as User);
    jest.spyOn(repository, 'save').mockResolvedValue({} as User);

    const user = await service.register({
      email: 'boladebode@gmail.com',
      firstName: 'Bolade',
      lastName: 'Akinniyi',
      password: 'password123',
    });

    expect(user.status).toBe('success');
    expect(user.message).toBe('User registered successfully');
  });

  it('should fail to register a user with an existing email', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue({} as User);

    const response = await service.register({
      email: 'boladebode@gmail.com',
      firstName: 'Joseph',
      lastName: 'Smith',
      password: 'password123',
    });

    expect(response.status).toBe('fail');
    expect(response.message).toBe('Email already in use');
  });

  it('should login and return a jwt token', async () => {
    const mockUser = {
      id: 1,
      email: 'boladebode@gmail.com',
      password: 'hashedpassword123',
    };

    jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser as User);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      if (key === 'JWT_ACCESS_SECRET') return 'testsecret';
      if (key === 'JWT_ACCESS_EXPIRATION') return '1h';
    });

    const token = 'mockJwtToken';
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue(token);

    const response = await service.login('boladebode@gmail.com', 'password123');

    expect(response.status).toBe('success');
    expect(response.message).toBe('Login successful');
    expect(response.data).toHaveProperty('token', token);
  });

  it('should fail to login with invalid credentials', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    const response = await service.login('boladebode@gmail.com', 'password');

    expect(response.status).toBe('fail');
    expect(response.message).toBe('Invalid email or password');
  });
});
