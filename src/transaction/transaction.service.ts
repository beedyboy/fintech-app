import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from 'src/dtos/transaction.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getMyTransactions(
    userId: number,
  ): Promise<{ status: string; message: string; data?: any }> {
    try {
      const transactions = await this.transactionRepository.find({
        where: { user: { id: userId } },
        relations: ['user'],
      });

      return {
        status: 'success',
        message: 'Transactions fetched successfully',
        data: transactions,
      };
    } catch (error) {
      return {
        status: 'fail',
        message: 'An error occurred while fetching transactions',
      };
    }
  }

  async addTransaction(
    user: User,
    createTransactionDto: CreateTransactionDto,
  ): Promise<{ status: string; message: string; data?: Transaction }> {
    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      user,
      timestamp: new Date().toISOString(),
      balance: createTransactionDto.amount,
    });
    const newTransaction = await this.transactionRepository.save(transaction);
    return {
      status: 'success',
      message: 'Transaction added successfully',
      data: newTransaction,
    };
  }
}
