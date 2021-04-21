import {
  TestBed
} from '@angular/core/testing';

import {
  Subject
} from 'rxjs';

import {
  SkyModalProviderService
} from './modal-provider.service';

import {
  SKY_MODAL_PROVIDER
} from './types/modal-provider-injection-token';

describe('Modal provider service', () => {

  it('should handle one provider correctly', () => {
    TestBed.configureTestingModule({
      providers: [
        SkyModalProviderService,
        {
          provide: SKY_MODAL_PROVIDER,
          useValue: { type: 'lookup', open: () => { return 'foo'; }, closeCallBack: new Subject() },
          multi: true
        }
      ]
    });

    const modalProviderService = TestBed.inject(SkyModalProviderService);

    const returnedProvider = modalProviderService.getModalForType('lookup');
    expect(returnedProvider.type).toBe('lookup');
    expect(returnedProvider.open()).toBe('foo');
    expect(returnedProvider.closeCallback).not.toBeNull();
  });

  it('should handle multiple providers correctly', () => {
    TestBed.configureTestingModule({
      providers: [
        SkyModalProviderService,
        {
          provide: SKY_MODAL_PROVIDER,
          useValue: { type: 'lookup', open: () => { return 'foo'; }, closeCallBack: new Subject() },
          multi: true
        },
        {
          provide: SKY_MODAL_PROVIDER,
          useValue: { type: 'select-field', open: () => { return 'bar'; }, closeCallBack: new Subject() },
          multi: true
        }
      ]
    });

    const modalProviderService = TestBed.inject(SkyModalProviderService);

    const returnedProvider = modalProviderService.getModalForType('select-field');
    expect(returnedProvider.type).toBe('select-field');
    expect(returnedProvider.open()).toBe('bar');
    expect(returnedProvider.closeCallback).not.toBeNull();
  });

});
