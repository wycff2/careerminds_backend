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
import { CategoryService } from './category.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { createCategoryDto, PagingQueryDto, CategoryUpdateDto, UploadThumbnailDto } from './category.dto';
import { ResponseInterceptor, MessageResponseInterceptor } from 'src/helpers/interceptors/respone.interceptor';
import { ResponseMessage } from 'src/helpers/decorators/response.message';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('Category')
@ApiTags('Category')
export class CategoryController {
  private readonly logger = new Logger(CategoryController.name);

  constructor(private categoryService: CategoryService) {}

  @Post('/create')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('category created.')
  createCategory(@Body() model: createCategoryDto) {
    return this.categoryService.createCategory(model);
  }

  @Get('/getall/')
  @ResponseMessage('category fetched.')
  @UseInterceptors(ResponseInterceptor)
  getAllCategory(@Query() query: PagingQueryDto) {
    this.logger.log('[getall:category]');
    return this.categoryService.getAllCategory(query);
  }

  @Get('/getById/:id')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('fetched successfully.')
  async getById(@Param('id') id: string) {
    const product = await this.categoryService.getById(id);
    return product;
  }

  @Delete('/remove/:id')
  @UseInterceptors(MessageResponseInterceptor)
  async softDelete(@Param('id') categoryId: string): Promise<string> {
    const category = this.categoryService.softDelete(categoryId);
    if (!category) {
      throw new HttpException('category not found', HttpStatus.BAD_REQUEST);
    }
    return 'category removed';
  }

  @Put('/update/:id')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('category updated.')
  updateCategory(@Param('id') categoryId: string, @Body() model: CategoryUpdateDto) {
    return this.categoryService.updateCategory<string>(categoryId, model);
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
    return this.categoryService.uploadThumbnail(id, filePath);
  }

  // @Delete('/removeAll')
  // @UseInterceptors(MessageResponseInterceptor)
  // async removeAllCategorys(): Promise<string> {
  //   await this.categoryService.removeAllCategorys();
  //   return 'All categorys removed permanently';
  // }
}
