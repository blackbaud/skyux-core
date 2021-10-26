import { Component, ElementRef, ViewChild } from "@angular/core";

@Component({
  selector: 'sky-scrollable-parent-host-fixture',
  styleUrls: ['./scrollable-parent-host.component.fixture.scss'],
  templateUrl: './scrollable-parent-host.component.fixture.html'
})
export class ScrollableParentHostFixtureComponent {

  public isParentScrollable: boolean = true;

  @ViewChild('parent')
  public parent: ElementRef;

  @ViewChild('target')
  public target: ElementRef;

}
