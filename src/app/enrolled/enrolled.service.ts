import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { isValidString } from '@app/utils/string';
import { Enrolled } from '@app/models/enrolled.schema';
import { createEnrolledDto, EnrolledUpdateDto } from './enrolled.dto';

@Injectable()
export class EnrolledService {
  constructor(@InjectModel(Enrolled.name) private enrolledModel: Model<Enrolled>, private jwtService: JwtService) {}

  async build(model: createEnrolledDto) {
    const { user, description, course, paymentMethod } = model;

    const enrolled = new this.enrolledModel({
      user,
      description,
      course,
      paymentMethod,
    }).save();
    return enrolled;
  }

  async createEnrolled(model: createEnrolledDto): Promise<Enrolled> {
    return await this.build(model);
  }

  async getAllEnrolled(queryParams): Promise<Enrolled[]> {
    let { page_no = '1', page_size = '50' } = queryParams;

    page_no = Number(page_no);
    page_size = Number(page_size);

    const skip = (page_no - 1) * page_size;

    const all_enrolleds = await this.enrolledModel.aggregate([
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
    return all_enrolleds;
  }

  async getById(id: string): Promise<Enrolled | null> {
    const enrolled = await this.enrolledModel.aggregate([
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
    return enrolled.length > 0 ? enrolled[0] : null;
  }

  async softDelete(id: string): Promise<Enrolled | Observable<Enrolled | any>> {
    const enrolled = await this.enrolledModel.findByIdAndDelete(
      { _id: id },
      {
        $set: {
          is_deleted: true,
        },
      },
    );
    return enrolled;
  }

  async updateEnrolled<T>(id: T | string, model: EnrolledUpdateDto): Promise<Enrolled> {
    const enrolled = await this.enrolledModel.findById({ _id: id });

    if (!enrolled) {
      throw new HttpException('enrolled not found', HttpStatus.BAD_REQUEST);
    }

    if (
      isValidString(
        model.description !== 'string' &&
          model.description !== '' &&
          model.description !== undefined &&
          model.description,
      )
    ) {
      enrolled.description = model.description;
    }

    await enrolled.save();
    return enrolled;
  }
}
