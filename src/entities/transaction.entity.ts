import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { TransactionType } from 'src/enums/transaction.enum';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column()
  timestamp: string;

  @Column()
  paymentMethod: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { nullable: true })
  balance: number;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;
}
