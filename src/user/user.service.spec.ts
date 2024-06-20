import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
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
    jest.spyOn(jwt, 'sign').mockImplementation(() => {});

    process.env.JWT_ACCESS_SECRET = 'testsecret';
    process.env.JWT_ACCESS_EXPIRATION = '1h';

    const response = await service.login('boladebode@gmail.com', 'password123');

    expect(response.status).toBe('success');
    expect(response.message).toBe('Login successful');
    expect(response.data).toHaveProperty('token');
  });

  it('should fail to login with invalid credentials', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    const response = await service.login('boladebode@gmail.com', 'password');

    expect(response.status).toBe('fail');
    expect(response.message).toBe('Invalid email or password');
  });
});
