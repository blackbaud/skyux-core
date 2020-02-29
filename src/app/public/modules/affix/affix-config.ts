import {
  SkyAffixPlacement
} from './affix-placement';

import {
  SkyAffixHorizontalAlignment
} from './affix-horizontal-alignment';

import {
  SkyAffixVerticalAlignment
} from './affix-vertical-alignment';

export interface SkyAffixConfig {

  /**
   * Indicates if the affix service should try and find the best placement for the subject element if the element would be hidden otherwise.
   */
  enableAutoFit?: boolean;

  /**
   * The horizontal alignment of the subject element to the target element.
   */
  horizontalAlignment?: SkyAffixHorizontalAlignment;

  /**
   * Indicates if the subject element should remain affixed to the target element when the window is scrolled or resized.
   */
  isSticky?: boolean;

  /**
   * The placement of the subject element around the target element.
   */
  placement?: SkyAffixPlacement;

  /**
   * The vertical alignment of the subject element to the target element.
   */
  verticalAlignment?: SkyAffixVerticalAlignment;

}
