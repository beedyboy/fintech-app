import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TransactionType } from '../enums/transaction.enum';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsEnum(TransactionType)
  @Transform(({ value }) => TransactionType[value.toUpperCase()])
  type: TransactionType;

  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @IsOptional()
  @IsString()
  description?: string;
}
