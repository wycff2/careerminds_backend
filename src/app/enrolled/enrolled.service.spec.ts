import { Test, TestingModule } from '@nestjs/testing';
import { EnrolledService } from './enrolled.service';

describe('EnrolledService', () => {
  let service: EnrolledService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnrolledService],
    }).compile();

    service = module.get<EnrolledService>(EnrolledService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
