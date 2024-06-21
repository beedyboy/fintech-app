import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export class MockUserRepository extends Repository<User> {
  findOne = jest.fn();
}
