import { Logger, Module, Global } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { Blog } from '@app/models/blog.schema';
import { BlogSchema } from '@app/models/blog.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { BlogService } from './blog.service';
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    JwtModule.register({
      global: true,
      secret: 'qwerty123456',
    }),
  ],
  controllers: [BlogController],
  providers: [BlogService, Logger],
  exports: [BlogService],
})
export class BlogModule {}
