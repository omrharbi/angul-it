import { TestBed } from '@angular/core/testing';

import { Challange } from './challange';

describe('Challange', () => {
  let service: Challange;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Challange);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
