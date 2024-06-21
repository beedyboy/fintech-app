import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';

export class MockTransactionRepository extends Repository<Transaction> {
  create = jest.fn();
  save = jest.fn();
  find = jest.fn();
}
