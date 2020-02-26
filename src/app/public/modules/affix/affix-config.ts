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

  placement: SkyAffixPlacement;

  horizontalAlignment?: SkyAffixHorizontalAlignment;

  isSticky?: boolean;

  verticalAlignment?: SkyAffixVerticalAlignment;

}
