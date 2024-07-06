import {
  Controller,
  Post,
  Body,
  Query,
  Get,
  Logger,
  UseInterceptors,
  Param,
  HttpException,
  HttpStatus,
  Delete,
  Put,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  createUserDto,
  PagingQueryDto,
  LoginModel,
  UserUpdateDto,
  VerifyOtpDto,
  loginwithEmailDto,
  fileUploadDto,
  ChangePasswordDto,
} from './user.dto';
import { ResponseInterceptor, MessageResponseInterceptor } from 'src/helpers/interceptors/respone.interceptor';
import { ResponseMessage } from 'src/helpers/decorators/response.message';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('User')
@ApiTags('User')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Post('/create')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('user created.')
  createUser(@Body() model: createUserDto) {
    return this.userService.createUser(model);
  }

  @Get('/getall/')
  @ResponseMessage('user fetched.')
  @UseInterceptors(ResponseInterceptor)
  getAllUser(@Query() query: PagingQueryDto) {
    this.logger.log('[getall:user]');
    return this.userService.getAllUser(query);
  }

  @Post('/login')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('Login successful.')
  async login(@Body() model: LoginModel) {
    return this.userService.login(model);
  }

  @Get('/getById/:id')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('fetched successfully.')
  async getById(@Param('id') id: string) {
    const product = await this.userService.getById(id);
    return product;
  }

  @Delete('/remove/:id')
  @UseInterceptors(MessageResponseInterceptor)
  async softDelete(@Param('id') userId: string): Promise<string> {
    const user = this.userService.softDelete(userId);
    if (!user) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }
    return 'user removed';
  }

  @Put('/update/:id')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('user updated.')
  updateUser(@Param('id') userId: string, @Body() model: UserUpdateDto) {
    return this.userService.updateUser<string>(userId, model);
  }

  @Post('/loginwithemail')
  async forgotPassword(@Body() loginwithEmailDto: loginwithEmailDto) {
    try {
      const result = await this.userService.loginwithEmail(loginwithEmailDto);
      return { message: 'OTP sent to your email', ...result };
    } catch (error) {
      throw new HttpException('Error sending OTP', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Post('/verifyOTP')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('OTP verified successfully.')
  async verifyOTP(@Body() verifyOtpDto: VerifyOtpDto) {
    await this.userService.verifyOTP(verifyOtpDto);
    return 'OTP verified successfully.';
  }

  @Get('/sortByName')
  @ResponseMessage('Users sorted by name.')
  @UseInterceptors(ResponseInterceptor)
  async sortByName() {
    this.logger.log('[sortByName:user]');
    return this.userService.sortUsersByName();
  }

  @Get('/sortByEmail')
  @ResponseMessage('Users sorted by email.')
  @UseInterceptors(ResponseInterceptor)
  async sortByEmail() {
    this.logger.log('[sortByEmail:user]');
    return this.userService.sortUsersByEmail();
  }

  @Post('/uploadImage/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './assets/images',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload image',
    type: fileUploadDto,
  })
  async uploadImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('File not provided', HttpStatus.BAD_REQUEST);
    }
    const filePath = file.path;
    return this.userService.uploadImage(id, filePath);
  }

  @Get('/searchByUniqueId')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('User fetched by uniqueId.')
  async getUserByUniqueId(@Query('uniqueId') uniqueId: string) {
    this.logger.log(`[searchByUniqueId:user] ${uniqueId}`);
    return this.userService.getUserByUniqueId(uniqueId);
  }

  @Put('/changePassword/:id')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('Password changed successfully.')
  async changePassword(@Param('id') userId: string, @Body() changePasswordDto: ChangePasswordDto) {
    return this.userService.changePassword(userId, changePasswordDto);
  }
}
