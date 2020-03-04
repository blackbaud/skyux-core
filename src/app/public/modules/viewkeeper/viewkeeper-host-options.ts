import {
  Injectable
} from '@angular/core';

import {
  SkyViewkeeperOptions
} from './viewkeeper-options';

@Injectable()
export class SkyViewkeeperHostOptions implements SkyViewkeeperOptions {
  public setWidth?: boolean;

  public el?: HTMLElement;

  public boundaryEl?: HTMLElement;

  public verticalOffset?: number;

  public verticalOffsetEl?: HTMLElement;

  public viewportMarginTop?: number;
}
