import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { ArticleService } from './services/article.service';
import { ArticleController } from './controllers/article.controller';
import { ArticleCasl } from './policies/article.casl';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity])],
  providers: [ArticleService, ArticleCasl],
  controllers: [ArticleController],
})
export class ArticleModule {}
