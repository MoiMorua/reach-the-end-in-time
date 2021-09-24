import { TestBed } from '@angular/core/testing';

import { StepCounterService } from './step-counter.service';

describe('StepCounterService', () => {
  let service: StepCounterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StepCounterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
