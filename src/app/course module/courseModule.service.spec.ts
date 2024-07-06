import { Test, TestingModule } from '@nestjs/testing';
import { CourseModuleService } from './courseModule.service';

describe('CourseModuleService', () => {
  let service: CourseModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseModuleService],
    }).compile();

    service = module.get<CourseModuleService>(CourseModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
