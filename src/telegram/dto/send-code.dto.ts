import { IsPhoneNumber } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class SendCodeDto {
  @IsPhoneNumber()
  @ApiProperty({description: 'Telegram phone number', required: true})
  phone: string;
}
