import { IsOptional } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity as TBaseEntity,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsOptional()
  id?: string;

  @CreateDateColumn({ type: 'timestamptz', nullable: true })
  @Index()
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  @Index()
  updatedAt?: Date;

  @DeleteDateColumn()
  @Index()
  deletedAt?: Date;

  @Column('text', { nullable: true, default: 'System' })
  createdBy?: string;

  @Column('text', { nullable: true })
  updatedBy?: string;

  @Column('text', { nullable: true })
  deletedBy?: string;

  isDeleted() {
    return !!this.deletedAt;
  }
}
