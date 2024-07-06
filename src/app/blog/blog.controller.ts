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
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { ApiTags } from '@nestjs/swagger';
import { createBlogDto, PagingQueryDto, BlogUpdateDto } from './blog.dto';
import { ResponseInterceptor, MessageResponseInterceptor } from 'src/helpers/interceptors/respone.interceptor';
import { ResponseMessage } from 'src/helpers/decorators/response.message';

@Controller('Blog')
@ApiTags('Blog')
export class BlogController {
  private readonly logger = new Logger(BlogController.name);

  constructor(private blogService: BlogService) {}

  @Post('/create')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('blog created.')
  createBlog(@Body() model: createBlogDto) {
    return this.blogService.createBlog(model);
  }

  @Get('/getall/')
  @ResponseMessage('blog fetched.')
  @UseInterceptors(ResponseInterceptor)
  getAllBlog(@Query() query: PagingQueryDto) {
    this.logger.log('[getall:blog]');
    return this.blogService.getAllBlog(query);
  }

  @Get('/getById/:id')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('fetched successfully.')
  async getById(@Param('id') id: string) {
    const product = await this.blogService.getById(id);
    return product;
  }

  @Delete('/remove/:id')
  @UseInterceptors(MessageResponseInterceptor)
  async softDelete(@Param('id') blogId: string): Promise<string> {
    const blog = this.blogService.softDelete(blogId);
    if (!blog) {
      throw new HttpException('blog not found', HttpStatus.BAD_REQUEST);
    }
    return 'blog removed';
  }

  @Put('/update/:id')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('blog updated.')
  updateBlog(@Param('id') blogId: string, @Body() model: BlogUpdateDto) {
    return this.blogService.updateBlog<string>(blogId, model);
  }

}
