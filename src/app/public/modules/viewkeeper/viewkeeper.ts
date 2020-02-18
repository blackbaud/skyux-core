import {
  SkyViewkeeperOffset
} from './viewkeeper-offset';

import {
  SkyViewkeeperOptions
} from './viewkeeper-options';

import {
  SkyViewkeeperBoundaryInfo
} from './viewkeeper-boundary-info';

import {
  SkyViewkeeperFixedStyles
} from './viewkeeper-fixed-styles';

const CLS_VIEWKEEPER_FIXED = 'sky-viewkeeper-fixed';
const marginBottomOverrides: any[] = [];
const marginTopOverrides: any[] = [];
const config = {
  viewportMarginTop: 0,
  hasOmnibar: true
};

let styleEl: HTMLStyleElement;

let nextIdIndex: number;

function ensureStyleEl() {
  if (!styleEl) {
    styleEl = document.createElement('style');

    let css = document.createTextNode(`
.${CLS_VIEWKEEPER_FIXED} {
  position: fixed !important;
  z-index: 10000;
  opacity: 0.95;
  filter: alpha(opacity=95);
  overflow: hidden;
}
`
    );

    styleEl.appendChild(css);

    document.head.appendChild(styleEl);
  }
}

function nextId(): string {
  nextIdIndex = (nextIdIndex || 0) + 1;

  return 'viewkeeper-' + nextIdIndex;
}

function getOffset(el: HTMLElement): SkyViewkeeperOffset {
  const rect = el.getBoundingClientRect();

  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX
  };
}

function px(value: number | string): string {
  let pxValue = value ? value.toString() : undefined;

  if (typeof value === 'number') {
    pxValue = value + 'px';
  }

  return pxValue;
}

function setElPosition(
  el: HTMLElement,
  left: number | string,
  top: number | string,
  bottom: number | string,
  width: number | string
): void {
  el.style.top = px(top);
  el.style.bottom = px(bottom);
  el.style.left = px(left);

  /*istanbul ignore else*/
  /* sanity check */
  if (width !== null) {
    el.style.width = px(width);
  }
}

function getViewportMarginTop() {
  return marginTopOverrides.length > 0 ?
    marginTopOverrides[marginTopOverrides.length - 1].margin :
    config.viewportMarginTop;
}

function getViewportMarginBottom() {
  return marginBottomOverrides.length > 0 ?
    marginBottomOverrides[marginBottomOverrides.length - 1].margin :
    0;
}

function getHeightWithMargin(el: HTMLElement): number {
  const computedStyle = getComputedStyle(el);

  return el.offsetHeight + parseInt(computedStyle.marginTop, 10) + parseInt(computedStyle.marginBottom, 10);
}

export class SkyViewkeeper {

  private fixToBottom: boolean;

  private setWidth: boolean;

  private id: string;

  private el: HTMLElement;

  private boundaryEl: HTMLElement;

  private verticalOffset: number;

  private setPlaceholderHeight: boolean;

  private onStateChanged: () => any;

  private isFixed: boolean;

  private verticalOffsetEl: HTMLElement;

  private isDestroyed: boolean;

  private currentElFixedTop: number;

  private currentElFixedBottom: number;

  private currentElFixedLeft: number;

  private currentElFixedWidth: number;

  private windowEventHandler: () => void;

  constructor(options: SkyViewkeeperOptions) {
    options = options || /* istanbul ignore next */ {};

    this.fixToBottom = options.fixToBottom;
    this.setWidth = options.setWidth;
    this.id = nextId();
    this.el = options.el;
    this.boundaryEl = options.boundaryEl;
    this.verticalOffset = options.verticalOffset || 0;
    this.setPlaceholderHeight = (options.setPlaceholderHeight !== false);
    this.onStateChanged = options.onStateChanged;
    this.isFixed = false;
    this.verticalOffsetEl = options.verticalOffsetEl;

    this.windowEventHandler = () => this.syncElPosition();

    window.addEventListener('scroll', this.windowEventHandler);
    window.addEventListener('resize', this.windowEventHandler);
    window.addEventListener('orientationchange', this.windowEventHandler);

    ensureStyleEl();
  }

