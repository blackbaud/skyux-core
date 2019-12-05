import { SkyAffixPlacement } from './affix-placement';
import { SkyAffixHorizontalAlignment } from './affix-horizontal-alignment';

export interface SkyAffixConfig {

  isSticky?: boolean;

  placement?: SkyAffixPlacement;

  horizontalAlignment?: SkyAffixHorizontalAlignment;

}
