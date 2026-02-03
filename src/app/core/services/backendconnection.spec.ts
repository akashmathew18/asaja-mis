import { TestBed } from '@angular/core/testing';

import { BackendconnectionService } from './backendconnection';

describe('BackendConnection', () => {
  let service: BackendconnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendconnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
