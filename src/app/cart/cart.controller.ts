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
import { CartsService } from './cart.service';
import { ApiTags } from '@nestjs/swagger';
import { createCartsDto, PagingQueryDto, CartsUpdateDto } from './cart.dto';
import { ResponseInterceptor, MessageResponseInterceptor } from 'src/helpers/interceptors/respone.interceptor';
import { ResponseMessage } from 'src/helpers/decorators/response.message';

@Controller('Carts')
@ApiTags('Carts')
export class CartsController {
  private readonly logger = new Logger(CartsController.name);

  constructor(private cartsService: CartsService) {}

  @Post('/create')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('carts created.')
  createCarts(@Body() model: createCartsDto) {
    return this.cartsService.createCarts(model);
  }

  @Get('/getall/')
  @ResponseMessage('carts fetched.')
  @UseInterceptors(ResponseInterceptor)
  getAllCarts(@Query() query: PagingQueryDto) {
    this.logger.log('[getall:carts]');
    return this.cartsService.getAllCarts(query);
  }

  @Get('/getById/:id')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('fetched successfully.')
  async getById(@Param('id') id: string) {
    const product = await this.cartsService.getById(id);
    return product;
  }

  @Delete('/remove/:id')
  @UseInterceptors(MessageResponseInterceptor)
  async softDelete(@Param('id') cartsId: string): Promise<string> {
    const carts = this.cartsService.softDelete(cartsId);
    if (!carts) {
      throw new HttpException('carts not found', HttpStatus.BAD_REQUEST);
    }
    return 'carts removed';
  }

  @Put('/update/:id')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('carts updated.')
  updateCarts(@Param('id') cartsId: string, @Body() model: CartsUpdateDto) {
    return this.cartsService.updateCarts<string>(cartsId, model);
  }
}
