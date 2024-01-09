import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
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
import { Action } from 'src/base/authorization/policy/casl.ability.factory';

const articleSelf = 'bài viết cá nhân';

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
  async index(@UserAuth() user, @Query() query): Promise<any> {
    return this.articleService.findAll(user, query, true);
  }

  @Post()
  @ApiCreateOperation({ summary: 'Tạo 1 ' + articleSelf })
  async create(@UserAuth() user, @Body() data: CreateArticleDto): Promise<any> {
    return this.articleService.create(user, data);
  }

  @Put(':id')
  @ApiUpdateOperation({ summary: 'Sửa 1 ' + articleSelf })
  async update(
    @UserAuth() user,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateArticleDto,
  ): Promise<any> {
    this.articleCasl.assertAbility(user, Action.Update, data);
    return this.articleService.update(user, id, data);
  }

  @Delete(':id')
  @ApiDeleteOperation({ summary: 'Xóa 1 ' + articleSelf })
  async delete(@UserAuth() user, @Param('id', ParseIntPipe) id: number) {
    return this.articleService.delete(user, id);
  }
}
