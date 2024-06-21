import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { Transaction } from '../../src/entities/transaction.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../src/entities/user.entity';
import { TransactionType } from '../../src/enums/transaction.enum';

describe('TransactionService', () => {
  let service: TransactionService;
  let repository: Repository<Transaction>;

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
      timestamp: '2024-01-01T00:00:00Z',
      paymentMethod: 'credit_card',
      user: mockUser,
      description: 'Opening Balance',
      balance: 100.0,
    },
    {
      id: 2,
      amount: 50.0,
      type: TransactionType.WITHDRAWAL,
      timestamp: '2024-01-02T00:00:00Z',
      paymentMethod: 'bank_transfer',
      user: mockUser,
      description: 'Grocery Store',
      balance: 50.0,
    },
  ];

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
    const userId = mockUser.id;

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

  it('should handle database errors gracefully', async () => {
    const userId = 1;
    jest
      .spyOn(repository, 'find')
      .mockRejectedValue(new Error('Database error'));

    try {
      await service.getMyTransactions(userId);
    } catch (error) {
      expect(error.message).toBe('Database error');
    }
  });
});
