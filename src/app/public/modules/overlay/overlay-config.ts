import {
  StaticProvider
} from '@angular/core';

export interface SkyOverlayConfig {

  destroyOnOverlayClick?: boolean;

  keepAfterNavigationChange?: boolean;

  providers?: StaticProvider[];

  preventBodyScroll?: boolean;

  showBackdrop?: boolean;

}
