import { UserEntity } from 'src/app/user/entities/user.entity';
import { CodeType } from 'src/base/constants/code.type';
import { BaseEntity } from 'src/base/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('codes')
export class CodeEntity extends BaseEntity {
  @Column({ name: 'otpCode', type: 'varchar', length: 6 })
  otpCode: string;

  @Column({ name: 'type', type: 'varchar', length: 50, enum: CodeType })
  type: string;

  @Column({ name: 'expriration_time', type: 'timestamp' })
  expriration_time: Date;

  @Column({ name: 'user_id', type: 'int' })
  user_id: number;

  @ManyToOne(() => UserEntity, (user) => user.codes)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  checkExprirationTime(): boolean {
    return this.expriration_time > new Date();
  }

  verifyOtp(otpCode: string): boolean {
    return this.otpCode === otpCode;
  }
}
