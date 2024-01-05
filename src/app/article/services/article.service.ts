import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/base/services/common.service';
import { ArticleEntity } from '../entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class ArticleService extends CommonService<ArticleEntity> {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly repoArticle: Repository<ArticleEntity>,
  ) {
    super(repoArticle);
  }

  protected aliasName: string = 'articles';

  protected _beforeInsertData(
    currentUser: any,
    data: DeepPartial<ArticleEntity>,
  ): DeepPartial<ArticleEntity> {
    return {
      ...data,
      user_id: currentUser.user_id,
    };
  }
}
