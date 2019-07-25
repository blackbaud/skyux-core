import {
  SkyLibResourcesTestService
} from '@skyux/i18n/testing/lib-resources-test.service';

import {
  NumericOptions
} from './numeric.options';

import {
  SkyNumericService
} from './numeric.service';

const skyNumeric = new SkyNumericService(
  new SkyLibResourcesTestService() as any
);

describe('Numeric service', () => {
  it('formats 0 with 0 digits as 0', () => {
    const value = 0;
    const options = new NumericOptions();
    options.digits = 0;

    expect(skyNumeric.formatNumber(value, options)).toBe('0');
  });

  it('formats undefined as blank', () => {
    const value: any = undefined;
    const options = new NumericOptions();
    options.digits = 0;

    expect(skyNumeric.formatNumber(value, options)).toBe('');
  });

  it('formats 100 with 0 digits as 100', () => {
    const value = 100;
    const options = new NumericOptions();
    options.digits = 0;

    expect(skyNumeric.formatNumber(value, options)).toBe('100');
  });

  it('formats 1000 with 0 digits as 1K', () => {
    const value = 1000;
    const options = new NumericOptions();
    options.digits = 0;
    expect(skyNumeric.formatNumber(value, options)).toBe('1K');
  });

  it('does not truncate 1000 with 2 digits as 1K when truncate is false', () => {
    const value = 1000;
    const options = new NumericOptions();
    options.digits = 2;
    options.truncate = false;
    expect(skyNumeric.formatNumber(value, options)).toBe('1,000.00');
  });

  it('formats 1000000 with 0 digits as 1M', () => {
    const value = 1000000;
    const options = new NumericOptions();
    options.digits = 0;
    expect(skyNumeric.formatNumber(value, options)).toBe('1M');
  });

  it('does not truncate 1000000 with 2 digits as 1M when truncate is false', () => {
    const value = 1000000;
    const options = new NumericOptions();
    options.digits = 2;
    options.truncate = false;
    expect(skyNumeric.formatNumber(value, options)).toBe('1,000,000.00');
  });

  it('formats 1000000000 with 0 digits as 1B', () => {
    const value = 1000000000;
    const options = new NumericOptions();
    options.digits = 0;
    expect(skyNumeric.formatNumber(value, options)).toBe('1B');
  });

  it('does not truncate 1000000000 with 2 digits as 1B when truncate is false', () => {
    const value = 1000000000;
    const options = new NumericOptions();
    options.digits = 2;
    options.truncate = false;
    expect(skyNumeric.formatNumber(value, options)).toBe('1,000,000,000.00');
  });

  it('formats 1000000000000 with 0 digits as 1T', () => {
    const value = 1000000000000;
    const options = new NumericOptions();
    options.digits = 0;
    expect(skyNumeric.formatNumber(value, options)).toBe('1T');
  });

  it('does not truncate 1000000000000 with 2 digits as 1T when truncate is false', () => {
    const value = 1000000000000;
    const options = new NumericOptions();
    options.digits = 2;
    options.truncate = false;
    expect(skyNumeric.formatNumber(value, options)).toBe('1,000,000,000,000.00');
  });

  it('formats 999000000 as 999M', () => {
    const value = 999000000;
    const options = new NumericOptions();
    options.digits = 2;
    expect(skyNumeric.formatNumber(value, options)).toBe('999M');
  });

  it('formats 1234000 with 2 digits as 1.23M', () => {
    const value = 1234000;
    const options = new NumericOptions();
    options.digits = 2;
    expect(skyNumeric.formatNumber(value, options)).toBe('1.23M');
  });

  it('formats 1235000 with 2 digits as 1.24M', () => {
    const value = 1235000;
    const options = new NumericOptions();
    options.digits = 2;
    expect(skyNumeric.formatNumber(value, options)).toBe('1.24M');
  });

  it('formats 1450 with 1 digits as 1.5K', () => {
    const value = 1450;
    const options = new NumericOptions();
    options.digits = 1;
    expect(skyNumeric.formatNumber(value, options)).toBe('1.5K');
  });

  it('formats 1000 as US dollar with 0 digits as $1K', () => {
    const value = 1000;
    const options = new NumericOptions();
    options.digits = 0;
    options.iso = 'USD';
    options.format = 'currency';
    expect(skyNumeric.formatNumber(value, options)).toBe('$1K');
  });

  it('formats 1450 as US dollar with 1 digits as $1.5K', () => {
    const value = 1450;
    const options = new NumericOptions();
    options.digits = 1;
    options.iso = 'USD';
    options.format = 'currency';
    expect(skyNumeric.formatNumber(value, options)).toBe('$1.5K');
  });

  it('formats 1450 as US dollar with 2 minDigits as $1.5K', () => {
    const value = 1450;
    const options = new NumericOptions();
    options.digits = 2;
    options.minDigits = 2;
    options.iso = 'USD';
    options.format = 'currency';
    expect(skyNumeric.formatNumber(value, options)).toBe('$1.45K');
  });

  it('formats 1500 as Euro with 1 digits as €1.5K', () => {
    const value = 1500;
    const options = new NumericOptions();
    options.digits = 1;
    options.iso = 'EUR';
    options.format = 'currency';
    expect(skyNumeric.formatNumber(value, options)).toBe('€1.5K');
  });

  it('formats 15.50 as Pounds with 2 digits as £15.50', () => {
    const value = 15.50;
    const options = new NumericOptions();
    options.digits = 2;
    options.iso = 'GBP';
    options.format = 'currency';
    expect(skyNumeric.formatNumber(value, options)).toBe('£15.50');
  });

  // Testing ability only after a certain value is specified
  // using the truncateAfter configuration property
  it('does not truncate 5000 to 5K when truncateAfter set to 10000', () => {
    const value = 5000;
    const options = new NumericOptions();
    options.digits = 0;
    options.truncateAfter = 10000;
    expect(skyNumeric.formatNumber(value, options)).toBe('5,000');
  });

  it('formats 10001 to 10K when truncateAfter set to 10000', () => {
    const value = 10001;
    const options = new NumericOptions();
    options.digits = 0;
    options.truncateAfter = 10000;
    expect(skyNumeric.formatNumber(value, options)).toBe('10K');
  });

  // Adjusting test to expect either format of a negative.  MS browsers use system's Region
  // setting for Currency formatting.  For Negative currency, the windows default is parentheses
  // around the number. All other browsers use a preceeding negative sign (-).
  it('formats -15.50 as US dollar with 2 digits as -$15.50', () => {
    const value = -15.50;
    const options = new NumericOptions();
    options.digits = 2;
    options.iso = 'USD';
    options.format = 'currency';
    expect('-$15.50 ($15.50)').toContain(skyNumeric
    .formatNumber(value, options));
  });

  it('formats 145.45 with 1 digits as 145.5', () => {
    const value = 145.45;
    const options = new NumericOptions();
    options.digits = 1;
    expect(skyNumeric.formatNumber(value, options)).toBe('145.5');
  });

  it('formats 1.2345 with 3 digits as 1.235', () => {
    const value = 1.2345;
    const options = new NumericOptions();
    options.digits = 3;
    expect(skyNumeric.formatNumber(value, options)).toBe('1.235');
  });

  it('should handle localized shorten symbols', () => {
    const originalValue = skyNumeric['symbolIndex'][3];
    const value = 1450;
    const options = new NumericOptions();

    skyNumeric['symbolIndex'][3].label = 'c';

    expect(skyNumeric.formatNumber(value, options)).toBe('1.5c');

    skyNumeric['symbolIndex'][3] = originalValue;
  });

  it('should allow truncate options to be optional', () => {
    const value = 1450;
    const options: NumericOptions = {
      digits: 1,
      format: 'currency',
      iso: 'USD'
    };

    expect(skyNumeric.formatNumber(value, options)).toBe('$1,450');
  });

  it('formats 1.00010 with 3 minDigits as 1.000', () => {
    const value = 1.00010;
    const options = new NumericOptions();
    options.minDigits = 3;
    options.digits = 3;
    expect(skyNumeric.formatNumber(value, options)).toBe('1.000');
  });

  it('formats 1.00010 with 3 minDigits but 4 digits as 1.0001', () => {
    const value = 1.00010;
    const options = new NumericOptions();
    options.minDigits = 3;
    options.digits = 4;
    expect(skyNumeric.formatNumber(value, options)).toBe('1.0001');
  });
​
  describe('roundNumber', () => {
    it('returns 0 if the value is not a number', function() {
      // tslint:disable-next-line:no-null-keyword
      expect(skyNumeric.roundNumber(null, 2)).toBe(0);
      expect(skyNumeric.roundNumber(undefined, 2)).toBe(0);
    });
    it('throws an error if precision is less than 0', function() {
      try {
        skyNumeric.roundNumber(1.003, -5);
        fail('It should fail!');
      } catch (err) {
        expect(err.message).toEqual('SkyInvalidArgument: precision must be >= 0');
      }
    });
    it('rounds with a default precision of 0', () => {
        expect(skyNumeric.roundNumber(123)).toBe(123);
        expect(skyNumeric.roundNumber(0.75)).toBe(1);
        expect(skyNumeric.roundNumber(1.005)).toBe(1);
        expect(skyNumeric.roundNumber(1.3555)).toBe(1);
        expect(skyNumeric.roundNumber(1.001)).toBe(1);
        expect(skyNumeric.roundNumber(1.77777)).toBe(2);
        expect(skyNumeric.roundNumber(9.1)).toBe(9);
        expect(skyNumeric.roundNumber(1234.5678)).toBe(1235);
        expect(skyNumeric.roundNumber(1.5383)).toBe(2);
        expect(skyNumeric.roundNumber(-1.5383)).toBe(-2);
        expect(skyNumeric.roundNumber(1.5e3)).toBe(1500);
        expect(skyNumeric.roundNumber(-1.5e3)).toBe(-1500);
    });
    it('rounds correctly when passed a custom precision', () => {
        expect(skyNumeric.roundNumber(123, 0)).toBe(123);
        expect(skyNumeric.roundNumber(123.34, 0)).toBe(123);
        expect(skyNumeric.roundNumber(0.75, 1)).toBe(0.8);
        expect(skyNumeric.roundNumber(1.005, 1)).toBe(1.0);
        expect(skyNumeric.roundNumber(0.75, 2)).toBe(0.75);
        expect(skyNumeric.roundNumber(1.005, 2)).toBe(1.01);
        expect(skyNumeric.roundNumber(1.3555, 2)).toBe(1.36);
        expect(skyNumeric.roundNumber(1.001, 2)).toBe(1.00);
        expect(skyNumeric.roundNumber(1.77777, 2)).toBe(1.78);
        expect(skyNumeric.roundNumber(9.1, 2)).toBe(9.1);
        expect(skyNumeric.roundNumber(1234.5678, 2)).toBe(1234.57);
        expect(skyNumeric.roundNumber(1.5383, 1)).toBe(1.5);
        expect(skyNumeric.roundNumber(1.5383, 2)).toBe(1.54);
        expect(skyNumeric.roundNumber(1.5383, 3)).toBe(1.538);
        expect(skyNumeric.roundNumber(-1.5383, 1)).toBe(-1.5);
        expect(skyNumeric.roundNumber(-1.5383, 2)).toBe(-1.54);
        expect(skyNumeric.roundNumber(-1.5383, 3)).toBe(-1.538);
        expect(skyNumeric.roundNumber(-0.75, 2)).toBe(-0.75);
        expect(skyNumeric.roundNumber(-0.75, 3)).toBe(-0.75);
        expect(skyNumeric.roundNumber(1.5e3, 2)).toBe(1500);
        expect(skyNumeric.roundNumber(-1.5e3, 2)).toBe(-1500);
    });
    it('rounds really small numbers', () => {
        expect(skyNumeric.roundNumber(0.000000000000007, 4)).toBe(0.0000);
        expect(skyNumeric.roundNumber(-0.000000000000007, 4)).toBe(0.0000);
        expect(skyNumeric.roundNumber(7e-15, 4)).toBe(0.0000);
        expect(skyNumeric.roundNumber(-7e-15, 4)).toBe(0.0000);
    });
    it('rounds really big numbers', function () {
      expect(skyNumeric.roundNumber(700000000000000000000.324, 2)).toBe(700000000000000000000.32);
      expect(skyNumeric.roundNumber(700000000000000000000.324, 3)).toBe(700000000000000000000.324);
      expect(skyNumeric.roundNumber(3518437208882.663, 2)).toBe(3518437208882.66);
      expect(skyNumeric.roundNumber(2.5368e15, 1)).toBe(2536800000000000);
      expect(skyNumeric.roundNumber(2536800000000000.119, 2)).toBe(2536800000000000.12);
    });
  });
});
