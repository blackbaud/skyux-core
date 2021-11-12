import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { ScrollableHostFixtureComponent } from "./fixtures/scrollable-host.component.fixture";
import { take } from "rxjs/operators";
import { Subject } from "rxjs";
import { SkyAppTestUtility } from "@skyux-sdk/testing";

describe('Scrollable host service', () => {

  let cmp: ScrollableHostFixtureComponent;
  let fixture: ComponentFixture<ScrollableHostFixtureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ScrollableHostFixtureComponent
      ]
    });

    fixture = TestBed.createComponent(ScrollableHostFixtureComponent);
    cmp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return the current scrollable parent', () => {
    expect(cmp.getScrollableHost()).toBe(cmp.parent.nativeElement);
  });

  it('should return the window if no scrollable parent', () => {
    cmp.isParentScrollable = false;
    fixture.detectChanges();

    expect(cmp.getScrollableHost()).toBe(window);
  });

  // Sanity check
  it('should return the window if the element ref returns no native element', () => {
    cmp.isParentScrollable = false;
    fixture.detectChanges();

    expect(cmp.getScrollableHost({ nativeElement: undefined })).toBe(window);
  });

  // Sanity check
  it('should return the window if the element is not scrollable and the parent is not an element', () => {
    cmp.isParentScrollable = false;
    fixture.detectChanges();

    spyOnProperty(cmp.target.nativeElement, 'parentNode', 'get').and.returnValue(undefined);

    expect(cmp.getScrollableHost()).toBe(window);
  });


  it('should return an observable with the initial value of the current scrollable parent', async () => {
    const completionObservable = new Subject<void>();

    const scrollableHostObservable = cmp.watchScrollableHost(completionObservable);

    scrollableHostObservable.pipe(take(1)).subscribe((scrollableHost) => {
      expect(scrollableHost).toBe(cmp.parent.nativeElement);
      completionObservable.next();
    });
  });

  // Using `done` here as with just `async` the test runner is moving the content when it shouldn't
  // which causes issues with finding the parent correctly.
  it('should update observable with new scrollable parent when it changes', (done) => {
    let obserableCount = 0;
    const completionObservable = new Subject<void>();

    const scrollableHostObservable = cmp.watchScrollableHost(completionObservable);

    scrollableHostObservable.pipe(take(2)).subscribe((scrollableHost) => {
      if (obserableCount === 0) {
        expect(scrollableHost).toBe(cmp.parent.nativeElement);
        cmp.isParentScrollable = false;
        obserableCount++;
        fixture.detectChanges();
      } else {
        expect(scrollableHost).toBe(window);
        completionObservable.next();
        done();
      }
    });
  });

  it('should return all scroll events from the current scrollable host when they are subscribed to', () => {
    const completionObservable = new Subject<void>();

    const scrollObservable = cmp.watchScrollableHostScrollEvents(completionObservable);

    spyOn(scrollObservable as Subject<void>, 'next');

    SkyAppTestUtility.fireDomEvent(cmp.parent.nativeElement, 'scroll', { bubbles: false });

    fixture.detectChanges();

    expect((<Subject<void>>scrollObservable).next).toHaveBeenCalledTimes(1);
    completionObservable.next();
  });

  it('should return all scroll events from a new scrollable host it changes', (done) => {
    const completionObservable = new Subject<void>();
    let observableCount = 0;
    cmp.isGrandparentScrollable = true;

    const scrollObservable = cmp.watchScrollableHostScrollEvents(completionObservable);

    scrollObservable.pipe(take(4)).subscribe(async () => {
      if (observableCount === 0) {
        observableCount++;
        cmp.isParentScrollable = false;
        fixture.detectChanges();
      } else if (observableCount === 1) {
        observableCount++;
        // We have to detect changes and await here again to ensure that the scroll listener is fully setup.
        fixture.detectChanges();
        await fixture.whenStable();
        SkyAppTestUtility.fireDomEvent(cmp.grandparent.nativeElement, 'scroll', { bubbles: false });
        fixture.detectChanges();
      } else if (observableCount === 2) {
        observableCount++;
        SkyAppTestUtility.fireDomEvent(cmp.parent.nativeElement, 'scroll', { bubbles: false });
        fixture.detectChanges();
        done();
      } else {
        fail('observable should only be hit 3 times - second parent scroll should not fire observable');
      }
    });

    SkyAppTestUtility.fireDomEvent(cmp.parent.nativeElement, 'scroll');
  });

  it('should stop watching for scroll events when the completeionObservable emits', () => {
    const completionObservable = new Subject<void>();

    const scrollObservable = cmp.watchScrollableHostScrollEvents(completionObservable);

    spyOn(scrollObservable as Subject<void>, 'next');

    SkyAppTestUtility.fireDomEvent(cmp.parent.nativeElement, 'scroll', { bubbles: false });

    fixture.detectChanges();

    expect((<Subject<void>>scrollObservable).next).toHaveBeenCalledTimes(1);
    completionObservable.next();

    fixture.detectChanges();

    SkyAppTestUtility.fireDomEvent(cmp.parent.nativeElement, 'scroll', { bubbles: false });

    fixture.detectChanges();

    expect((<Subject<void>>scrollObservable).next).toHaveBeenCalledTimes(1);
  });
});
