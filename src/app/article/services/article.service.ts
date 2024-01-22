import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/base/services/common.service';
import { ArticleEntity } from '../entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from 'src/auth/interfaces/user.class';
import { ArticleCasl } from '../policies/article.casl';
import { Action } from 'src/base/authorization/policy/casl.ability.factory';

@Injectable()
export class ArticleService extends CommonService<ArticleEntity> {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly repoArticle: Repository<ArticleEntity>,
    private readonly articleCasl: ArticleCasl,
  ) {
    super(repoArticle);
  }

  protected aliasName: string = 'articles';

  createEntity(ent) {
    return this.repoArticle.create(ent);
  }

  async getOne(id: number): Promise<ArticleEntity> {
    return await this.repoArticle.findOne({
      where: { id },
    });
  }

 
  _filterByUser(
    currentUser: User,
    queryBuilder: SelectQueryBuilder<ArticleEntity>,
    params?: {},
  ): SelectQueryBuilder<ArticleEntity> {
    queryBuilder = queryBuilder.andWhere(`${this.aliasName}.user_id = :id`, {
      id: currentUser.id,
    });

    return queryBuilder;
  }

  _beforeInsertData(
    currentUser: User,
    dto: DeepPartial<ArticleEntity>,
  ): DeepPartial<ArticleEntity> {
    return {
      ...dto,
      user_id: currentUser.id,
    };
  }

  _beforeUpdateData(
    currentUser: User,
    dto: DeepPartial<ArticleEntity>,
    oldRecord: ArticleEntity,
  ): DeepPartial<ArticleEntity> {
    this.articleCasl.assertAbility(currentUser, Action.Update, oldRecord);
    return dto;
  }
}
