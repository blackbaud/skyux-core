export class NumericOptions {
  public digits = 1;
  public format = 'number';
  public iso = 'USD';
  public locale?: string;
  public minDigits?: number;
  public truncate?: boolean = true;
  public truncateAfter?: number = 0;
}
