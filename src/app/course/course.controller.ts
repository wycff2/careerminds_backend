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
import { CourseService } from './course.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { createCourseDto, PagingQueryDto, CourseUpdateDto, fileUploadDto } from './course.dto';
import { ResponseInterceptor, MessageResponseInterceptor } from 'src/helpers/interceptors/respone.interceptor';
import { ResponseMessage } from 'src/helpers/decorators/response.message';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('Course')
@ApiTags('Course')
export class CourseController {
  private readonly logger = new Logger(CourseController.name);

  constructor(private courseService: CourseService) {}

  @Post('/create')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('course created.')
  createCourse(@Body() model: createCourseDto) {
    return this.courseService.createCourse(model);
  }

  @Get('/getall/')
  @ResponseMessage('course fetched.')
  @UseInterceptors(ResponseInterceptor)
  getAllCourse(@Query() query: PagingQueryDto) {
    this.logger.log('[getall:course]');
    return this.courseService.getAllCourse(query);
  }

  @Get('/getById/:id')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('fetched successfully.')
  async getById(@Param('id') id: string) {
    const product = await this.courseService.getById(id);
    return product;
  }

  @Delete('/remove/:id')
  @UseInterceptors(MessageResponseInterceptor)
  async softDelete(@Param('id') courseId: string): Promise<string> {
    const course = this.courseService.softDelete(courseId);
    if (!course) {
      throw new HttpException('course not found', HttpStatus.BAD_REQUEST);
    }
    return 'course removed';
  }

  @Put('/update/:id')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('course updated.')
  updateCourse(@Param('id') courseId: string, @Body() model: CourseUpdateDto) {
    return this.courseService.updateCourse<string>(courseId, model);
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
    return this.courseService.uploadImage(id, filePath);
  }

  @Get('/sortByName')
  @ResponseMessage('Courses sorted by name.')
  @UseInterceptors(ResponseInterceptor)
  async sortByName() {
    this.logger.log('[sortByName:course]');
    return this.courseService.sortCoursesByName();
  }

  @Get('/searchByName')
  @ResponseMessage('Courses found by name.')
  @UseInterceptors(ResponseInterceptor)
  async searchByName(@Query('name') name: string) {
    this.logger.log('[searchByName:course]');
    return this.courseService.searchCoursesByName(name);
  }
}
