import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "User's phone number", required: true })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Message body', required: true })
  message: string;
}
