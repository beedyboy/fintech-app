import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getMyTransactions(userId: number) {
    const transactions = await this.transactionRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    return {
      status: 'success',
      message: 'Transactions fetched successfully',
      data: transactions,
    };
  }
}
