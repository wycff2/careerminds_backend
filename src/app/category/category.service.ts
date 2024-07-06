import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { isValidString } from '@app/utils/string';
import { Category } from '@app/models/category.schema';
import { createCategoryDto, CategoryUpdateDto } from './category.dto';
import { isArray } from 'class-validator';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>, private jwtService: JwtService) {}

  async build(model: createCategoryDto) {
    const { Name, status, description } = model;

    const category = new this.categoryModel({
      Name,
      status,
      description,
    }).save();
    return category;
  }

  async createCategory(model: createCategoryDto): Promise<Category> {
    return await this.build(model);
  }

  async getAllCategory(queryParams): Promise<Category[]> {
    let { page_no = '1', page_size = '50' } = queryParams;

    page_no = Number(page_no);
    page_size = Number(page_size);

    const skip = (page_no - 1) * page_size;

    const all_categorys = await this.categoryModel.aggregate([
      {
        $match: {
          is_deleted: false,
        },
      },

      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'course',
        },
      },
      {
        $unwind: {
          path: '$course',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: page_size,
      },
    ]);
    return all_categorys;
  }

  async getById(id: string): Promise<Category | null> {
    const categorys = await this.categoryModel.aggregate([
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
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'course',
        },
      },
      {
        $unwind: {
          path: '$course',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    return categorys.length > 0 ? categorys[0] : null;
  }

  async softDelete(id: string): Promise<Category | Observable<Category | any>> {
    const category = await this.categoryModel.findByIdAndDelete(
      { _id: id },
      {
        $set: {
          is_deleted: true,
        },
      },
    );
    return category;
  }

  async updateCategory<T>(id: T | string, model: CategoryUpdateDto): Promise<Category> {
    const category = await this.categoryModel.findById({ _id: id });

    if (!category) {
      throw new HttpException('category not found', HttpStatus.BAD_REQUEST);
    }

    if (isValidString(model.Name !== 'string' && model.Name !== '' && model.Name !== undefined && model.Name)) {
      category.Name = model.Name;
    }

    if (isArray(model.description !== undefined && model.description)) {
      category.description = model.description;
    }

    if (isValidString(model.status !== 'string' && model.status !== '' && model.status !== undefined && model.status)) {
      category.status = model.status;
    }

    await category.save();
    return category;
  }

  async uploadThumbnail(id: string, filePath: string): Promise<Category> {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    category.thumbnail = filePath;
    await category.save();
    return category;
  }

  // async removeAllCategorys(): Promise<void> {
  //   await this.categoryModel.deleteMany();
  // }
}
