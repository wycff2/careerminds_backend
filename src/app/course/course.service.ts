import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { isValidString } from '@app/utils/string';
import { Course } from '@app/models/course.schema';
import { createCourseDto, CourseUpdateDto } from './course.dto';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>, private jwtService: JwtService) {}

  async build(model: createCourseDto) {
    const { category, Name, status, language, description, price, discount } = model;

    const course = new this.courseModel({
      category,
      Name,
      status,
      language,
      description,
      price,
      discount,
    });

    return course.save();
  }

  async createCourse(model: createCourseDto): Promise<Course> {
    return await this.build(model);
  }

  async getAllCourse(queryParams): Promise<Course[]> {
    let { page_no = '1', page_size = '50' } = queryParams;

    page_no = Number(page_no);
    page_size = Number(page_size);

    const skip = (page_no - 1) * page_size;

    const all_courses = await this.courseModel.aggregate([
      {
        $match: {
          is_deleted: false,
        },
      },
      {
        $lookup: {
          from: 'categorys',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: {
          path: '$category',
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
    return all_courses;
  }

  async getById(id: string): Promise<Course | null> {
    const course = await this.courseModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'categorys',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          is_deleted: false,
        },
      },
    ]);
    return course.length > 0 ? course[0] : null;
  }

  async softDelete(id: string): Promise<Course | Observable<Course | any>> {
    const course = await this.courseModel.findByIdAndDelete(
      { _id: id },
      {
        $set: {
          is_deleted: true,
        },
      },
    );
    return course;
  }

  async updateCourse<T>(id: T | string, model: CourseUpdateDto): Promise<Course> {
    const course = await this.courseModel.findById({ _id: id });

    if (!course) {
      throw new HttpException('course not found', HttpStatus.BAD_REQUEST);
    }

    if (isValidString(model.Name !== 'string' && model.Name !== '' && model.Name !== undefined && model.Name)) {
      course.Name = model.Name;
    }

    if (
      isValidString(
        model.description !== 'string' &&
          model.description !== '' &&
          model.description !== undefined &&
          model.description,
      )
    ) {
      course.description = model.description;
    }

    if (isValidString(model.price !== 'string' && model.price !== '' && model.price !== undefined && model.price)) {
      course.price = model.price;
    }

    if (
      isValidString(
        model.language !== 'string' && model.language !== '' && model.language !== undefined && model.language,
      )
    ) {
      course.language = model.language;
    }

    if (isValidString(model.status !== 'string' && model.status !== '' && model.status !== undefined && model.status)) {
      course.status = model.status;
    }

    if (model.discount !== undefined && model.discount !== null && !isNaN(model.discount)) {
      course.discount = model.discount;
    }

    if (model.category && Types.ObjectId.isValid(model.category)) {
      course.category = new Types.ObjectId(model.category);
    }

    if (model.updated_at) {
      course.updated_at = model.updated_at;
    }

    await course.save();
    return course;
  }

  async sortCoursesByName(): Promise<Course[]> {
    const sortedCourses = await this.courseModel.aggregate([
      {
        $match: {
          is_deleted: false,
        },
      },
      {
        $sort: { firstName: 1, lastName: 1 },
      },
    ]);
    return sortedCourses;
  }

  async uploadImage(id: string, filePath: string): Promise<Course> {
    const courseModule = await this.courseModel.findById(id);
    if (!courseModule) {
      throw new HttpException('CourseModule not found', HttpStatus.NOT_FOUND);
    }
    courseModule.avatar = filePath;
    await courseModule.save();
    return courseModule;
  }

  async searchCoursesByName(name: string): Promise<Course[]> {
    const courses = await this.courseModel.aggregate([
      {
        $match: {
          Name: {
            $regex: new RegExp(name, 'i'),
          },
          is_deleted: false,
        },
      },
    ]);
    return courses;
  }
}
