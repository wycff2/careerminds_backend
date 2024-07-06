import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { isValidString } from '@app/utils/string';
import { CourseModule } from '@app/models/courseModule.schema';
import { createCourseModuleDto, CourseModuleUpdateDto } from './courseModule.dto';
import { isArray } from 'class-validator';

@Injectable()
export class CourseModuleService {
  constructor(
    @InjectModel(CourseModule.name) private courseModuleModel: Model<CourseModule>,
    private jwtService: JwtService,
  ) {}

  async build(model: createCourseModuleDto) {
    const { course, Name, status, description } = model;

    const courseModule = new this.courseModuleModel({
      course,
      Name,
      status,
      description,
    }).save();
    return courseModule;
  }

  async createCourseModule(model: createCourseModuleDto): Promise<CourseModule> {
    return await this.build(model);
  }

  async getAllCourseModule(queryParams): Promise<CourseModule[]> {
    let { page_no = '1', page_size = '50' } = queryParams;

    page_no = Number(page_no);
    page_size = Number(page_size);

    const skip = (page_no - 1) * page_size;

    const all_courseModules = await this.courseModuleModel.aggregate([
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
    return all_courseModules;
  }

  async getById(id: string): Promise<CourseModule | null> {
    const courseModules = await this.courseModuleModel.aggregate([
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

    return courseModules.length > 0 ? courseModules[0] : null;
  }

  async softDelete(id: string): Promise<CourseModule | Observable<CourseModule | any>> {
    const courseModule = await this.courseModuleModel.findByIdAndDelete(
      { _id: id },
      {
        $set: {
          is_deleted: true,
        },
      },
    );
    return courseModule;
  }

  async updateCourseModule<T>(id: T | string, model: CourseModuleUpdateDto): Promise<CourseModule> {
    const courseModule = await this.courseModuleModel.findById({ _id: id });

    if (!courseModule) {
      throw new HttpException('courseModule not found', HttpStatus.BAD_REQUEST);
    }

    if (isValidString(model.Name !== 'string' && model.Name !== '' && model.Name !== undefined && model.Name)) {
      courseModule.Name = model.Name;
    }

    if (isArray(model.description !== undefined && model.description)) {
      courseModule.description = model.description;
    }

    if (isValidString(model.status !== 'string' && model.status !== '' && model.status !== undefined && model.status)) {
      courseModule.status = model.status;
    }

    if (model.updated_at) {
      courseModule.updated_at = model.updated_at;
    }

    await courseModule.save();
    return courseModule;
  }

  async sortCourseModulesByName(): Promise<CourseModule[]> {
    const sortedCourseModules = await this.courseModuleModel.aggregate([
      {
        $match: {
          is_deleted: false,
        },
      },
      {
        $sort: { firstName: 1, lastName: 1 },
      },
    ]);
    return sortedCourseModules;
  }

  async uploadImage(id: string, filePath: string): Promise<CourseModule> {
    const courseModule = await this.courseModuleModel.findById(id);
    if (!courseModule) {
      throw new HttpException('CourseModule not found', HttpStatus.NOT_FOUND);
    }
    courseModule.avatar = filePath;
    await courseModule.save();
    return courseModule;
  }

  async uploadVideo(id: string, filePath: string): Promise<CourseModule> {
    const courseModule = await this.courseModuleModel.findById(id);
    if (!courseModule) {
      throw new HttpException('CourseModule not found', HttpStatus.NOT_FOUND);
    }
    courseModule.video = filePath;
    await courseModule.save();
    return courseModule;
  }

  async uploadThumbnail(id: string, filePath: string): Promise<CourseModule> {
    const courseModule = await this.courseModuleModel.findById(id);
    if (!courseModule) {
      throw new HttpException('CourseModule not found', HttpStatus.NOT_FOUND);
    }
    courseModule.thumbnail = filePath;
    await courseModule.save();
    return courseModule;
  }

  async getByCourseId(courseId: string, queryParams): Promise<CourseModule[]> {
    let { page_no = '1', page_size = '50' } = queryParams;

    page_no = Number(page_no);
    page_size = Number(page_size);

    const skip = (page_no - 1) * page_size;

    const all_courseModules = await this.courseModuleModel.aggregate([
      {
        $match: {
          course: new Types.ObjectId(courseId),
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
    return all_courseModules;
  }

  // async removeAllCourseModules(): Promise<void> {
  //   await this.courseModuleModel.deleteMany();
  // }
}
