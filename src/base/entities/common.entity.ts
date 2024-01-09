import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ModelUserEntity } from './model-user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class BaseEntity extends ModelUserEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({
    name: 'status',
    default: 1,
    type: 'int',
  })
  status: number;

  @ApiProperty()
  @CreateDateColumn({
    name: 'createdAt',
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
    nullable: true,
  })
  createdAt: Date | null;

  @ApiProperty()
  @UpdateDateColumn({
    name: 'updatedAt',
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
    nullable: true,
  })
  updatedAt: Date | null;
}
