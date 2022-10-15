import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Telegram OTP code received', required: true })
  code: string;
}
