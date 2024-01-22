import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ArticleService } from '../services/article.service';
import {
  ApiCreateOperation,
  ApiDeleteOperation,
  ApiListOperation,
  ApiPaginatedResponse,
  ApiTagAndBearer,
  ApiUpdateOperation,
} from 'src/base/swagger/swagger.decorator';
import { ArticleEntity } from '../entities/article.entity';
import { CreateArticleDto, UpdateArticleDto } from '../dtos/article.dto';
import { UserAuth } from 'src/auth/decorator/jwt.decorator';
import { ArticleCasl } from '../policies/article.casl';
import { User } from 'src/auth/interfaces/user.class';
import { ArticleQueryDto } from '../dtos/article.dto';
import { Action } from 'src/base/authorization/policy/casl.ability.factory';
import { subject } from '@casl/ability';

const articleSelf = 'bài viết cá nhân';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTagAndBearer('Bài viết cá nhân')
@Controller('articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly articleCasl: ArticleCasl,
  ) {}

  @Get()
  @ApiListOperation({ summary: 'Lấy tất cả ' + articleSelf })
  @ApiPaginatedResponse(ArticleEntity)
  async index(
    @UserAuth() user: User,
    @Query() query: ArticleQueryDto,
  ): Promise<any> {
    return this.articleService.findAll(user, query, true);
  }

  @Post()
  @ApiCreateOperation({ summary: 'Tạo 1 ' + articleSelf })
  async create(
    @UserAuth() user: User,
    @Body() dto: CreateArticleDto,
  ): Promise<any> {
    this.articleCasl.assertAbility(user, Action.Create, dto)
    return this.articleService.create(user, dto);
  }

  @Put(':id')
  @ApiUpdateOperation({ summary: 'Sửa 1 ' + articleSelf })
  async update(
    @UserAuth() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateArticleDto,
  ): Promise<any> {
    return this.articleService.update(user, id, dto);
  }

  @Delete(':id')
  @ApiDeleteOperation({ summary: 'Xóa 1 ' + articleSelf })
  async delete(@UserAuth() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.articleService.delete(user, id);
  }
}
