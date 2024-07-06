import { Logger, Module, Global } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { Category } from '@app/models/category.schema';
import { CategorySchema } from '@app/models/category.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { CategoryService } from './category.service';
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    JwtModule.register({
      global: true,
      secret: 'qwerty123456',
    }),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, Logger],
  exports: [CategoryService],
})
export class CategoryModule {}
