import { Logger, Module, Global } from '@nestjs/common';
import { EnrolledController } from './enrolled.controller';
import { Enrolled } from '@app/models/enrolled.schema';
import { EnrolledSchema } from '@app/models/enrolled.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { EnrolledService } from './enrolled.service';
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Enrolled.name, schema: EnrolledSchema }]),
    JwtModule.register({
      global: true,
      secret: 'qwerty123456',
    }),
  ],
  controllers: [EnrolledController],
  providers: [EnrolledService, Logger],
  exports: [EnrolledService],
})
export class EnrolledModule {}
