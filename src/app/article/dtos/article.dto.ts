import { IsNotEmpty, IsOptional } from 'class-validator';
import { factoryQuerySpecificationDto } from 'src/base/dtos/query-specification.dto';

export class CreateArticleDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  isPublished: boolean = false;

  @IsOptional()
  user_id : number;
}

export class UpdateArticleDto extends CreateArticleDto {}

export class ArticleQueryDto extends factoryQuerySpecificationDto({
  searchFields: ['title'],
  filterExample: {
    title: 'title',
  },
}) {}
