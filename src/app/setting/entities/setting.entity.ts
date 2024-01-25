import { SettingDataType } from 'src/base/constants/setting.enum';
import { Status } from 'src/base/constants/status';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('settings')
export class SettingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  settingKey: string;

  @Column('json')
  settingValue: any | Record<string, unknown>;

  @Column({ default: SettingDataType.STRING })
  dataType: SettingDataType;

  @Column({ default: Status.ACTIVE, enum: Status })
  status: number;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date | null;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date | null;
}
