import { Logger, Module, Global } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { Feedback } from '@app/models/feedback.schema';
import { FeedbackSchema } from '@app/models/feedback.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { FeedbackService } from './feedback.service';
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Feedback.name, schema: FeedbackSchema }]),
    JwtModule.register({
      global: true,
      secret: 'qwerty123456',
    }),
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService, Logger],
  exports: [FeedbackService],
})
export class FeedbackModule {}
