import {
  Body,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
  Request,
  UseGuards,
  Controller,
  ClassSerializerInterceptor,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiExtraModels } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/userCreate.dto';
import { IdDto } from 'src/base/dtos/id.dto';
import {
  ApiCreateOperation,
  ApiDeleteOperation,
  ApiListOperation,
  ApiPaginatedResponse,
  ApiPartialOperation,
  ApiResponses,
  ApiRetrieveOperation,
  ApiTagAndBearer,
} from 'src/base/swagger/swagger.decorator';
import { QueryUserDto } from '../dtos/query_pagination.dto';
import { UserEntity } from '../entities/user.entity';
import { Roles } from 'src/base/authorization/role/role.decorator';
import { RoleGroup } from 'src/base/authorization/role/role.enum';
import { RoleGuard } from 'src/base/authorization/role/role.guard';

@ApiTagAndBearer('Tài khoản cá nhân')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(ClassSerializerInterceptor)
// @ApiExtraModels(PaginatedMeta)
@ApiResponses([{ status: 403, description: 'Access role: Admin' }])
@Roles(RoleGroup.Admins)
@Controller('admin/users')
export class UserController {
  constructor(protected readonly userService: UserService) {}

  @Get()
  @ApiPaginatedResponse(UserEntity)
  @ApiListOperation()
  public async index(
    @Request() req,
    @Query() query: QueryUserDto,
  ): Promise<any> {
    return await this.userService.findAll(req.user, query, true);
  }

  @Get(':id')
  @ApiRetrieveOperation()
  public async view(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Query() query,
  ): Promise<any> {
    return await this.userService.view(req.user, id, query);
  }

  @Post()
  @ApiCreateOperation()
  public async create(
    @Request() req,
    @Body() data: CreateUserDto,
  ): Promise<any> {
    return await this.userService.create(req.user, data);
  }

  @Put(':id')
  @ApiPartialOperation()
  public async update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() body,
  ): Promise<any> {
    return this.userService.update(req.user, id, body);
  }

  @Delete(':id')
  @ApiDeleteOperation()
  public async delete(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    return this.userService.delete(req.user, id);
  }
}
