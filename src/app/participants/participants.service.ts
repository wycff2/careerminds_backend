import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { isValidString } from '@app/utils/string';
import { Participants } from '@app/models/participants.schema';
import { createParticipantsDto, ParticipantsUpdateDto } from './participants.dto';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectModel(Participants.name) private participantsModel: Model<Participants>,
    private jwtService: JwtService,
  ) {}

  async build(model: createParticipantsDto) {
    const { user, description, status } = model;

    const participants = new this.participantsModel({
      user,
      description,
      status,
    }).save();
    return participants;
  }

  async createParticipants(model: createParticipantsDto): Promise<Participants> {
    return await this.build(model);
  }

  async getAllParticipants(queryParams): Promise<Participants[]> {
    let { page_no = '1', page_size = '50' } = queryParams;

    page_no = Number(page_no);
    page_size = Number(page_size);

    const skip = (page_no - 1) * page_size;

    const all_participantss = await this.participantsModel.aggregate([
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
    return all_participantss;
  }

  async getById(id: string): Promise<Participants | null> {
    const participants = await this.participantsModel.aggregate([
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
    return participants.length > 0 ? participants[0] : null;
  }

  async softDelete(id: string): Promise<Participants | Observable<Participants | any>> {
    const participants = await this.participantsModel.findByIdAndDelete(
      { _id: id },
      {
        $set: {
          is_deleted: true,
        },
      },
    );
    return participants;
  }

  async updateParticipants<T>(id: T | string, model: ParticipantsUpdateDto): Promise<Participants> {
    const participants = await this.participantsModel.findById({ _id: id });

    if (!participants) {
      throw new HttpException('participants not found', HttpStatus.BAD_REQUEST);
    }

    if (
      isValidString(
        model.description !== 'string' &&
          model.description !== '' &&
          model.description !== undefined &&
          model.description,
      )
    ) {
      participants.description = model.description;
    }

    await participants.save();
    return participants;
  }
}
