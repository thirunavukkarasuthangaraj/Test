import { forEach } from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

// export interface businessButtonConfig {
//   isButtonDisabled: boolean,
//   isValueChanged: boolean
// }
@Component({
  selector: 'app-nodata-found',
  templateUrl: './nodata-found.component.html',
  styleUrls: ['./nodata-found.component.scss']
})
export class NodataFoundComponent implements OnInit, OnChanges {
  @Input() title: Array<string>;
  @Input() buttonName: string;
  @Input() isButtonDisabled: boolean = false;
  @Output() clickButton = new EventEmitter<boolean>();
  headerTitle
  @Input() widgetDesc: string;
  buttonShow = true;
  constructor(private a_route: ActivatedRoute) { }
  userType: any = localStorage.getItem('userType');

  ngOnInit() {
    if (this.userType == 'JOB_SEEKER') {
      this.buttonShow = false;
    }

    this.headerTitle = this.widgetDesc;
    this.a_route.queryParams.subscribe((res) => {
      if (res.master != "NETWORK" && res.master != "TEAM" && res.menu != null && res.menu != undefined) {
        this.headerTitle = res.menu;
      }
    })
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isButtonDisabled && changes.isButtonDisabled.currentValue != changes.isButtonDisabled.previousValue) {
      this.isButtonDisabled = this.isButtonDisabled;
    }
  }

  setBold(value: string): boolean {
    if (value[0] === 'b') {
      return true;
    }
    return false;
  }

  open() {
    // this.isButtonDisabled = true;
    this.clickButton.emit(true);
  }

  removeB(value: string): string {
    return value.substring(2, value.length);
  }

}
