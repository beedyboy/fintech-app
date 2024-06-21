import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtUser } from '../decorators/user.decorator';
import { IUser } from '../dtos/user.dto';
import { JwtGuard } from '../guards/jwt.guards';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from '../dtos/transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getUserTransactions(@JwtUser() user: IUser) {
    return this.transactionService.getMyTransactions(user.id);
  }

  @UseGuards(JwtGuard)
  @Post()
  async addTransaction(
    @JwtUser() user: IUser,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionService.addTransaction(
      user.id,
      createTransactionDto,
    );
  }
}
