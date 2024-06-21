import { Expose, Transform, Type } from 'class-transformer';
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
class TransactionResponse {
  @Expose()
  id: number;

  @Expose()
  amount: number;

  @Expose()
  type: string;

  @Expose()
  paymentMethod: string;

  @Expose()
  description: string;

  @Expose()
  timestamp: string;

  @Expose()
  balance: number;
}
export class TransactionResponseDto {
  @Expose()
  message: string;

  @Expose()
  status: boolean;

  @Expose()
  @Type(() => TransactionResponse)
  data: TransactionResponse;
}
