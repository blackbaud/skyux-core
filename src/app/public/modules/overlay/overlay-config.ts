import {
  StaticProvider
} from '@angular/core';

export interface SkyOverlayConfig {

  /**
   * Specifies if the overlay should be closed after a navigation change.
   */
  closeOnNavigation?: boolean;

  /**
   * Specifies if the overlay should be closed when a user clicks outside the overlay's content.
   */
  disableClose?: boolean;

  /**
   * Specifies if window scrolling is disabled when the overlay is opened.
   */
  disableScroll?: boolean;

  /**
   * Specifies if the overlay's backdrop should be visible.
   */
  showBackdrop?: boolean;

  /**
   * Specifies an array of providers to supply to the overlay's content component.
   */
  providers?: StaticProvider[];

}
