import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  amount: number;

  @Column()
  type: string;

  @Column()
  timestamp: string;

  @Column()
  paymentMethod: string;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;
}
