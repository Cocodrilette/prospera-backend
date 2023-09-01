import { Test, TestingModule } from '@nestjs/testing';
import { Errors } from './errors';

describe('Errors', () => {
  let provider: Errors;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Errors],
    }).compile();

    provider = module.get<Errors>(Errors);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
