import { Module, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { db1 as databaseConnection } from '../connection/db';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/server.configuration';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { CourseModuleModule } from './course module/courseModule.module';
import { FeedbackModule } from './feedback/feedback.module';
import { ParticipantsModule } from './participants/participants.module';
import { EnrolledModule } from './enrolled/enrolled.module';
import { RolesModule } from './roles/roles.module';
import { CartsModule } from './cart/cart.module';
import { OrdersModule } from './order/order.module';
import { StripeModule } from './stripe/stripe.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      cache: true,
      expandVariables: true,
    }),
    databaseConnection,
    RolesModule,
    UserModule,
    CategoryModule,
    CourseModule,
    CourseModuleModule,
    FeedbackModule,
    ParticipantsModule,
    EnrolledModule,
    CartsModule,
    OrdersModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