  public syncElPosition() {
    const isCurrentlyFixed = this.isFixed;

    const verticalOffset = this.calculateVerticalOffset();

    // When the element isn't visible, its size can't be calculated, so don't attempt syncing position in this case.
    if (this.el.offsetWidth === 0 && this.el.offsetHeight === 0) {
      return;
    }

    const boundaryInfo = this.getBoundaryInfo();
    const fixedStyles = this.getFixedStyles(boundaryInfo, verticalOffset);

    const doFixEl = this.shouldFixEl(boundaryInfo, verticalOffset);

    if (this.needsUpdating(doFixEl, fixedStyles)) {
      if (doFixEl) {
        this.isFixed = true;
        this.fixEl(boundaryInfo, fixedStyles);
      } else {
        this.isFixed = false;
        this.unfixEl();
      }

      // If we changed if the item is fixed, fire the callback
      if (this.onStateChanged && isCurrentlyFixed !== this.isFixed) {
        this.onStateChanged();
      }
    }

    // vk.windowEventHandler();
  }

  public scrollToTop() {
    const verticalOffset = this.calculateVerticalOffset();

    const spacerId = this.getSpacerId();
    const spacerEl = document.getElementById(spacerId);

    let anchorTop = getOffset(spacerEl || this.el).top;

    document.documentElement.scrollTo({
      top: anchorTop - verticalOffset - getViewportMarginTop()
    });
  }

  public destroy() {
    if (!this.isDestroyed) {
      window.removeEventListener('scroll', this.windowEventHandler);
      window.removeEventListener('resize', this.windowEventHandler);
      window.removeEventListener('orientationchange', this.windowEventHandler);

      this.unfixEl();

      this.el =
        this.boundaryEl =
        this.verticalOffsetEl = undefined;

      this.isDestroyed = true;
    }
  }

  private getSpacerId(): string {
    return this.id + '-spacer';
  }

  private unfixEl(): void {
    const spacerEl = document.getElementById(this.getSpacerId());

    if (spacerEl) {
      spacerEl.remove();
    }

    this.el.classList.remove(CLS_VIEWKEEPER_FIXED);

    this.currentElFixedLeft =
      this.currentElFixedTop =
      this.currentElFixedBottom =
      this.currentElFixedWidth = undefined;

    let width: string;

    if (this.setWidth) {
      width = 'auto';
    }

    setElPosition(this.el, '', '', '', width);
  }

  private calculateVerticalOffset(): number {
    let offset = this.verticalOffset;

    if (this.verticalOffsetEl) {
      const verticalOffsetElTopStyle = this.verticalOffsetEl.style.top;

      let verticalOffsetElTop: number;

      /*istanbul ignore else*/
      /* sanity check */
      if (verticalOffsetElTopStyle) {
        verticalOffsetElTop = parseInt(verticalOffsetElTopStyle, 10) || 0;
      }

      offset += (this.verticalOffsetEl.offsetHeight + verticalOffsetElTop);
    }

    return offset;
  }

  private shouldFixEl(boundaryInfo: SkyViewkeeperBoundaryInfo, verticalOffset: number): boolean {
    let anchorHeight: number;
    let anchorTop: number;
    let doFixEl: boolean;

    if (boundaryInfo.spacerEl) {
      anchorTop = getOffset(boundaryInfo.spacerEl).top;
      anchorHeight = getHeightWithMargin(boundaryInfo.spacerEl);
    } else {
      anchorTop = getOffset(this.el).top;
      anchorHeight = boundaryInfo.elHeight;
    }

    if (this.fixToBottom) {
      // Fix el if the natural bottom of the element would not be on the screen
      doFixEl =
        anchorTop + anchorHeight >
        boundaryInfo.scrollTop + (window.innerHeight - getViewportMarginBottom());
    } else {
      doFixEl = boundaryInfo.scrollTop + verticalOffset + getViewportMarginTop() > anchorTop;
    }

    return doFixEl;
  }

