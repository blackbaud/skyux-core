import {
  SkyAffixHorizontalAlignment
} from './affix-horizontal-alignment';

import {
  SkyAffixVerticalAlignment
} from './affix-vertical-alignment';

export interface SkyAffixConfig {

  horizontalAlignment?: SkyAffixHorizontalAlignment;

  verticalAlignment?: SkyAffixVerticalAlignment;

  isSticky?: boolean;

  // keepWithinViewport?: boolean;

}
