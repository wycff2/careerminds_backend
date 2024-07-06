import {
  Controller,
  Post,
  Body,
  Query,
  Get,
  Logger,
  Param,
  Put,
  Delete,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiTags } from '@nestjs/swagger';
import { createRoleDto, PagingQueryDto, RoleUpdateDto } from './roles.dto';
import { MessageResponseInterceptor, ResponseInterceptor } from 'src/helpers/interceptors/respone.interceptor';
import { ResponseMessage } from 'src/helpers/decorators/response.message';

@Controller('roles')
@ApiTags('roles')
export class RolesController {
  private readonly logger = new Logger(RolesController.name);

  constructor(private roleService: RolesService) {}

  @Post('/create')
  async createRole(@Body() roleDto: createRoleDto) {
    return this.roleService.createRole(roleDto);
  }

  @Get('/getall')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('role fetched.')
  async getAllRole(@Query() query: PagingQueryDto) {
    this.logger.log('[getAll: role');
    const role = await this.roleService.getAllRole(query);
    return role;
  }

  @Get('/getById/:id')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('role fetched')
  async getById(@Param('id') id: string) {
    const role = await this.roleService.getById(id);
    if (!role) {
      throw new HttpException('role not found', HttpStatus.BAD_REQUEST);
    }
    return role;
  }

  @Put('/update/:id')
  async updateRole(@Param('id') id: string, @Body() roleDto: RoleUpdateDto) {
    return this.roleService.updateRole(id, roleDto);
  }

  @Delete('/deleteRole/:id')
  @UseInterceptors(MessageResponseInterceptor)
  @ResponseMessage('user removed')
  async deleteRole(@Param('id') roleId: string): Promise<string> {
    const user = this.roleService.DeleteRole(roleId);
    if (!user) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }
    return 'user removed';
  }
}
