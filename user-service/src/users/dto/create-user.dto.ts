import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';

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
  @MaxLength(10)
  password: string;
}
