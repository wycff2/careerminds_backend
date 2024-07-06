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
import { EnrolledService } from './enrolled.service';
import { ApiTags } from '@nestjs/swagger';
import { createEnrolledDto, PagingQueryDto, EnrolledUpdateDto } from './enrolled.dto';
import { ResponseInterceptor, MessageResponseInterceptor } from 'src/helpers/interceptors/respone.interceptor';
import { ResponseMessage } from 'src/helpers/decorators/response.message';

@Controller('Enrolled')
@ApiTags('Enrolled')
export class EnrolledController {
  private readonly logger = new Logger(EnrolledController.name);

  constructor(private enrolledService: EnrolledService) {}

  @Post('/create')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('enrolled created.')
  createEnrolled(@Body() model: createEnrolledDto) {
    return this.enrolledService.createEnrolled(model);
  }

  @Get('/getall/')
  @ResponseMessage('enrolled fetched.')
  @UseInterceptors(ResponseInterceptor)
  getAllEnrolled(@Query() query: PagingQueryDto) {
    this.logger.log('[getall:enrolled]');
    return this.enrolledService.getAllEnrolled(query);
  }

  @Get('/getById/:id')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('fetched successfully.')
  async getById(@Param('id') id: string) {
    const product = await this.enrolledService.getById(id);
    return product;
  }

  @Delete('/remove/:id')
  @UseInterceptors(MessageResponseInterceptor)
  async softDelete(@Param('id') enrolledId: string): Promise<string> {
    const enrolled = this.enrolledService.softDelete(enrolledId);
    if (!enrolled) {
      throw new HttpException('enrolled not found', HttpStatus.BAD_REQUEST);
    }
    return 'enrolled removed';
  }

  @Put('/update/:id')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('enrolled updated.')
  updateEnrolled(@Param('id') enrolledId: string, @Body() model: EnrolledUpdateDto) {
    return this.enrolledService.updateEnrolled<string>(enrolledId, model);
  }
}
