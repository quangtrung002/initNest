import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from '../services/article.service';
import {
  ApiCreateOperation,
  ApiListOperation,
  ApiPaginatedResponse,
  ApiTagAndBearer,
  ApiUpdateOperation,
} from 'src/base/swagger/swagger.decorator';
import { ArticleEntity } from '../entities/article.entity';
import { CreateArticleDto, UpdateArticleDto } from '../dtos/article.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/base/authorization/role/role.guard';

@ApiTagAndBearer('Bài viết cá nhân')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @ApiListOperation()
  @ApiPaginatedResponse(ArticleEntity)
  async index(@Request() req, @Query() query): Promise<any> {
    return this.articleService.findAll(req.user, query, true);
  }

  @Post()
  @ApiCreateOperation()
  async create(@Request() req, @Body() data: CreateArticleDto): Promise<any> {
    return this.articleService.create(req.user, data);
  }

  @Put(':id')
  @ApiUpdateOperation()
  async update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateArticleDto,
  ): Promise<any> {
    return this.articleService.update(req.user, id, data);
  }
}
