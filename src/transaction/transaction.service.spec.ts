import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { Transaction } from '../entities/transaction.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { TransactionType } from '../enums/transaction.enum';
import { CreateTransactionDto } from '../dtos/transaction.dto';
import { MockTransactionRepository } from '../mocks/transaction.repository.mock';

describe('TransactionService', () => {
  let service: TransactionService;
  let transactionRepository: MockTransactionRepository;

  const mockUser: User = {
    id: 1,
    email: 'boladebode@gmail.com',
    firstName: 'Bolade',
    lastName: 'Akinniyi',
    password: 'password123',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    transactions: [],
    hashPassword: async () => {},
  };

  const mockTransaction: Transaction = {
    id: 1,
    amount: 100.0,
    type: TransactionType.DEPOSIT,
    timestamp: '2024-06-20 11:17:30.701',
    paymentMethod: 'credit_card',
    description: 'Opening account',
    balance: 100.0,
    user: mockUser,
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
          useClass: MockTransactionRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    transactionRepository = module.get(getRepositoryToken(Transaction));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMyTransactions', () => {
    it('should return transactions for a user', async () => {
      const userId = mockUser.id;
      jest
        .spyOn(transactionRepository, 'find')
        .mockResolvedValue(mockTransactions);

      const result = await service.getMyTransactions(userId);
      expect(result).toEqual({
        status: 'success',
        message: 'Transactions fetched successfully',
        data: mockTransactions,
      });
      expect(transactionRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['user'],
      });
    });

    it('should return an empty array if no transactions found for user', async () => {
      const userId = 2;
      jest.spyOn(transactionRepository, 'find').mockResolvedValue([]);

      const result = await service.getMyTransactions(userId);
      expect(result).toEqual({
        status: 'success',
        message: 'Transactions fetched successfully',
        data: [],
      });
      expect(transactionRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['user'],
      });
    });

    it('should handle database errors gracefully', async () => {
      const userId = 1;
      jest
        .spyOn(transactionRepository, 'find')
        .mockRejectedValue(new Error('Database error'));

      const result = await service.getMyTransactions(userId);
      expect(result).toEqual({
        status: 'fail',
        message: 'An error occurred while fetching transactions',
      });
    });
  });

  describe('addTransaction', () => {
    it('should add a new transaction for a user', async () => {
      const createTransactionDto: CreateTransactionDto = {
        amount: 200,
        type: TransactionType.DEPOSIT,
        paymentMethod: 'paypal',
        description: 'Refund',
      };

      jest
        .spyOn(transactionRepository, 'create')
        .mockReturnValue(mockTransaction);
      jest
        .spyOn(transactionRepository, 'save')
        .mockResolvedValue(mockTransaction);

      const result = await service.addTransaction(
        mockUser,
        createTransactionDto,
      );

      expect(result).toEqual({
        status: 'success',
        message: 'Transaction added successfully',
        data: mockTransaction,
      });
      expect(transactionRepository.create).toHaveBeenCalledWith({
        ...createTransactionDto,
        user: mockUser,
        timestamp: expect.any(String),
        balance: createTransactionDto.amount,
      });
      expect(transactionRepository.save).toHaveBeenCalledWith(mockTransaction);
    });
  });
});