  private getFixedStyles(boundaryInfo: SkyViewkeeperBoundaryInfo, verticalOffset: any): SkyViewkeeperFixedStyles {
    let elFixedBottom: number;
    let elFixedTop: number;

    if (this.fixToBottom) {
      elFixedBottom = getViewportMarginBottom();
    } else {
      // If the element needs to be fixed, this will calculate its position.  The position
      // will be 0 (fully visible) unless the user is scrolling the boundary out of view.
      // In that case, the element should begin to scroll out of view with the
      // rest of the boundary by setting its top position to a negative value.
      elFixedTop = Math.min(
        (boundaryInfo.boundaryBottom - boundaryInfo.elHeight) - boundaryInfo.scrollTop,
        verticalOffset
      );
    }

    const elFixedWidth = boundaryInfo.boundaryEl.getBoundingClientRect().width;
    const elFixedLeft = boundaryInfo.boundaryOffset.left - boundaryInfo.scrollLeft;

    return {
      elFixedBottom,
      elFixedLeft,
      elFixedTop,
      elFixedWidth
    };
  }

  private needsUpdating(doFixEl: boolean, fixedStyles: SkyViewkeeperFixedStyles): boolean {
    if (
      (
        doFixEl &&
        this.currentElFixedLeft === fixedStyles.elFixedLeft &&
        this.currentElFixedTop === fixedStyles.elFixedTop &&
        this.currentElFixedBottom === fixedStyles.elFixedBottom &&
        this.currentElFixedWidth === fixedStyles.elFixedWidth
      ) ||
      (
        !doFixEl &&
        !(this.currentElFixedLeft !== undefined && this.currentElFixedLeft !== null)
      )
    ) {
      // The element is either currently fixed and its position and width do not need
      // to change, or the element is not currently fixed and does not need to be fixed.
      // No changes are needed.
      return false;
    }

    return true;
  }

  private fixEl(
    boundaryInfo: SkyViewkeeperBoundaryInfo,
    fixedStyles: SkyViewkeeperFixedStyles
  ): void {
    const el = this.el;

    if (!boundaryInfo.spacerEl) {
      const spacerHeight = this.setPlaceholderHeight ? boundaryInfo.elHeight : 0;

      const spacerEl = document.createElement('div');
      spacerEl.id = boundaryInfo.spacerId;
      spacerEl.style.height = px(spacerHeight);

      el.parentNode.insertBefore(spacerEl, el.nextSibling);
    }

    el.classList.add(CLS_VIEWKEEPER_FIXED);

    this.currentElFixedTop = fixedStyles.elFixedTop;
    this.currentElFixedBottom = fixedStyles.elFixedBottom;
    this.currentElFixedLeft = fixedStyles.elFixedLeft;
    this.currentElFixedWidth = fixedStyles.elFixedWidth;

    let width: number;

    if (this.setWidth) {
      width = fixedStyles.elFixedWidth;
    }

    setElPosition(
      el,
      fixedStyles.elFixedLeft,
      fixedStyles.elFixedTop,
      fixedStyles.elFixedBottom,
      width
    );
  }

  private getBoundaryInfo(): SkyViewkeeperBoundaryInfo {
    const spacerId = this.getSpacerId();

    const spacerEl = document.getElementById(spacerId);

    const boundaryEl = this.boundaryEl;

    const boundaryOffset = getOffset(boundaryEl);
    const boundaryTop = boundaryOffset.top;
    const boundaryBottom = boundaryTop + boundaryEl.getBoundingClientRect().height;

    const scrollLeft = document.documentElement.scrollLeft;
    const scrollTop = document.documentElement.scrollTop;

    const elHeight = getHeightWithMargin(this.el);

    return {
      boundaryBottom,
      boundaryOffset,
      boundaryEl,
      elHeight,
      scrollLeft,
      scrollTop,
      spacerId,
      spacerEl
    };
  }

}
