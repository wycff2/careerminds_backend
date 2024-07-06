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
import { ParticipantsService } from './participants.service';
import { ApiTags } from '@nestjs/swagger';
import { createParticipantsDto, PagingQueryDto, ParticipantsUpdateDto } from './participants.dto';
import { ResponseInterceptor, MessageResponseInterceptor } from 'src/helpers/interceptors/respone.interceptor';
import { ResponseMessage } from 'src/helpers/decorators/response.message';

@Controller('Participants')
@ApiTags('Participants')
export class ParticipantsController {
  private readonly logger = new Logger(ParticipantsController.name);

  constructor(private participantsService: ParticipantsService) {}

  @Post('/create')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('participants created.')
  createParticipants(@Body() model: createParticipantsDto) {
    return this.participantsService.createParticipants(model);
  }

  @Get('/getall/')
  @ResponseMessage('participants fetched.')
  @UseInterceptors(ResponseInterceptor)
  getAllParticipants(@Query() query: PagingQueryDto) {
    this.logger.log('[getall:participants]');
    return this.participantsService.getAllParticipants(query);
  }

  @Get('/getById/:id')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('fetched successfully.')
  async getById(@Param('id') id: string) {
    const product = await this.participantsService.getById(id);
    return product;
  }

  @Delete('/remove/:id')
  @UseInterceptors(MessageResponseInterceptor)
  async softDelete(@Param('id') participantsId: string): Promise<string> {
    const participants = this.participantsService.softDelete(participantsId);
    if (!participants) {
      throw new HttpException('participants not found', HttpStatus.BAD_REQUEST);
    }
    return 'participants removed';
  }

  @Put('/update/:id')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('participants updated.')
  updateParticipants(@Param('id') participantsId: string, @Body() model: ParticipantsUpdateDto) {
    return this.participantsService.updateParticipants<string>(participantsId, model);
  }
}
