import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDto, LoginDto } from '../src/dtos/user.dto';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/user/register (POST)', async () => {
    const createUserDto: CreateUserDto = {
      email: 'boladebode@gmail.com',
      password: 'password123',
      firstName: 'Bolade',
      lastName: 'Akinniyi',
    };

    const response = await request(app.getHttpServer())
      .post('/user/register')
      .send(createUserDto)
      .expect(201);

    expect(response.body).toMatchObject({
      status: 'success',
      message: 'User registered successfully',
      data: {
        email: 'boladebode@gmail.com',
        firstName: 'Bolade',
        lastName: 'Akinniyi',
      },
    });
  });

  it('/user/login (POST)', async () => {
    const loginDto: LoginDto = {
      email: 'boladebode@gmail.com',
      password: 'password123',
    };

    const response = await request(app.getHttpServer())
      .post('/user/login')
      .send(loginDto)
      .expect(200);

    expect(response.body).toMatchObject({
      status: 'success',
      message: 'Login successful',
      data: {
        token: expect.any(String),
      },
    });
  });
});
