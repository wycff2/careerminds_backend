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
import { FeedbackService } from './feedback.service';
import { ApiTags } from '@nestjs/swagger';
import { createFeedbackDto, PagingQueryDto, FeedbackUpdateDto } from './feedback.dto';
import { ResponseInterceptor, MessageResponseInterceptor } from 'src/helpers/interceptors/respone.interceptor';
import { ResponseMessage } from 'src/helpers/decorators/response.message';

@Controller('Feedback')
@ApiTags('Feedback')
export class FeedbackController {
  private readonly logger = new Logger(FeedbackController.name);

  constructor(private feedbackService: FeedbackService) {}

  @Post('/create')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('feedback created.')
  createFeedback(@Body() model: createFeedbackDto) {
    return this.feedbackService.createFeedback(model);
  }

  @Get('/getall/')
  @ResponseMessage('feedback fetched.')
  @UseInterceptors(ResponseInterceptor)
  getAllFeedback(@Query() query: PagingQueryDto) {
    this.logger.log('[getall:feedback]');
    return this.feedbackService.getAllFeedback(query);
  }

  @Get('/getById/:id')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('fetched successfully.')
  async getById(@Param('id') id: string) {
    const product = await this.feedbackService.getById(id);
    return product;
  }

  @Delete('/remove/:id')
  @UseInterceptors(MessageResponseInterceptor)
  async softDelete(@Param('id') feedbackId: string): Promise<string> {
    const feedback = this.feedbackService.softDelete(feedbackId);
    if (!feedback) {
      throw new HttpException('feedback not found', HttpStatus.BAD_REQUEST);
    }
    return 'feedback removed';
  }

  @Put('/update/:id')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('feedback updated.')
  updateFeedback(@Param('id') feedbackId: string, @Body() model: FeedbackUpdateDto) {
    return this.feedbackService.updateFeedback<string>(feedbackId, model);
  }

}
