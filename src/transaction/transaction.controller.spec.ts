import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from '../dtos/transaction.dto';
import { User } from '../entities/user.entity';
import { TransactionType } from '../enums/transaction.enum';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

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

  const mockTransaction = {
    id: 1,
    amount: 100.0,
    type: TransactionType.DEPOSIT,
    timestamp: '2024-06-20 11:17:30.701',
    paymentMethod: 'credit_card',
    description: 'Opening account',
    balance: 100.0,
    user: mockUser,
  };

  const mockTransactions = [
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

  const mockTransactionService = {
    getMyTransactions: jest.fn().mockResolvedValue({
      status: 'success',
      message: 'Transactions fetched successfully',
      data: mockTransactions,
    }),
    addTransaction: jest.fn().mockResolvedValue({
      status: 'success',
      message: 'Transaction added successfully',
      data: mockTransaction,
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
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserTransactions', () => {
    it('should return user transactions', async () => {
      const result = await controller.getUserTransactions(mockUser);
      expect(result).toEqual({
        status: 'success',
        message: 'Transactions fetched successfully',
        data: mockTransactions,
      });
      expect(service.getMyTransactions).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('addTransaction', () => {
    it('should add a transaction for a user', async () => {
      const createTransactionDto: CreateTransactionDto = {
        amount: 200,
        type: TransactionType.DEPOSIT,
        paymentMethod: 'paypal',
        description: 'Refund',
      };

      const result = await controller.addTransaction(
        mockUser,
        createTransactionDto,
      );
      expect(result).toEqual({
        status: 'success',
        message: 'Transaction added successfully',
        data: mockTransaction,
      });
      expect(service.addTransaction).toHaveBeenCalledWith(
        mockUser.id,
        createTransactionDto,
      );
    });
  });
});
