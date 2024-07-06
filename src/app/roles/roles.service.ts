import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from '../../models/roles.schema';
import { RoleUpdateDto, createRoleDto } from './roles.dto';
import { Observable } from 'rxjs';
import { isValidString } from 'src/utils/string';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}

  async build(model: createRoleDto) {
    const { name, display_name, description, note, admin_note } = model;
    const role = new this.roleModel({
      name,
      display_name,
      description,
      note,
      admin_note,
    }).save();
    return role;
  }

  async createRole(roleDto: createRoleDto): Promise<Role> {
    const { name } = roleDto;

    const existingRole = await this.roleModel.findOne({ name });
    if (existingRole) {
      throw new HttpException('Role with this name already exists', HttpStatus.CONFLICT);
    }
    const role = new this.roleModel({
      ...roleDto,
      admin_permissions: roleDto.admin_permissions || {},
    });

    return role.save();
  }

  async getAllRole(queryParams): Promise<Role[]> {
    let { page_no = '1', page_size = '50' } = queryParams;

    page_no = Number(page_no);
    page_size = Number(page_size);

    const skip = (page_no - 1) * page_size;

    const all_role = await this.roleModel.aggregate([
      {
        $skip: skip,
      },
      {
        $limit: page_size,
      },
    ]);
    return all_role;
  }

  async getById(id: string): Promise<Role[]> {
    const user = await this.roleModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
        },
      },
      {
        $match: {
          is_deleted: false,
        },
      },
    ]);
    return user;
  }

  async updateRole(id: string, roleDto: RoleUpdateDto): Promise<Role> {
    const role = await this.roleModel.findByIdAndUpdate(id, roleDto, { new: true });
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    if (isValidString(roleDto.name !== 'string' && roleDto.name !== '' && roleDto.name !== undefined && roleDto.name)) {
      role.name = roleDto.name;
    }
    if (
      isValidString(
        roleDto.display_name !== 'string' &&
          roleDto.display_name !== '' &&
          roleDto.display_name !== undefined &&
          roleDto.display_name,
      )
    ) {
      role.display_name = roleDto.display_name;
    }
    if (roleDto.is_activated) {
      role.is_activated = roleDto.is_activated;
    }
    if (
      isValidString(
        roleDto.description !== 'string' &&
          roleDto.description !== '' &&
          roleDto.description !== undefined &&
          roleDto.description,
      )
    ) {
      role.description = roleDto.description;
    }
    if (isValidString(roleDto.note !== 'string' && roleDto.note !== '' && roleDto.note !== undefined && roleDto.note)) {
      role.note = roleDto.note;
    }
    if (
      isValidString(
        roleDto.admin_note !== 'string' &&
          roleDto.admin_note !== '' &&
          roleDto.admin_note !== undefined &&
          roleDto.admin_note,
      )
    ) {
      role.admin_note = roleDto.admin_note;
    }
    await role.save();
    return role;
  }

  async DeleteRole(id: string): Promise<Role | Observable<Role | any>> {
    const user = await this.roleModel.findByIdAndDelete({ _id: id });
    return user;
  }
}
