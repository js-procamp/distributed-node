import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, IsEmail } from 'class-validator';

export class CreateUserDto {
  /**
   * This is users name
   * @example 'Test'
   */
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(10)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  @IsEmail()
  email: string;
}
