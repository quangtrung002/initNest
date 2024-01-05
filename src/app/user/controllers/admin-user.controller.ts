import {
  Body,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
  Controller,
  ClassSerializerInterceptor,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from '../services/admin-user.service';
import { CreateUserDto } from '../dtos/userCreate.dto';
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
import { UserAuth } from 'src/auth/decorator/jwt.decorator';

@ApiTagAndBearer('Admin - Tài khoản người dùng')
@UseInterceptors(ClassSerializerInterceptor)
@ApiResponses([{ status: 403, description: 'Access role: Admin' }])
@Roles(RoleGroup.Admins)
@Controller('admin/users')
export class UserController {
  constructor(protected readonly userService: UserService) {}

  @Get()
  @ApiPaginatedResponse(UserEntity)
  @ApiListOperation()
  public async index(
    @UserAuth() user,
    @Query() query: QueryUserDto,
  ): Promise<any> {
    return await this.userService.findAll(user, query, true);
  }

  @Get(':id')
  @ApiRetrieveOperation()
  public async view(
    @UserAuth() user,
    @Param('id', ParseIntPipe) id: number,
    @Query() query,
  ): Promise<any> {
    return await this.userService.view(user, id, query);
  }

  @Post()
  @ApiCreateOperation()
  public async create(
    @UserAuth() user,
    @Body() data: CreateUserDto,
  ): Promise<any> {
    return await this.userService.create(user, data);
  }

  @Put(':id')
  @ApiPartialOperation()
  public async update(
    @UserAuth() user,
    @Param('id', ParseIntPipe) id: number,
    @Body() body,
  ): Promise<any> {
    return this.userService.update(user, id, body);
  }

  @Delete(':id')
  @ApiDeleteOperation()
  public async delete(
    @UserAuth() user,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    return this.userService.delete(user, id);
  }
}
