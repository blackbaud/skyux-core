import {
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

  const expectedCoords = {
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
    expect(subjectStyles.top).toEqual(expectedCoords.aboveCenter.top);
    expect(subjectStyles.left).toEqual(expectedCoords.aboveCenter.left);
  });

  it('should place subject on all sides of the target', () => {
    componentInstance.placement = 'right';
    fixture.detectChanges();

    let subjectStyles = getSubjectStyle();

    expect(subjectStyles.top).toEqual(expectedCoords.rightMiddle.top);
    expect(subjectStyles.left).toEqual(expectedCoords.rightMiddle.left);

    componentInstance.placement = 'below';
    fixture.detectChanges();

    subjectStyles = getSubjectStyle();

    expect(subjectStyles.top).toEqual(expectedCoords.belowCenter.top);
    expect(subjectStyles.left).toEqual(expectedCoords.belowCenter.left);

    componentInstance.placement = 'left';
    fixture.detectChanges();

    subjectStyles = getSubjectStyle();

    expect(subjectStyles.top).toEqual(expectedCoords.leftMiddle.top);
    expect(subjectStyles.left).toEqual(expectedCoords.leftMiddle.left);
  });

  it('should place subject using vertical alignments', () => {
    componentInstance.placement = 'right';
    componentInstance.verticalAlignment = 'top';
    fixture.detectChanges();

    let subjectStyles = getSubjectStyle();

    expect(subjectStyles.top).toEqual(expectedCoords.rightTop.top);
    expect(subjectStyles.left).toEqual(expectedCoords.rightTop.left);

    componentInstance.placement = 'right';
    componentInstance.verticalAlignment = 'bottom';
    fixture.detectChanges();

    subjectStyles = getSubjectStyle();

    expect(subjectStyles.top).toEqual(expectedCoords.rightBottom.top);
    expect(subjectStyles.left).toEqual(expectedCoords.rightBottom.left);

    componentInstance.placement = 'left';
    componentInstance.verticalAlignment = 'top';
    fixture.detectChanges();

    subjectStyles = getSubjectStyle();

    expect(subjectStyles.top).toEqual(expectedCoords.leftTop.top);
    expect(subjectStyles.left).toEqual(expectedCoords.leftTop.left);

    componentInstance.placement = 'left';
    componentInstance.verticalAlignment = 'bottom';
    fixture.detectChanges();

    subjectStyles = getSubjectStyle();

    expect(subjectStyles.top).toEqual(expectedCoords.leftBottom.top);
    expect(subjectStyles.left).toEqual(expectedCoords.leftBottom.left);

  });

  it('should place subject using horizontal alignments', () => {
    componentInstance.placement = 'above';
    componentInstance.horizontalAlignment = 'left';
    fixture.detectChanges();

    let subjectStyles = getSubjectStyle();

    expect(subjectStyles.top).toEqual(expectedCoords.aboveLeft.top);
    expect(subjectStyles.left).toEqual(expectedCoords.aboveLeft.left);

    componentInstance.placement = 'above';
    componentInstance.horizontalAlignment = 'right';
    fixture.detectChanges();

    subjectStyles = getSubjectStyle();

    expect(subjectStyles.top).toEqual(expectedCoords.aboveRight.top);
    expect(subjectStyles.left).toEqual(expectedCoords.aboveRight.left);

    componentInstance.placement = 'below';
    componentInstance.horizontalAlignment = 'left';
    fixture.detectChanges();

    subjectStyles = getSubjectStyle();

    expect(subjectStyles.top).toEqual(expectedCoords.belowLeft.top);
    expect(subjectStyles.left).toEqual(expectedCoords.belowLeft.left);

    componentInstance.placement = 'below';
    componentInstance.horizontalAlignment = 'right';
    fixture.detectChanges();

    subjectStyles = getSubjectStyle();

    expect(subjectStyles.top).toEqual(expectedCoords.belowRight.top);
    expect(subjectStyles.left).toEqual(expectedCoords.belowRight.left);
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

    const affixer = getAffixer();
    const coordsSpy = spyOn(affixer as any, 'getPreferredCoords').and.callThrough();

    fixture.detectChanges();

    // Initially, the subject should be out of view, so all placements should be checked.
    // (It should settle on the preferred placement if all placements are hidden.)
    expect(coordsSpy.calls.allArgs()).toEqual([
      ['above'],
      ['below'],
      ['left'],
      ['right'],
      ['above'] // <-- preferred placement
    ]);
    coordsSpy.calls.reset();

    componentInstance.scrollTargetToTop();
    triggerParentScroll();
    fixture.detectChanges();

    // The 'above' placement is hidden, so it should land on 'below'.
    expect(coordsSpy.calls.allArgs()).toEqual([
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

  it('should emit when subject visibility changes', () => {});

  it('should allow disabling auto-fit', () => {});
});
