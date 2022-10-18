import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AddContactDto } from './dto';
import { NewMessageEvent } from 'telegram/events';
import { TelegramChat } from './entities/telegram-chat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import telegramClient from './telegram-client';
import redis from '../global/redis';
import { RedisKeysEnum } from '../global/redis/redis-keys.enum';

@Injectable()
export class TelegramService {
  constructor(
    @InjectRepository(TelegramChat)
    private telegramChatRepository: Repository<TelegramChat>,
  ) {
    telegramClient.onNewMessage = this.handleNewMessage.bind(this);
  }

  private async handleNewMessage(event: NewMessageEvent) {
    const message = event.message;
    // @ts-ignore
    const { self, lastName, firstName, phone, bot, contact } =
      await message.getSender();
    if (!event.isPrivate || bot || !contact || !message.text) return;

    await this.telegramChatRepository.save({
      message: message.text,
      time: message.date,
      senderPhone: phone,
      self,
      senderFullName: [firstName, lastName].join(' '),
    });
  }

  async sendCode(phone: string) {
    await telegramClient.sendVerificationCode(phone);
    await redis.set(RedisKeysEnum.TelegramPhone, phone, 'EX', 120);

    return `Code sent to ${phone} successfully`;
  }

  async login(code: string) {
    const phone = await redis.get(RedisKeysEnum.TelegramPhone);

    if (!phone) {
      throw new BadRequestException('No phone number found');
    }

    await telegramClient.signIn(phone, code, {
      onError: (err) => {
        throw new InternalServerErrorException(err, err.message);
      },
    });
    await telegramClient.session.save();
    await redis.del(RedisKeysEnum.TelegramPhone);

    return 'Telegram account sign in successful';
  }

  async addContact(contact: AddContactDto) {
    return telegramClient.addNewContact(contact);
  }

  async sendMessage(phone: string, message: string) {
    const newMessage = await telegramClient.sendMessage(phone, { message });

    await this.telegramChatRepository.save({
      message: newMessage.text,
      senderPhone: '905338237807',
      self: true,
      senderFullName: 'agent@mail.com',
      time: newMessage.date,
    });

    return 'Message sent successfully';
  }

  async logout() {
    if (await telegramClient.isUserAuthorized()) {
      await telegramClient.logout();

      return 'Account logout successful';
    }

    return 'No active login';
  }

  async getLoginStatus() {
    return { isLoggedIn: await telegramClient.isUserAuthorized() };
  }
}
