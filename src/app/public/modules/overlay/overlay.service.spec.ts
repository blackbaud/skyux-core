import {
  ApplicationRef,
  NgZone
} from '@angular/core';

import {
  async,
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  Router
} from '@angular/router';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  OverlayFixtureComponent
} from './fixtures/overlay.component.fixture';

import {
  OverlayFixturesModule
} from './fixtures/overlay.fixtures.module';

import {
  SkyOverlayConfig
} from './overlay-config';

import {
  SkyOverlayAdapterService
} from './overlay-adapter.service';

import {
  SkyOverlayInstance
} from './overlay-instance';

import {
  SkyOverlayService
} from './overlay.service';

describe('Overlay service', () => {

  let service: SkyOverlayService;
  let fixture: ComponentFixture<OverlayFixtureComponent>;

  function getAllOverlays(): NodeListOf<Element> {
    return document.querySelectorAll('.sky-overlay');
  }

  function createOverlay(config?: SkyOverlayConfig): SkyOverlayInstance {
    const instance = service.create(config);
    fixture.detectChanges();
    tick();

    return instance;
  }

  function destroyOverlay(instance: SkyOverlayInstance): void {
    service.destroy(instance);
    fixture.detectChanges();
    tick();
  }

  function verifyOverlayCount(num: number): void {
    expect(getAllOverlays().length).toEqual(num);
  }

  function getStyleElement(): HTMLStyleElement {
    return document.getElementsByTagName('head')[0].querySelector(
      '[data-test-selector="sky-overlay-restrict-scroll-styles"]'
    );
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        OverlayFixturesModule
      ]
    });

    fixture = TestBed.createComponent(OverlayFixtureComponent);
  });

  beforeEach(inject(
    [SkyOverlayService],
    (_service: SkyOverlayService) => {
      service = _service;
    }
  ));

  afterEach(fakeAsync(() => {
    service.closeAll();

    fixture.detectChanges();
    tick();

    verifyOverlayCount(0);

    fixture.destroy();
  }));

  it('should create an overlay', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    createOverlay();

    verifyOverlayCount(1);
  }));

  it('should optionally prevent body scroll', fakeAsync(inject(
    [SkyOverlayAdapterService],
    (adapter: SkyOverlayAdapterService) => {
      fixture.detectChanges();
      tick();

      const adapterSpy = spyOn(adapter, 'restrictBodyScroll').and.callThrough();
      const instance = createOverlay();

      let styleElement = getStyleElement();

      expect(adapterSpy).not.toHaveBeenCalled();
      expect(styleElement).toBeNull();

      verifyOverlayCount(1);

      destroyOverlay(instance);
      adapterSpy.calls.reset();

      createOverlay({
        enableScroll: false
      });

      styleElement = getStyleElement();

      expect(adapterSpy).toHaveBeenCalled();
      expect(styleElement.textContent).toContain('body { overflow: hidden }');
      verifyOverlayCount(1);
    }
  )));

  it('should optionally allow closing overlay on click', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const instance = createOverlay();

    SkyAppTestUtility.fireDomEvent(getAllOverlays().item(0), 'click');
    fixture.detectChanges();
    tick();

    // The overlay should still exist.
    verifyOverlayCount(1);

    destroyOverlay(instance);

    createOverlay({
      enableClose: true
    });

    SkyAppTestUtility.fireDomEvent(getAllOverlays().item(0), 'click');
    fixture.detectChanges();
    tick();

    // The overlay should now be gone.
    verifyOverlayCount(0);
  }));

  it('should prevent body scroll after another overlay is closed', fakeAsync(inject(
    [SkyOverlayAdapterService],
    (adapter: SkyOverlayAdapterService) => {
      fixture.detectChanges();
      tick();

      const instance1 = createOverlay({
        enableScroll: false
      });

      const instance2 = createOverlay({
        enableScroll: false
      });

      // Overflow should be applied to the body.
      expect(getStyleElement()).toBeTruthy();
      verifyOverlayCount(2);

      destroyOverlay(instance1);

      // The body should still have overflow applied.
      expect(getStyleElement()).toBeTruthy();
      verifyOverlayCount(1);

      destroyOverlay(instance2);

      // Now that all overlays are closed, the body should not have any overflow.
      expect(getStyleElement()).toBeNull();
      verifyOverlayCount(0);
    }
  )));

  // it('should optionally show a backdrop', fakeAsync(() => {
  // }));

  // it('should close all on navigation change', fakeAsync(inject([NgZone], (ngZone: NgZone) => {
  // })));

  // it('should optionally remain open on navigation change', fakeAsync(inject(
  //   [NgZone],
  //   (ngZone: NgZone) => {
  //   }
  // )));

  // it('should attach a component', fakeAsync(() => {
  // }));

  // it('should attach a component with providers', fakeAsync(() => {
  // }));

  // it('should attach a template', fakeAsync(() => {
  // }));

  // it('should be accessible', async(() => {
  // }));

});
