import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { createHash, compareHash, generateOTP } from '../../utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import { Observable } from 'rxjs';
import { isValidString } from '@app/utils/string';
import { User } from '@app/models/user.schema';
import { createUserDto, UserUpdateDto, VerifyOtpDto, loginwithEmailDto, ChangePasswordDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService) {}

  private async generateUniqueId(name: string): Promise<string> {
    const letters = name.substring(0, 3).toUpperCase();
    let uniqueId;
    let isUnique = false;

    do {
      const numbers = Math.floor(100 + Math.random() * 900).toString();
      uniqueId = `${letters}${numbers}`;
      const existingUser = await this.userModel.findOne({ uniqueId });
      isUnique = !existingUser;
    } while (!isUnique);

    return uniqueId;
  }

  async build(model: createUserDto) {
    const {
      fullName,
      password,
      email,
      role,
      status,
      phoneNumber,
      about,
      address,
      currentJobTitle,
      company,
      yearsOfExperience,
    } = model;

    const user = new this.userModel({
      fullName,
      email,
      password,
      role,
      status,
      phoneNumber,
      about,
      address,
      currentJobTitle,
      company,
      yearsOfExperience,
    }).save();
    return user;
  }

  async createUser(model: createUserDto): Promise<User> {
    const isExist = await this.userModel.findOne({
      email: model.email,
    });

    if (isExist) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    model.password = createHash(model.password);

    let uniqueId = '';
    if (model.role === 'student') {
      uniqueId = await this.generateUniqueId(model.fullName);
    }

    const newUser = new this.userModel({
      ...model,
      uniqueId,
    });

    return await newUser.save();
  }

  async getAllUser(queryParams): Promise<User[]> {
    let { page_no = '1', page_size = '50' } = queryParams;

    page_no = Number(page_no);
    page_size = Number(page_size);

    const skip = (page_no - 1) * page_size;

    const all_users = await this.userModel.aggregate([
      {
        $lookup: {
          from: 'roles',
          localField: 'role',
          foreignField: '_id',
          as: 'role',
        },
      },
      {
        $unwind: {
          path: '$role',
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
    return all_users;
  }

  async login(payload): Promise<Exclude<User, 'password'>> {
    const { email, password } = payload;
    const user = await this.userModel.findOne({ email }).populate('role');

    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const isPassMatched = compareHash(user.password, password);

    if (!isPassMatched) {
      throw new HttpException('Incorrect password', HttpStatus.BAD_REQUEST);
    }

    const token = this.jwtService.sign({ _id: user._id });
    user.token = token;
    user.lastLogin = new Date();
    await user.save();
    user.password = undefined;
    return user.toObject({ getters: true });
  }

  async getById(id: string): Promise<User | null> {
    const user = await this.userModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'role',
          foreignField: '_id',
          as: 'role',
        },
      },
      {
        $unwind: {
          path: '$role',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    return user.length > 0 ? user[0] : null;
  }

  async softDelete(id: string): Promise<User | Observable<User | any>> {
    const user = await this.userModel.findByIdAndDelete({ _id: id });
    return user;
  }

  async updateUser<T>(id: T | string, model: UserUpdateDto): Promise<User> {
    const user = await this.userModel.findById({ _id: id });

    if (!user) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }

    if (
      isValidString(
        model.fullName !== 'string' && model.fullName !== '' && model.fullName !== undefined && model.fullName,
      )
    ) {
      user.fullName = model.fullName;
    }

    if (isValidString(model.about !== 'string' && model.about !== '' && model.about !== undefined && model.about)) {
      user.about = model.about;
    }

    if (isValidString(model.email !== 'string' && model.email !== '' && model.email !== undefined && model.email)) {
      user.email = model.email;
    }

    if (
      isValidString(model.address !== 'string' && model.address !== '' && model.address !== undefined && model.address)
    ) {
      user.address = model.address;
    }

    if (model.phoneNumber) {
      user.phoneNumber = model.phoneNumber;
    }

    if (model.status) {
      user.status = model.status;
    }

    if (
      isValidString(
        model.currentJobTitle !== 'string' &&
          model.currentJobTitle !== '' &&
          model.currentJobTitle !== undefined &&
          model.currentJobTitle,
      )
    ) {
      user.currentJobTitle = model.currentJobTitle;
    }

    if (
      isValidString(model.company !== 'string' && model.company !== '' && model.company !== undefined && model.company)
    ) {
      user.company = model.company;
    }

    if (model.yearsOfExperience) {
      user.yearsOfExperience = model.yearsOfExperience;
    }

    await user.save();
    return user;
  }

  async loginwithEmail(loginwithEmailDto: loginwithEmailDto): Promise<{ otp: string; token: string }> {
    const user = await this.userModel.findOne({ email: loginwithEmailDto.email });

    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    const otp = generateOTP();
    user.otp = otp;
    await user.save();
    console.log(`OTP for password reset: ${otp}`);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'javascript.mspl@gmail.com',
        pass: 'qemq jupm iyse tdzs',
      },
    });

    const mailOptions = {
      from: ' javascript.mspl@gmail.com',
      to: user.email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    const token = this.jwtService.sign({ email: user.email, otp });

    return { otp, token };
  }

  async verifyOTP(verifyOtpDto: VerifyOtpDto): Promise<string> {
    try {
      const decodedToken = this.jwtService.verify(verifyOtpDto.token);
      const email = decodedToken.email;
      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }

      if (user.otp !== verifyOtpDto.otp) {
        console.log('Invalid OTP:', verifyOtpDto.otp);
        throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
      }

      user.otp = verifyOtpDto.otp;
      await user.save();

      return 'OTP verified successfully';
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
  }

  async sortUsersByName(): Promise<User[]> {
    const sortedUsers = await this.userModel.aggregate([
      {
        $sort: { firstName: 1, lastName: 1 },
      },
    ]);
    return sortedUsers;
  }

  async sortUsersByEmail(): Promise<User[]> {
    const sortedUsers = await this.userModel.aggregate([
      {
        $sort: { email: 1 },
      },
    ]);
    return sortedUsers;
  }

  async uploadImage(id: string, filePath: string): Promise<User> {
    const courseModule = await this.userModel.findById(id);
    if (!courseModule) {
      throw new HttpException('CourseModule not found', HttpStatus.NOT_FOUND);
    }
    courseModule.avatar = filePath;
    await courseModule.save();
    return courseModule;
  }

  async getUserByUniqueId(uniqueId: string): Promise<User | null> {
    const user = await this.userModel.findOne({ uniqueId, is_deleted: false });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<string> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPassMatched = compareHash(user.password, changePasswordDto.oldPassword);

    if (!isPassMatched) {
      throw new HttpException('Old password is incorrect', HttpStatus.BAD_REQUEST);
    }

    user.password = createHash(changePasswordDto.newPassword);
    await user.save();

    return 'Password changed successfully';
  }
}
