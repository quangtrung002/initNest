import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeEntity } from 'src/app/code/entities/code.entity';
import { CodeService } from 'src/app/code/services/code.service';
import { ConfigService } from 'src/base/configs/config.service';

@Module({
  imports: [TypeOrmModule.forFeature([CodeEntity])],
  providers: [CodeService, ConfigService],
  exports: [CodeService],
})
export class CodeModule {}
