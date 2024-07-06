import { Logger, Module, Global } from '@nestjs/common';
import { CartsController } from './cart.controller';
import { Carts } from '@app/models/cart.schema';
import { CartsSchema } from '@app/models/cart.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { CartsService } from './cart.service';
import { Course, CourseSchema } from '@app/models/course.schema';
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Carts.name, schema: CartsSchema },
      { name: Course.name, schema: CourseSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: 'qwerty123456',
    }),
  ],
  controllers: [CartsController],
  providers: [CartsService, Logger],
  exports: [CartsService],
})
export class CartsModule {}
