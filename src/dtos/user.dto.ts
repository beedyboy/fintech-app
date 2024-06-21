import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is Required' })
  @Length(6, 30, {
    message: 'Password must be not less than 6 and not more than 30 Characters',
  })
  password: string;
}

export class CreateUserDto {
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'First name should not be empty' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name should not be empty' })
  lastName: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is Required' })
  @Length(6, 30, {
    message: 'Password must be not less than 6 and not more than 30 Characters',
  })
  password: string;
}
