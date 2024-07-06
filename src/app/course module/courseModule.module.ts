import { Logger, Module, Global } from '@nestjs/common';
import { CourseModuleController } from './courseModule.controller';
import { CourseModule } from '@app/models/courseModule.schema';
import { CourseModuleSchema } from '@app/models/courseModule.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { CourseModuleService } from './courseModule.service';
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: CourseModule.name, schema: CourseModuleSchema }]),
    JwtModule.register({
      global: true,
      secret: 'qwerty123456',
    }),
  ],
  controllers: [CourseModuleController],
  providers: [CourseModuleService, Logger],
  exports: [CourseModuleService],
})
export class CourseModuleModule {}
