import { Logger, Module, Global } from '@nestjs/common';
import { OrdersController } from './order.controller';
import { Orders } from '@app/models/order.schema';
import { OrdersSchema } from '@app/models/order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { OrdersService } from './order.service';
import { Carts, CartsSchema } from '@app/models/cart.schema';
import { StripeService } from '../stripe/stripe.service';
import { StripePayment, StripePaymentSchema } from '@app/models/stripe.schema';
import { User, UserSchema } from '@app/models/user.schema';
import { Course, CourseSchema } from '@app/models/course.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Orders.name, schema: OrdersSchema },
      { name: Carts.name, schema: CartsSchema },
      { name: StripePayment.name, schema: StripePaymentSchema },
      { name: User.name, schema: UserSchema },
      { name: Course.name, schema: CourseSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: 'qwerty123456',
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, Logger, StripeService],
  exports: [OrdersService],
})
export class OrdersModule {}
