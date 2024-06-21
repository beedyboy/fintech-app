import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateTransactionDto } from '../src/dtos/transaction.dto';
import { TransactionType } from '../src/enums/transaction.enum';

describe('TransactionController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    jwtToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoiQm9sYWRlIiwibGFzdE5hbWUiOiJBa2lubml5aSIsImVtYWlsIjoiYm9sYWRlYm9kZUBnbWFpbC5jb20iLCJpYXQiOjE3MTg5NzA1MjYsImV4cCI6MTcxOTEwMDEyNn0.WqjKlrKRkCuThXmOhSFR_OkYThH3KEvCMHgDsBpJ0e4';
  });

  afterAll(async () => {
    await app.close();
  });yarn 

  it('/transaction (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/transaction')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(response.body).toEqual({
      status: 'success',
      message: 'Transactions fetched successfully',
      data: expect.any(Array),
    });
  });

  it('/transaction (POST)', async () => {
    const createTransactionDto: CreateTransactionDto = {
      amount: 200,
      description: 'test transaction',
      type: TransactionType.DEPOSIT,
      paymentMethod: 'card',
    };

    const response = await request(app.getHttpServer())
      .post('/transaction')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(createTransactionDto)
      .expect(201);

    expect(response.body).toMatchObject({
      status: 'success',
      message: 'Transaction added successfully',
      data: {
        amount: 200,
        description: 'test transaction',
        type: TransactionType.DEPOSIT,
        paymentMethod: 'card',
      },
    });
  });
});
