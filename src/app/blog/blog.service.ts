import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { isValidString } from '@app/utils/string';
import { Blog } from '@app/models/blog.schema';
import { createBlogDto, BlogUpdateDto } from './blog.dto';

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>, private jwtService: JwtService) {}

  async build(model: createBlogDto) {
    const { user, description, reply } = model;

    const blog = new this.blogModel({
      user,
      description,
      reply,
    }).save();
    return blog;
  }

  async createBlog(model: createBlogDto): Promise<Blog> {
    return await this.build(model);
  }

  async getAllBlog(queryParams): Promise<Blog[]> {
    let { page_no = '1', page_size = '50' } = queryParams;

    page_no = Number(page_no);
    page_size = Number(page_size);

    const skip = (page_no - 1) * page_size;

    const all_blogs = await this.blogModel.aggregate([
      {
        $match: {
          is_deleted: false,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
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
    return all_blogs;
  }

  async getById(id: string): Promise<Blog | null> {
    const blog = await this.blogModel.aggregate([
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
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    return blog.length > 0 ? blog[0] : null;
  }

  async softDelete(id: string): Promise<Blog | Observable<Blog | any>> {
    const blog = await this.blogModel.findByIdAndDelete(
      { _id: id },
      {
        $set: {
          is_deleted: true,
        },
      },
    );
    return blog;
  }

  async updateBlog<T>(id: T | string, model: BlogUpdateDto): Promise<Blog> {
    const blog = await this.blogModel.findById({ _id: id });

    if (!blog) {
      throw new HttpException('blog not found', HttpStatus.BAD_REQUEST);
    }

    if (
      isValidString(
        model.description !== 'string' &&
          model.description !== '' &&
          model.description !== undefined &&
          model.description,
      )
    ) {
      blog.description = model.description;
    }

    if (isValidString(model.reply !== 'string' && model.reply !== '' && model.reply !== undefined && model.reply)) {
      blog.reply = model.reply;
    }

    await blog.save();
    return blog;
  }
}
