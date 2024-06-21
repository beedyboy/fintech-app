import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { User } from '../entities/user.entity';
import { Transaction } from '../entities/transaction.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TransactionType } from '../enums/transaction.enum';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  const mockUser: User = {
    id: 1,
    email: 'boladebode@gmail.com',
    firstName: 'Bolade',
    lastName: 'Akinniyi',
    password: 'hashedpassword',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    transactions: [],
    hashPassword: async () => {},
  };

  const mockTransactions: Transaction[] = [
    {
      id: 1,
      amount: 100.0,
      type: TransactionType.DEPOSIT,
      timestamp: '2024-06-20 11:17:30.701',
      paymentMethod: 'credit_card',
      description: 'Initial deposit',
      balance: 100.0,
      user: mockUser,
    },
    {
      id: 2,
      amount: 50.0,
      type: TransactionType.WITHDRAWAL,
      timestamp: '2024-06-21 12:47:37.701',
      paymentMethod: 'bank_transfer',
      description: 'Bill payment',
      balance: 50.0,
      user: mockUser,
    },
  ];

  const mockTransactionService = {
    getMyTransactions: jest.fn((userId: number) => {
      if (userId === mockUser.id) {
        return {
          status: 'success',
          message: 'Transactions fetched successfully',
          data: mockTransactions,
        };
      } else {
        return {
          status: 'success',
          message: 'Transactions fetched successfully',
          data: [],
        };
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
        JwtService,
        ConfigService,
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should fetch user transactions and return them', async () => {
    const result = await controller.getUserTransactions(mockUser);
    expect(result).toEqual({
      status: 'success',
      message: 'Transactions fetched successfully',
      data: mockTransactions,
    });
    expect(service.getMyTransactions).toHaveBeenCalledWith(mockUser.id);
  });

  it('should return an empty array if no transactions found for user', async () => {
    const user: User = { ...mockUser, id: 2 };
    const result = await controller.getUserTransactions(user);
    expect(result).toEqual({
      status: 'success',
      message: 'Transactions fetched successfully',
      data: [],
    });
    expect(service.getMyTransactions).toHaveBeenCalledWith(user.id);
  });
});
