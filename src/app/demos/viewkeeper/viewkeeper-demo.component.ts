import {
  AfterViewInit,
  Component // ,
  // ViewChild,
  // ElementRef
} from '@angular/core';

// import {
//   SkyViewkeeperService
// } from '../../public';

@Component({
  selector: 'app-viewkeeper-demo',
  templateUrl: './viewkeeper-demo.component.html',
  styleUrls: ['./viewkeeper-demo.component.scss']
})
export class ViewkeeperDemoComponent implements AfterViewInit {

  public el2Visible: boolean;

  // @ViewChild('el1')
  // private el1: ElementRef;

  // @ViewChild('el2')
  // private el2: ElementRef;

  // @ViewChild('wrapper')
  // private wrapper: ElementRef;

  // constructor(private viewkeeperSvc: SkyViewkeeperService) { }

  public showEl2() {
    this.el2Visible = true;
  }

  public ngAfterViewInit() {
    // this.viewkeeperSvc.create({
    //   boundaryEl: this.wrapper.nativeElement,
    //   el: this.el1.nativeElement,
    //   setWidth: true
    // });

    // this.viewkeeperSvc.create({
    //   boundaryEl: this.wrapper.nativeElement,
    //   el: this.el2.nativeElement,
    //   verticalOffsetEl: this.el1.nativeElement,
    //   setWidth: true
    // });
  }

}
