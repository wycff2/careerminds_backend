import { Logger, Module, Global } from '@nestjs/common';
import { CourseController } from './course.controller';
import { Course } from '@app/models/course.schema';
import { CourseSchema } from '@app/models/course.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { CourseService } from './course.service';
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    JwtModule.register({
      global: true,
      secret: 'qwerty123456',
    }),
  ],
  controllers: [CourseController],
  providers: [CourseService, Logger],
  exports: [CourseService],
})
export class CourseModule {}
