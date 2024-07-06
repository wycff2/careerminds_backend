import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { isValidString } from '@app/utils/string';
import { Feedback } from '@app/models/feedback.schema';
import { createFeedbackDto, FeedbackUpdateDto } from './feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(@InjectModel(Feedback.name) private feedbackModel: Model<Feedback>, private jwtService: JwtService) {}

  async build(model: createFeedbackDto) {
    const { user, description, reply, rating } = model;

    const feedback = new this.feedbackModel({
      user,
      description,
      reply,
      rating,
    }).save();
    return feedback;
  }

  async createFeedback(model: createFeedbackDto): Promise<Feedback> {
    return await this.build(model);
  }

  async getAllFeedback(queryParams): Promise<Feedback[]> {
    let { page_no = '1', page_size = '50' } = queryParams;

    page_no = Number(page_no);
    page_size = Number(page_size);

    const skip = (page_no - 1) * page_size;

    const all_feedbacks = await this.feedbackModel.aggregate([
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
    return all_feedbacks;
  }

  async getById(id: string): Promise<Feedback | null> {
    const feedback = await this.feedbackModel.aggregate([
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
    return feedback.length > 0 ? feedback[0] : null;
  }

  async softDelete(id: string): Promise<Feedback | Observable<Feedback | any>> {
    const feedback = await this.feedbackModel.findByIdAndDelete(
      { _id: id },
      {
        $set: {
          is_deleted: true,
        },
      },
    );
    return feedback;
  }

  async updateFeedback<T>(id: T | string, model: FeedbackUpdateDto): Promise<Feedback> {
    const feedback = await this.feedbackModel.findById({ _id: id });

    if (!feedback) {
      throw new HttpException('feedback not found', HttpStatus.BAD_REQUEST);
    }

    if (
      isValidString(
        model.description !== 'string' &&
          model.description !== '' &&
          model.description !== undefined &&
          model.description,
      )
    ) {
      feedback.description = model.description;
    }

    if (isValidString(model.reply !== 'string' && model.reply !== '' && model.reply !== undefined && model.reply)) {
      feedback.reply = model.reply;
    }

    await feedback.save();
    return feedback;
  }
}
