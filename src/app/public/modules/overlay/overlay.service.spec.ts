import {
  ApplicationRef,
  NgZone
} from '@angular/core';

import {
  async,
  inject,
  TestBed
} from '@angular/core/testing';

import {
  Router
} from '@angular/router';

import {
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  OverlayFixtureContext
} from './fixtures/overlay-context.fixture';

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
  SkyOverlayDomAdapterService
} from './overlay-dom-adapter.service';

import {
  SkyOverlayInstance
} from './overlay-instance';

import {
  SkyOverlayService
} from './overlay.service';

describe('Overlay service', () => {

  let service: SkyOverlayService;
  let app: ApplicationRef;
  let uniqueId: number;

  function getAllOverlays(): NodeListOf<Element> {
    return document.querySelectorAll('.sky-overlay');
  }

  function createOverlay(config?: SkyOverlayConfig): SkyOverlayInstance<OverlayFixtureComponent> {
    return service.create(OverlayFixtureComponent, config);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        OverlayFixturesModule
      ]
    });

    uniqueId = 0;
    service = TestBed.get(SkyOverlayService);
    app = TestBed.get(ApplicationRef);
  });

  it('should create an overlay', function () {
    const overlay = createOverlay();

    app.tick();

    expect(getAllOverlays().length).toEqual(1);

    overlay.close();
  });

  it('should optionally prevent body scroll', async(() => {
    const adapter = TestBed.get(SkyOverlayDomAdapterService);
    const adapterSpy = spyOn(adapter, 'restrictBodyScroll').and.callThrough();

    let overlay = createOverlay();

    app.tick();

    expect(adapterSpy).not.toHaveBeenCalled();
    expect(document.body.style.overflow).toEqual('');

    adapterSpy.calls.reset();

    overlay.closed.subscribe(() => {
      overlay = createOverlay({
        enableScroll: false
      });

      app.tick();

      expect(adapterSpy).toHaveBeenCalled();
      expect(document.body.style.overflow).toEqual('hidden');

      overlay.close();
    });

    overlay.close();
  }));

  it('should optionally allow closing overlay when clicking outside', async(() => {
    let overlay = createOverlay();

    SkyAppTestUtility.fireDomEvent(getAllOverlays().item(0), 'click');
    app.tick();

    expect(getAllOverlays().item(0)).not.toBeNull();

    overlay.closed.subscribe(() => {
      overlay = createOverlay({
        enableClose: true
      });

      SkyAppTestUtility.fireDomEvent(getAllOverlays().item(0), 'click');
      app.tick();

      expect(getAllOverlays().item(0)).toBeNull();

      overlay.close();
    });

    overlay.close();
  }));

  it('should prevent body scroll after another overlay is closed', async(() => {
    const adapter = TestBed.get(SkyOverlayDomAdapterService);
    const adapterSpy = spyOn(adapter, 'releaseBodyScroll').and.callThrough();

    const overlay1 = createOverlay({
      enableScroll: false
    });

    const overlay2 = createOverlay({
      enableScroll: false
    });

    app.tick();

    overlay2.closed.subscribe(() => {
      expect(adapterSpy).not.toHaveBeenCalled();
      adapterSpy.calls.reset();

      overlay1.closed.subscribe(() => {
        expect(adapterSpy).toHaveBeenCalled();
      });

      overlay1.close();
    });

    overlay2.close();
  }));

  it('should optionally show a backdrop', async(() => {
    let overlay = createOverlay();

    app.tick();

    let backdropElement = document.querySelector('.sky-overlay-backdrop');

    expect(backdropElement).toBeNull();

    overlay.closed.subscribe(() => {
      overlay = createOverlay({
        showBackdrop: true
      });

      app.tick();

      backdropElement = document.querySelector('.sky-overlay-backdrop');

      expect(backdropElement).not.toBeNull();

      overlay.close();
    });

    overlay.close();
  }));

  it('should close on navigation change', async(inject([NgZone], (ngZone: NgZone) => {
    const router = TestBed.get(Router);
    let overlay = createOverlay();

    app.tick();

    expect(getAllOverlays().item(0)).not.toBeNull();

    // Run navigation through NgZone to avoid warnings in the console.
    ngZone.run(() => {
      router.navigate(['/']);
      app.tick();
      expect(getAllOverlays().item(0)).toBeNull();
      overlay.close();
    });
  })));

  it('should optionally remain open on navigation change', async(inject(
    [NgZone],
    (ngZone: NgZone) => {
      const router = TestBed.get(Router);
      let overlay = createOverlay({
        closeOnNavigation: false
      });

      app.tick();

      expect(getAllOverlays().item(0)).not.toBeNull();

      ngZone.run(() => {
        router.navigate(['/']);
        app.tick();

        expect(getAllOverlays().item(0)).not.toBeNull();

        overlay.close();
      });
    }
  )));

  it('should pass providers to the overlay content', async(() => {
    const config: SkyOverlayConfig = {
      providers: [{
        provide: OverlayFixtureContext,
        useValue: new OverlayFixtureContext(++uniqueId)
      }]
    };

    const overlay = createOverlay(config);

    app.tick();

    expect(getAllOverlays().item(0).textContent).toContain('Overlay content ID: 1');

    overlay.close();

  }));

});
