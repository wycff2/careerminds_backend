import { Test, TestingModule } from '@nestjs/testing';
import { CourseModuleController } from './courseModule.controller';

describe('CourseModuleController', () => {
  let controller: CourseModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseModuleController],
    }).compile();

    controller = module.get<CourseModuleController>(CourseModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
