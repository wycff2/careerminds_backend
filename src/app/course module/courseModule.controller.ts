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
import { CourseModuleService } from './courseModule.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  createCourseModuleDto,
  PagingQueryDto,
  CourseModuleUpdateDto,
  fileUploadDto,
  UploadVideoDto,
  UploadThumbnailDto,
} from './courseModule.dto';
import { ResponseInterceptor, MessageResponseInterceptor } from 'src/helpers/interceptors/respone.interceptor';
import { ResponseMessage } from 'src/helpers/decorators/response.message';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('CourseModule')
@ApiTags('CourseModule')
export class CourseModuleController {
  private readonly logger = new Logger(CourseModuleController.name);

  constructor(private courseModuleService: CourseModuleService) {}

  @Post('/create')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('courseModule created.')
  createCourseModule(@Body() model: createCourseModuleDto) {
    return this.courseModuleService.createCourseModule(model);
  }

  @Get('/getall/')
  @ResponseMessage('courseModule fetched.')
  @UseInterceptors(ResponseInterceptor)
  getAllCourseModule(@Query() query: PagingQueryDto) {
    this.logger.log('[getall:courseModule]');
    return this.courseModuleService.getAllCourseModule(query);
  }

  @Get('/getById/:id')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('fetched successfully.')
  async getById(@Param('id') id: string) {
    const product = await this.courseModuleService.getById(id);
    return product;
  }

  @Delete('/remove/:id')
  @UseInterceptors(MessageResponseInterceptor)
  async softDelete(@Param('id') courseModuleId: string): Promise<string> {
    const courseModule = this.courseModuleService.softDelete(courseModuleId);
    if (!courseModule) {
      throw new HttpException('courseModule not found', HttpStatus.BAD_REQUEST);
    }
    return 'courseModule removed';
  }

  @Put('/update/:id')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('courseModule updated.')
  updateCourseModule(@Param('id') courseModuleId: string, @Body() model: CourseModuleUpdateDto) {
    return this.courseModuleService.updateCourseModule<string>(courseModuleId, model);
  }

  @Get('/sortByName')
  @ResponseMessage('CourseModules sorted by name.')
  @UseInterceptors(ResponseInterceptor)
  async sortByName() {
    this.logger.log('[sortByName:courseModule]');
    return this.courseModuleService.sortCourseModulesByName();
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
    return this.courseModuleService.uploadImage(id, filePath);
  }

  @Post('/uploadVideo/:id')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './assets/videos',
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
    description: 'Upload video',
    type: UploadVideoDto,
  })
  async uploadVideo(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('File not provided', HttpStatus.BAD_REQUEST);
    }
    const filePath = file.path;
    return this.courseModuleService.uploadVideo(id, filePath);
  }

  @Post('/uploadThumbnail/:id')
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: diskStorage({
        destination: './assets/thumbnail',
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
    description: 'Upload thumbnail',
    type: UploadThumbnailDto,
  })
  async uploadThumbnail(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('File not provided', HttpStatus.BAD_REQUEST);
    }
    const filePath = file.path;
    return this.courseModuleService.uploadThumbnail(id, filePath);
  }

  @Get('/getByCourseId/:courseId')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('CourseModules fetched by course ID.')
  async getByCourseId(@Param('courseId') courseId: string, @Query() query: PagingQueryDto) {
    return this.courseModuleService.getByCourseId(courseId, query);
  }

  // @Delete('/removeAll')
  // @UseInterceptors(MessageResponseInterceptor)
  // async removeAllCourseModules(): Promise<string> {
  //   await this.courseModuleService.removeAllCourseModules();
  //   return 'All courseModules removed permanently';
  // }
}
