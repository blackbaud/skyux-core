import {
  StaticProvider
} from '@angular/core';

export interface SkyOverlayConfig {

  destroyOnBackdropClick?: boolean;

  keepAfterNavigationChange?: boolean;

  preventBodyScroll?: boolean;

  providers?: StaticProvider[];

  showBackdrop?: boolean;

}
