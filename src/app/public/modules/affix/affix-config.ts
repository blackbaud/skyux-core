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

  enableAutoFit?: boolean;

  horizontalAlignment?: SkyAffixHorizontalAlignment;

  isSticky?: boolean;

  placement?: SkyAffixPlacement;

  verticalAlignment?: SkyAffixVerticalAlignment;

}
