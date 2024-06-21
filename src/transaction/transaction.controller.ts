import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtUser } from '../decorators/user.decorator';
import { IUser } from '../dtos/user.dto';
import { JwtGuard } from '../guards/jwt.guards';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getUserTransactions(@JwtUser() user: IUser) {
    return this.transactionService.getMyTransactions(user.id);
  }
}
