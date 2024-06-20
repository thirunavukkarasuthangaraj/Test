import { TestBed } from '@angular/core/testing';

import { CustomAccordionService } from './custom-accordion.service';

describe('CustomAccordionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomAccordionService = TestBed.get(CustomAccordionService);
    expect(service).toBeTruthy();
  });
});
