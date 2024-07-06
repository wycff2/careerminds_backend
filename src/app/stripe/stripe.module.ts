import { Logger, Module, Global } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripePayment } from '@app/models/stripe.schema';
import { StripePaymentSchema } from '@app/models/stripe.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { StripeService } from './stripe.service';
import { User, UserSchema } from '@app/models/user.schema';
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StripePayment.name, schema: StripePaymentSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: 'qwerty123456',
    }),
  ],
  controllers: [StripeController],
  providers: [StripeService, Logger],
  exports: [StripeService],
})
export class StripeModule {}
