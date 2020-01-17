import {
  StaticProvider
} from '@angular/core';

export interface SkyOverlayConfig {

  /**
   * Specifies if the overlay closes after a navigation change.
   */
  closeOnNavigation?: boolean;

  /**
   * Whether the user can click outside to close the overlay.
   */
  disableClose?: boolean;

  /**
   * Specifies if the overlay prevents the user from scrolling the window.
   */
  disableScroll?: boolean;

  /**
   * Specifies if the backdrop should be visible.
   */
  showBackdrop?: boolean;

  providers?: StaticProvider[];

}
