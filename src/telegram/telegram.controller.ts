import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddContactDto, LoginDto, SendCodeDto, SendMessageDto } from './dto';
import { TelegramService } from './telegram.service';

@Controller('telegram')
@ApiTags('Telegram')
export class TelegramController {
  constructor(private service: TelegramService) {}

  @Post('send-code')
  @HttpCode(200)
  @ApiOperation({ summary: 'Send code to a phone number' })
  async sendCode(@Body() body: SendCodeDto) {
    return await this.service.sendCode(body.phone);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login to telegram with OTP sent to phone' })
  async login(@Body() body: LoginDto) {
    return this.service.login(body.code);
  }

  @Post('add-contact')
  @ApiOperation({ summary: 'Add an existing telegram user as contact' })
  addContact(@Body() body: AddContactDto) {
    return this.service.addContact(body);
  }

  @Post('send-message')
  @ApiOperation({ summary: 'Send a text message to a user' })
  sendMessage(@Body() body: SendMessageDto) {
    return this.service.sendMessage(body.phone, body.message);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout from telegram account' })
  logout() {
    return this.service.logout();
  }

  @Get('login-status')
  @ApiOperation({ summary: 'Verify if there is an active session' })
  getLoginStatus() {
    return this.service.getLoginStatus();
  }
}
