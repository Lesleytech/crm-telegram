import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddContactDto {
  @IsPhoneNumber()
  @ApiProperty({ description: 'Telegram phone number', required: true })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `User's first name`, required: true })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ description: `User's last name`, required: false })
  lastName: string;
}
