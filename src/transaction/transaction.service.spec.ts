import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { Transaction } from '../entities/transaction.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('TransactionService', () => {
  let service: TransactionService;
  let repository: Repository<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch a user transactions and return them', async () => {
    const userId = 1;
    const mockTransactions = [
      {
        id: 1,
        amount: 100.0,
        type: 'Deposit',
        timestamp: '2024-01-01T00:00:00Z',
        paymentMethod: 'credit_card',
        user: { id: userId, email: 'boladebode@gmail.com' },
      },
      {
        id: 2,
        amount: 50.0,
        type: 'Debit',
        timestamp: '2024-01-02T00:00:00Z',
        paymentMethod: 'bank_transfer',
        user: { id: userId, email: 'test@example.com' },
      },
    ];

    jest.spyOn(repository, 'find').mockResolvedValue(mockTransactions);

    const response = await service.getMyTransactions(userId);

    expect(response).toEqual({
      status: 'success',
      message: 'Transactions fetched successfully',
      data: mockTransactions,
    });
  });

  it('should return an empty array if no transactions found for user', async () => {
    const userId = 2;
    jest.spyOn(repository, 'find').mockResolvedValue([]);

    const response = await service.getMyTransactions(userId);

    expect(response).toEqual({
      status: 'success',
      message: 'Transactions fetched successfully',
      data: [],
    });
  });

  it('should handle invalid user ID gracefully', async () => {
    const userId = 999;
    jest.spyOn(repository, 'find').mockResolvedValue([]);

    const response = await service.getMyTransactions(userId);

    expect(response).toEqual({
      status: 'success',
      message: 'Transactions fetched successfully',
      data: [],
    });
  });
});
