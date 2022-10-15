import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramChat } from './entities/telegram-chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TelegramChat])],
  controllers: [TelegramController],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
