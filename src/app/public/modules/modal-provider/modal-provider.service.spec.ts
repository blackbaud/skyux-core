import {
  EventEmitter
} from '@angular/core';

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
    const callback = new Subject();
    const event = new EventEmitter();

    TestBed.configureTestingModule({
      providers: [
        SkyModalProviderService,
        {
          provide: SKY_MODAL_PROVIDER,
          useValue: {
            type: 'lookup',
            open: () => { return 'foo'; },
            closeCallback: callback,
            events: { 'testEvent': event }
          },
          multi: true
        }
      ]
    });

    const modalProviderService = TestBed.inject(SkyModalProviderService);

    const returnedProvider = modalProviderService.getModalForType('lookup');
    expect(returnedProvider.type).toBe('lookup');
    expect(returnedProvider.open()).toBe('foo');
    expect(returnedProvider.closeCallback).toBe(callback);
    expect(returnedProvider.events['testEvent']).toBe(event);
  });

  it('should handle multiple providers correctly', () => {
    const callback1 = new Subject();
    const callback2 = new Subject();
    const event1 = new EventEmitter();
    const event2 = new EventEmitter();

    TestBed.configureTestingModule({
      providers: [
        SkyModalProviderService,
        {
          provide: SKY_MODAL_PROVIDER,
          useValue: {
            type: 'lookup',
            open: () => { return 'foo'; },
            closeCallback: callback1,
            events: { 'testEvent': event1 }
          },
          multi: true
        },
        {
          provide: SKY_MODAL_PROVIDER,
          useValue: {
            type: 'select-field',
            open: () => { return 'bar'; },
            closeCallback: callback2,
            events: { 'testEvent': event2 }
          },
          multi: true
        }
      ]
    });

    const modalProviderService = TestBed.inject(SkyModalProviderService);

    const returnedProvider = modalProviderService.getModalForType('select-field');
    expect(returnedProvider.type).toBe('select-field');
    expect(returnedProvider.open()).toBe('bar');
    expect(returnedProvider.closeCallback).toBe(callback2);
    expect(returnedProvider.events['testEvent']).toBe(event2);
  });

});
