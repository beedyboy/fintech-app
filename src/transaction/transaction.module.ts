import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transaction.entity';
import { AccessTokenStrategy } from 'src/guards/accessToken.strategy';
import { JwtGuard } from 'src/guards/jwt.guards';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Transaction])],
  providers: [TransactionService, JwtGuard, AccessTokenStrategy],
  controllers: [TransactionController],
})
export class TransactionModule {}
