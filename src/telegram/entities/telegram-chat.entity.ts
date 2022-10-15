import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../global/entities/base.entity';

@Entity()
export class TelegramChat extends BaseEntity {
  @Column({ type: 'boolean' })
  self: boolean;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'text' })
  senderFullName: string;

  @Column({ type: 'text' })
  senderPhone: string;

  @Column({ type: 'numeric' })
  time: number;
}
