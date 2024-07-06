import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { isValidString } from '@app/utils/string';
import { Carts } from '@app/models/cart.schema';
import { createCartsDto, CartsUpdateDto } from './cart.dto';
import { Course } from '@app/models/course.schema';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Carts.name) private cartsModel: Model<Carts>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    private jwtService: JwtService,
  ) {}

  async build(model: createCartsDto) {
    const { userId, description, courseId } = model;

    const carts = new this.cartsModel({
      userId,
      description,
      courseId,
    }).save();
    return carts;
  }

  async createCarts(model: createCartsDto): Promise<Carts> {
    return await this.build(model);
  }

  async getAllCarts(queryParams): Promise<Carts[]> {
    let { page_no = '1', page_size = '50' } = queryParams;

    page_no = Number(page_no);
    page_size = Number(page_size);

    const skip = (page_no - 1) * page_size;

    const all_carts = await this.cartsModel.aggregate([
      {
        $match: {
          is_deleted: false,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
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
        $lookup: {
          from: 'courses',
          localField: 'courseId',
          foreignField: '_id',
          as: 'courses',
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: page_size,
      },
    ]);
    return all_carts;
  }

  async getById(id: string): Promise<Carts | null> {
    const carts = await this.cartsModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
          is_deleted: false,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
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
        $lookup: {
          from: 'courses',
          localField: 'courseId',
          foreignField: '_id',
          as: 'courses',
        },
      },
    ]);
    return carts.length > 0 ? carts[0] : null;
  }

  async softDelete(id: string): Promise<Carts | Observable<Carts | any>> {
    const carts = await this.cartsModel.findByIdAndDelete(
      { _id: id },
      {
        $set: {
          is_deleted: true,
        },
      },
    );
    return carts;
  }

  async updateCarts<T>(id: T | string, model: CartsUpdateDto): Promise<Carts> {
    const carts = await this.cartsModel.findById({ _id: id });

    if (!carts) {
      throw new HttpException('carts not found', HttpStatus.BAD_REQUEST);
    }

    if (
      isValidString(
        model.description !== 'string' &&
          model.description !== '' &&
          model.description !== undefined &&
          model.description,
      )
    ) {
      carts.description = model.description;
    }

    await carts.save();
    return carts;
  }

  async getCoursesByIds(courseIds: string[]): Promise<Course[]> {
    const objectIds = courseIds.map(id => new Types.ObjectId(id));
    const courses = await this.courseModel.find({ _id: { $in: objectIds } }).exec();
    return courses;
  }
}
