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
import { OrdersService } from './order.service';
import { ApiTags } from '@nestjs/swagger';
import { createOrdersDto, PagingQueryDto, OrdersUpdateDto } from './order.dto';
import { ResponseInterceptor, MessageResponseInterceptor } from 'src/helpers/interceptors/respone.interceptor';
import { ResponseMessage } from 'src/helpers/decorators/response.message';

@Controller('Orders')
@ApiTags('Orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private ordersService: OrdersService) {}

  @Post('/create')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('orders created.')
  createOrders(@Body() model: createOrdersDto) {
    return this.ordersService.createOrders(model);
  }

  @Get('/getall/')
  @ResponseMessage('orders fetched.')
  @UseInterceptors(ResponseInterceptor)
  getAllOrders(@Query() query: PagingQueryDto) {
    this.logger.log('[getall:orders]');
    return this.ordersService.getAllOrders(query);
  }

  @Get('/getById/:id')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('fetched successfully.')
  async getById(@Param('id') id: string) {
    const product = await this.ordersService.getById(id);
    return product;
  }

  @Delete('/remove/:id')
  @UseInterceptors(MessageResponseInterceptor)
  async softDelete(@Param('id') ordersId: string): Promise<string> {
    const orders = await this.ordersService.softDelete(ordersId);
    if (!orders) {
      throw new HttpException('orders not found', HttpStatus.BAD_REQUEST);
    }
    return 'orders removed';
  }

  @Put('/update/:id')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('orders updated.')
  updateOrders(@Param('id') ordersId: string, @Body() model: OrdersUpdateDto) {
    return this.ordersService.updateOrders<string>(ordersId, model);
  }
}
