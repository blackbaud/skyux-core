import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyAppLocaleInfo,
  SkyAppLocaleProvider
} from '@skyux/i18n';

import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';

import {
  PercentPipeTestComponent
} from './fixtures/percent-pipe.component.fixture';

import {
  PercentPipeTestModule
} from './fixtures/percent-pipe.module.fixture';

// import {
//   SkyPercentPipe
// } from './percent.pipe';

describe('Percent pipe', () => {
  let fixture: ComponentFixture<PercentPipeTestComponent>;
  let mockLocaleProvider: SkyAppLocaleProvider;
  let mockLocaleStream: BehaviorSubject<SkyAppLocaleInfo>;

  beforeEach(() => {
    mockLocaleStream = new BehaviorSubject({
      locale: 'en-US'
    });

    mockLocaleProvider = {
      defaultLocale: 'en-US',
      getLocaleInfo: () => mockLocaleStream
    };

    TestBed.configureTestingModule({
      imports: [
        PercentPipeTestModule
      ],
      providers: [
        {
          provide: SkyAppLocaleProvider,
          useValue: mockLocaleProvider
        }
      ]
    });

    fixture = TestBed.createComponent(PercentPipeTestComponent);
  });

  it('should format a string object', () => {
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent.trim();
    const expectedValues = [
      '86.75%'
    ];
    expect(expectedValues).toContain(value);
  });

  it('should ignore empty values', () => {
    fixture.componentInstance.numberValue = undefined;
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent.trim();
    expect(value).toEqual('');
  });

  it('should not support other objects', () => {
    try {
      fixture.componentInstance.numberValue = { foo: 'bar' };
      fixture.detectChanges();
      fixture.nativeElement.textContent.trim();

      fail('It should fail!');
    } catch (err) {
      expect(err).toExist();
    }
  });

  it('should support Angular digitsInfo formats - testing minFractionDigits', () => {
    fixture.componentInstance.format = '1.5-6';
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent.trim();
    const expectedValues = [
      '86.75309'
    ];
    expect(expectedValues).toContain(value);
  });

  it('should support Angular digitsInfo formats - testing maxFractionDigits', () => {
    fixture.componentInstance.format = '1.3-5';
    fixture.detectChanges();
    const value = fixture.nativeElement.textContent.trim();
    const expectedValues = [
      '86.75309'
    ];
    expect(expectedValues).toContain(value);
  });

  it('should default to the 1.0-2 digitsInfo format', () => {
    fixture.componentInstance.format = undefined;
    fixture.detectChanges();
    let value = fixture.nativeElement.textContent.trim();
    let expectedValues = [
      '86.75'
    ];
    expect(expectedValues).toContain(value);
    fixture.componentInstance.numberValue = '.867';
    value = fixture.nativeElement.textContent.trim();
    expectedValues = [
      '86.70'
    ];
    expect(expectedValues).toContain(value);
    fixture.componentInstance.numberValue = '.86';
    value = fixture.nativeElement.textContent.trim();
    expectedValues = [
      '86'
    ];
    expect(expectedValues).toContain(value);
  });

  // it('should support changing locale inline', () => {
  //   fixture.componentInstance.locale = 'fr-CA';
  //   fixture.detectChanges();
  //   const value = fixture.nativeElement.textContent.trim();
  //   const expectedValues = [
  //     '2000-01-01 00 h 00',
  //     '2000-01-01 00:00' // IE 11
  //   ];
  //   expect(expectedValues).toContain(value);
  // });

  // it('should respect locale set by SkyAppLocaleProvider', () => {
  //   fixture.detectChanges();

  //   let value = fixture.nativeElement.textContent.trim();
  //   let expectedValues = [
  //     '1/1/2000, 12:00 AM',
  //     '1/1/2000 12:00 AM' // IE 11
  //   ];
  //   expect(expectedValues).toContain(value);

  //   mockLocaleStream.next({
  //     locale: 'fr-CA'
  //   });

  //   fixture.detectChanges();

  //   value = fixture.nativeElement.textContent.trim();
  //   expectedValues = [
  //     '2000-01-01 00 h 00',
  //     '2000-01-01 00:00' // IE 11
  //   ];
  //   expect(expectedValues).toContain(value);
  // });

  // it('should default to en-US locale', () => {
  //   const date = new Date('01/01/2000');
  //   const pipe = new SkyDatePipe(mockLocaleProvider);
  //   const expectedValues = [
  //     '1/1/2000, 12:00 AM',
  //     '1/1/2000 12:00 AM' // IE 11
  //   ];

  //   const value = pipe.transform(date, 'short');
  //   expect(expectedValues).toContain(value);
  //   expect(pipe['defaultLocale']).toEqual('en-US');
  // });

  it('should work as an injectable', () => {
    fixture.detectChanges();

    const expectedValues = [
      '100.2355%'
    ];

    const result = fixture.componentInstance.getDatePipeResult(
      '1.235487',
      '1.0-4',
      'fr-CA'
    );

    expect(expectedValues).toContain(result);
  });
});
