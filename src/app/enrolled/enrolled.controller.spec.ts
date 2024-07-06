import { Test, TestingModule } from '@nestjs/testing';
import { EnrolledController } from './enrolled.controller';

describe('EnrolledController', () => {
  let controller: EnrolledController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrolledController],
    }).compile();

    controller = module.get<EnrolledController>(EnrolledController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
