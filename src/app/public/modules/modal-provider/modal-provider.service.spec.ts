import {
  EventEmitter
} from '@angular/core';

import {
  TestBed
} from '@angular/core/testing';

import {
  Observable
} from 'rxjs';

import {
  SkyCoreModalProviderService
} from './modal-provider.service';

import {
  SkyCoreModalCloseArgs
} from './types/modal-close-args';

import {
  SkyCoreModalInstance
} from './types/modal-instance';

import {
  SKY_CORE_MODAL_PROVIDER
} from './types/modal-provider-injection-token';

describe('Modal provider service', () => {

  it('should handle one provider correctly', () => {
    const callback = new Observable<SkyCoreModalCloseArgs>();
    const event = new EventEmitter();
    const mockInstance: SkyCoreModalInstance = {
      beforeClose: undefined,
      closed: callback,
      componentInstance: {
        testEvent: event
      },
      close: () => {},
      save: () => {},
      cancel: () => {}
    };

    TestBed.configureTestingModule({
      providers: [
        SkyCoreModalProviderService,
        {
          provide: SKY_CORE_MODAL_PROVIDER,
          useValue: {
            type: 'lookup',
            open: () => {
              return mockInstance;
            }
          },
          multi: true
        }
      ]
    });

    const modalProviderService = TestBed.inject(SkyCoreModalProviderService);

    const returnedProvider = modalProviderService.getModalForType('lookup');
    expect(returnedProvider.type).toBe('lookup');
    expect(returnedProvider.open()).toBe(mockInstance);
  });

  it('should handle multiple providers correctly', () => {
    const callback1 = new Observable<SkyCoreModalCloseArgs>();
    const callback2 = new Observable<SkyCoreModalCloseArgs>();
    const event1 = new EventEmitter();
    const event2 = new EventEmitter();
    const mockInstance1: SkyCoreModalInstance = {
      beforeClose: undefined,
      closed: callback1,
      componentInstance: {
        testEvent: event1
      },
      close: () => {},
      save: () => {},
      cancel: () => {}
    };
    const mockInstance2: SkyCoreModalInstance = {
      beforeClose: undefined,
      closed: callback2,
      componentInstance: {
        testEvent: event2
      },
      close: () => {},
      save: () => {},
      cancel: () => {}
    };

    TestBed.configureTestingModule({
      providers: [
        SkyCoreModalProviderService,
        {
          provide: SKY_CORE_MODAL_PROVIDER,
          useValue: {
            type: 'lookup',
            open: () => { return mockInstance1; }
          },
          multi: true
        },
        {
          provide: SKY_CORE_MODAL_PROVIDER,
          useValue: {
            type: 'select-field',
            open: () => { return mockInstance2; }
          },
          multi: true
        }
      ]
    });

    const modalProviderService = TestBed.inject(SkyCoreModalProviderService);

    const returnedProvider = modalProviderService.getModalForType('select-field');
    expect(returnedProvider.type).toBe('select-field');
    expect(returnedProvider.open()).toBe(mockInstance2);
  });

});
