import {
  TestBed, ComponentFixture, async
} from '@angular/core/testing';

import {
  Router
} from '@angular/router';

import {
  OverlayFixtureComponent,
  OverlayFixturesModule
} from './fixtures';

import {
  SkyOverlayDomAdapterService
} from './overlay-dom-adapter.service';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

describe('Overlay component', function () {

  let fixture: ComponentFixture<OverlayFixtureComponent>;

  function getAllOverlays(): NodeListOf<Element> {
    return document.querySelectorAll('.sky-overlay');
  }

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        OverlayFixturesModule
      ]
    });

    fixture = TestBed.createComponent(OverlayFixtureComponent);
  });

  afterEach(function () {
    fixture.destroy();
  });

  it('should launch an overlay', function () {
    const overlay = fixture.componentInstance.launchOverlay();

    fixture.detectChanges();

    expect(getAllOverlays().length).toEqual(1);

    overlay.close();
  });

  it('should optionally prevent body scroll', async(() => {
    const adapter = TestBed.get(SkyOverlayDomAdapterService);
    const adapterSpy = spyOn(adapter, 'restrictBodyScroll').and.callThrough();

    let overlay = fixture.componentInstance.launchOverlay();

    fixture.detectChanges();

    expect(adapterSpy).not.toHaveBeenCalled();
    expect(document.body.style.overflow).toEqual('');

    adapterSpy.calls.reset();

    overlay.closed.subscribe(() => {
      overlay = fixture.componentInstance.launchOverlay({
        disableScroll: true
      });

      fixture.detectChanges();

      expect(adapterSpy).toHaveBeenCalled();
      expect(document.body.style.overflow).toEqual('hidden');

      overlay.close();
    });

    overlay.close();
  }));

  it('should optionally allow closing overlay when clicking outside', async(() => {
    let overlay = fixture.componentInstance.launchOverlay();

    SkyAppTestUtility.fireDomEvent(document.querySelector('.sky-overlay'), 'click');
    fixture.detectChanges();

    expect(document.querySelector('.sky-overlay')).not.toBeNull();

    overlay.closed.subscribe(() => {
      overlay = fixture.componentInstance.launchOverlay({
        disableClose: false
      });

      SkyAppTestUtility.fireDomEvent(document.querySelector('.sky-overlay'), 'click');
      fixture.detectChanges();

      expect(document.querySelector('.sky-overlay')).toBeNull();

      overlay.close();
    });

    overlay.close();
  }));

  it('should prevent body scroll after another overlay is closed', async(() => {
    const adapter = TestBed.get(SkyOverlayDomAdapterService);
    const adapterSpy = spyOn(adapter, 'releaseBodyScroll').and.callThrough();

    const overlay1 = fixture.componentInstance.launchOverlay({
      disableScroll: true
    });

    const overlay2 = fixture.componentInstance.launchOverlay({
      disableScroll: true
    });

    fixture.detectChanges();

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
    let overlay = fixture.componentInstance.launchOverlay();

    fixture.detectChanges();

    let backdropElement = document.querySelector('.sky-overlay-backdrop');

    expect(backdropElement).toBeNull();

    overlay.closed.subscribe(() => {
      overlay = fixture.componentInstance.launchOverlay({
        showBackdrop: true
      });

      fixture.detectChanges();

      backdropElement = document.querySelector('.sky-overlay-backdrop');

      expect(backdropElement).not.toBeNull();

      overlay.close();
    });

    overlay.close();
  }));

  it('should close on navigation change', async(() => {
    const router = TestBed.get(Router);
    let overlay = fixture.componentInstance.launchOverlay();

    fixture.detectChanges();

    let overlayElement = document.querySelector('.sky-overlay');
    expect(overlayElement).not.toBeNull();

    router.navigate(['/']);
    fixture.detectChanges();

    overlayElement = document.querySelector('.sky-overlay');
    expect(overlayElement).toBeNull();

    overlay.close();
  }));

  it('should optionally remain open on navigation change', async(() => {
    const router = TestBed.get(Router);
    let overlay = fixture.componentInstance.launchOverlay({
      closeOnNavigation: false
    });

    fixture.detectChanges();

    let overlayElement = document.querySelector('.sky-overlay');
    expect(overlayElement).not.toBeNull();

    router.navigate(['/']);
    fixture.detectChanges();

    overlayElement = document.querySelector('.sky-overlay');
    expect(overlayElement).not.toBeNull();

    overlay.close();
  }));

});
