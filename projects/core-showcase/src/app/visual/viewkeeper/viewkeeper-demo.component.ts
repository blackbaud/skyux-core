import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-viewkeeper-demo',
  templateUrl: './viewkeeper-demo.component.html',
  styleUrls: ['./viewkeeper-demo.component.scss']
})
export class ViewkeeperDemoComponent {

  public el2Visible: boolean = false;

  public scrollableHost: boolean = false;

  public toggleEl2(): void {
    this.el2Visible = !this.el2Visible;
  }

  public toggleScrollableHost(): void {
    this.scrollableHost = !this.scrollableHost;
  }
}
