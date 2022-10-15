import { Module } from '@nestjs/common';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '15321',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true, // TODO: Remove in production for some reason
    }),
    TelegramModule,
  ],
})
export class AppModule {}
