import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  AffixFixtureComponent
} from './fixtures/affix.component.fixture';

import {
  AffixFixturesModule
} from './fixtures/affix.module.fixture';

import {
  SkyAffixConfig
} from './affix-config';

import {
  SkyAffixer
} from './affixer';

describe('Affix directive', () => {

  const expectedOffsets = {
    aboveLeft: {
      top: '195px',
      left: '245px'
    },
    aboveCenter: {
      top: '195px',
      left: '225px'
    },
    aboveRight: {
      top: '195px',
      left: '205px'
    },
    belowLeft: {
      top: '255px',
      left: '245px'
    },
    belowCenter: {
      top: '255px',
      left: '225px'
    },
    belowRight: {
      top: '255px',
      left: '205px'
    },
    rightTop: {
      top: '245px',
      left: '255px'
    },
    rightMiddle: {
      top: '225px',
      left: '255px'
    },
    rightBottom: {
      top: '205px',
      left: '255px'
    },
    leftTop: {
      top: '245px',
      left: '195px'
    },
    leftMiddle: {
      top: '225px',
      left: '195px'
    },
    leftBottom: {
      top: '205px',
      left: '195px'
    }
  };

  let fixture: ComponentFixture<AffixFixtureComponent>;
  let componentInstance: AffixFixtureComponent;

  function getAffixer(): SkyAffixer {
    return componentInstance.affixDirective['affixer'];
  }

  function getSubjectStyle(): CSSStyleDeclaration {
    return window.getComputedStyle(componentInstance.subjectElement.nativeElement);
  }

  function triggerParentScroll(): void {
    SkyAppTestUtility.fireDomEvent(
      componentInstance.scrollableParent.nativeElement,
      'scroll',
      { bubbles: false }
    );
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AffixFixturesModule
      ]
    });

    fixture = TestBed.createComponent(AffixFixtureComponent);
    componentInstance = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should set default config', () => {
    fixture.detectChanges();

    const affixer = getAffixer();
    const subjectStyles = getSubjectStyle();

    const expectedConfig: SkyAffixConfig = {
      enableAutoFit: false,
      placement: 'above',
      isSticky: false,
      horizontalAlignment: 'center',
      verticalAlignment: 'middle'
    };

    expect(affixer['config']).toEqual(expectedConfig);
    expect(subjectStyles.top).toEqual(expectedOffsets.aboveCenter.top);
    expect(subjectStyles.left).toEqual(expectedOffsets.aboveCenter.left);
  });

  it('should place subject on all sides of the target', () => {
    componentInstance.placement = 'right';
    fixture.detectChanges();

    let subjectStyles = getSubjectStyle();

    expect(subjectStyles.top).toEqual(expectedOffsets.rightMiddle.top);
    expect(subjectStyles.left).toEqual(expectedOffsets.rightMiddle.left);

    componentInstance.placement = 'below';
    fixture.detectChanges();

    subjectStyles = getSubjectStyle();

    expect(subjectStyles.top).toEqual(expectedOffsets.belowCenter.top);
    expect(subjectStyles.left).toEqual(expectedOffsets.belowCenter.left);

    componentInstance.placement = 'left';
    fixture.detectChanges();

    subjectStyles = getSubjectStyle();

    expect(subjectStyles.top).toEqual(expectedOffsets.leftMiddle.top);
    expect(subjectStyles.left).toEqual(expectedOffsets.leftMiddle.left);
  });

  it('should place subject using vertical alignments', () => {
    componentInstance.placement = 'right';
    componentInstance.verticalAlignment = 'top';
    fixture.detectChanges();

    let subjectStyles = getSubjectStyle();

    expect(subjectStyles.top).toEqual(expectedOffsets.rightTop.top);
    expect(subjectStyles.left).toEqual(expectedOffsets.rightTop.left);

    componentInstance.placement = 'right';
    componentInstance.verticalAlignment = 'bottom';
    fixture.detectChanges();

    subjectStyles = getSubjectStyle();

    expect(subjectStyles.top).toEqual(expectedOffsets.rightBottom.top);
    expect(subjectStyles.left).toEqual(expectedOffsets.rightBottom.left);

    componentInstance.placement = 'left';
    componentInstance.verticalAlignment = 'top';
    fixture.detectChanges();

    subjectStyles = getSubjectStyle();

    expect(subjectStyles.top).toEqual(expectedOffsets.leftTop.top);
    expect(subjectStyles.left).toEqual(expectedOffsets.leftTop.left);

    componentInstance.placement = 'left';
    componentInstance.verticalAlignment = 'bottom';
    fixture.detectChanges();

    subjectStyles = getSubjectStyle();

    expect(subjectStyles.top).toEqual(expectedOffsets.leftBottom.top);
    expect(subjectStyles.left).toEqual(expectedOffsets.leftBottom.left);

  });

  it('should place subject using horizontal alignments', () => {
    componentInstance.placement = 'above';
    componentInstance.horizontalAlignment = 'left';
    fixture.detectChanges();

    let subjectStyles = getSubjectStyle();

    expect(subjectStyles.top).toEqual(expectedOffsets.aboveLeft.top);
    expect(subjectStyles.left).toEqual(expectedOffsets.aboveLeft.left);

    componentInstance.placement = 'above';
    componentInstance.horizontalAlignment = 'right';
    fixture.detectChanges();

    subjectStyles = getSubjectStyle();

    expect(subjectStyles.top).toEqual(expectedOffsets.aboveRight.top);
    expect(subjectStyles.left).toEqual(expectedOffsets.aboveRight.left);

    componentInstance.placement = 'below';
    componentInstance.horizontalAlignment = 'left';
    fixture.detectChanges();

    subjectStyles = getSubjectStyle();

    expect(subjectStyles.top).toEqual(expectedOffsets.belowLeft.top);
    expect(subjectStyles.left).toEqual(expectedOffsets.belowLeft.left);

    componentInstance.placement = 'below';
    componentInstance.horizontalAlignment = 'right';
    fixture.detectChanges();

    subjectStyles = getSubjectStyle();

    expect(subjectStyles.top).toEqual(expectedOffsets.belowRight.top);
    expect(subjectStyles.left).toEqual(expectedOffsets.belowRight.left);
  });

  it('should update placement on window scroll', () => {
    fixture.detectChanges();

    const affixer = getAffixer();
    const affixSpy = spyOn(affixer as any, 'affix').and.callThrough();

    componentInstance.isSticky = true;
    fixture.detectChanges();

    expect(affixSpy.calls.count()).toEqual(1);

    SkyAppTestUtility.fireDomEvent(window, 'scroll');
    fixture.detectChanges();

    expect(affixSpy.calls.count()).toEqual(2);
  });

  it('should update placement on window resize', () => {
    fixture.detectChanges();

    const affixer = getAffixer();
    const affixSpy = spyOn(affixer as any, 'affix').and.callThrough();

    componentInstance.isSticky = true;
    fixture.detectChanges();

    expect(affixSpy.calls.count()).toEqual(1);

    SkyAppTestUtility.fireDomEvent(window, 'resize');
    fixture.detectChanges();

    expect(affixSpy.calls.count()).toEqual(2);
  });

  it('should update placement on parent element scroll', () => {
    componentInstance.enableScrollableParent = true;
    fixture.detectChanges();

    const affixer = getAffixer();
    const affixSpy = spyOn(affixer as any, 'affix').and.callThrough();

    componentInstance.isSticky = true;
    fixture.detectChanges();

    expect(affixSpy.calls.count()).toEqual(1);
    affixSpy.calls.reset();

    triggerParentScroll();

    fixture.detectChanges();

    expect(affixSpy.calls.count()).toEqual(1);
  });

  it('should find a suitable placement if preferred placement is hidden', () => {
    componentInstance.enableAutoFit = true;
    componentInstance.isSticky = true;
    componentInstance.enableScrollableParent = true;
    componentInstance.placement = 'above';
    componentInstance.scrollTargetOutOfView();

    const affixer = getAffixer();
    const offsetSpy = spyOn(affixer as any, 'getPreferredOffset').and.callThrough();

    fixture.detectChanges();

    // Initially, the subject should be out of view, so all placements should be checked.
    // (It should settle on the preferred placement if all placements are hidden.)
    expect(offsetSpy.calls.allArgs()).toEqual([
      ['above'],
      ['below'],
      ['left'],
      ['right'],
      ['above'] // <-- preferred placement
    ]);
    offsetSpy.calls.reset();

    componentInstance.scrollTargetToTop();
    triggerParentScroll();
    fixture.detectChanges();

    // The 'above' placement is hidden, so it should land on 'below'.
    expect(offsetSpy.calls.allArgs()).toEqual([
      ['above'],
      ['below']
    ]);
  });

  it('should slightly adjust `left` if subject edges are flush with scrollable parent', () => {
    componentInstance.enableAutoFit = true;
    componentInstance.isSticky = true;
    componentInstance.enableScrollableParent = true;
    componentInstance.placement = 'above';
    fixture.detectChanges();

    componentInstance.scrollTargetToLeft();
    triggerParentScroll();
    fixture.detectChanges();

    let subjectStyles = getSubjectStyle();
    expect(subjectStyles.left).toEqual(`0px`);

    componentInstance.scrollTargetToRight();
    triggerParentScroll();

    fixture.detectChanges();

    subjectStyles = getSubjectStyle();
    const parentRect = componentInstance.scrollableParent.nativeElement.getBoundingClientRect();
    const subjectRect = componentInstance.subjectElement.nativeElement.getBoundingClientRect();
    const expectedLeft = parentRect.width - subjectRect.width;
    expect(subjectStyles.left).toEqual(`${expectedLeft}px`);
  });

  it('should slightly adjust `top` if subject edges are flush with scrollable parent', () => {
    componentInstance.enableAutoFit = true;
    componentInstance.isSticky = true;
    componentInstance.enableScrollableParent = true;
    componentInstance.placement = 'left';
    fixture.detectChanges();

    componentInstance.scrollTargetToTop();
    triggerParentScroll();
    fixture.detectChanges();

    let subjectStyles = getSubjectStyle();
    expect(subjectStyles.top).toEqual(`0px`);

    componentInstance.scrollTargetToBottom();
    triggerParentScroll();
    fixture.detectChanges();

    subjectStyles = getSubjectStyle();
    const parentRect = componentInstance.scrollableParent.nativeElement.getBoundingClientRect();
    const subjectRect = componentInstance.subjectElement.nativeElement.getBoundingClientRect();
    const expectedTop = parentRect.height - subjectRect.height;
    expect(subjectStyles.top).toEqual(`${expectedTop}px`);
  });

  it('should never detach subject `left` from target', () => {
    componentInstance.enableAutoFit = true;
    componentInstance.isSticky = true;
    componentInstance.enableScrollableParent = true;
    componentInstance.placement = 'above';
    componentInstance.horizontalAlignment = 'left';
    fixture.detectChanges();

    const offset = 100;

    componentInstance.scrollTargetToLeft(offset * -1);
    triggerParentScroll();
    fixture.detectChanges();

    let subjectStyles = getSubjectStyle();
    expect(subjectStyles.left).toEqual(`-${offset}px`);

    componentInstance.scrollTargetToRight(offset);
    triggerParentScroll();

    fixture.detectChanges();

    subjectStyles = getSubjectStyle();

    const targetRect = componentInstance.targetElement.nativeElement.getBoundingClientRect();
    const subjectRect = componentInstance.subjectElement.nativeElement.getBoundingClientRect();
    const expectedLeft = targetRect.right - subjectRect.width;

    expect(subjectStyles.left).toEqual(`${expectedLeft}px`);
  });

  it('should never detach subject `top` from target', () => {
    componentInstance.enableAutoFit = true;
    componentInstance.isSticky = true;
    componentInstance.enableScrollableParent = true;
    componentInstance.placement = 'right';
    componentInstance.verticalAlignment = 'top';
    fixture.detectChanges();

    const offset = 100;

    componentInstance.scrollTargetToTop(offset * -1);
    triggerParentScroll();
    fixture.detectChanges();

    let subjectStyles = getSubjectStyle();
    expect(subjectStyles.top).toEqual(`-${offset}px`);

    componentInstance.scrollTargetToBottom(offset);
    triggerParentScroll();

    fixture.detectChanges();

    subjectStyles = getSubjectStyle();

    const targetRect = componentInstance.targetElement.nativeElement.getBoundingClientRect();
    const subjectRect = componentInstance.subjectElement.nativeElement.getBoundingClientRect();
    const expectedTop = targetRect.bottom - subjectRect.height;

    expect(subjectStyles.top).toEqual(`${expectedTop}px`);
  });

  it('should emit when subject visibility changes', () => {
    const spy = spyOn(componentInstance, 'onAffixSubjectVisibilityChange').and.callThrough();

    componentInstance.enableAutoFit = false;
    componentInstance.isSticky = true;
    componentInstance.enableScrollableParent = true;
    fixture.detectChanges();

    // Trigger a change.
    componentInstance.enableAutoFit = true;
    fixture.detectChanges();

    // Scroll to make target visible.
    componentInstance.scrollTargetToTop();
    triggerParentScroll();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith({
      isVisible: true
    });
    expect(spy.calls.count()).toEqual(1);
    spy.calls.reset();

    // Scroll to hide target.
    componentInstance.scrollTargetOutOfView();
    triggerParentScroll();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith({
      isVisible: false
    });
    expect(spy.calls.count()).toEqual(1);
    spy.calls.reset();
  });

  it('should be accessible', async(() => {
    componentInstance.enableScrollableParent = true;
    componentInstance.scrollTargetToTop();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});
