import { UtilService } from './../../services/util.service';
import { WidgetService } from './../../services/widget.service';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-collegue-you-may-know',
  templateUrl: './collegue-you-may-know.component.html',
  styleUrls: ['./collegue-you-may-know.component.scss']
})
export class CollegueYouMayKnowComponent implements OnInit {

  @Input('title') title: string = 'Colleagues you may know';

  headerTitle: string = 'Colleagues you may know';
  user: any = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }];
  responseData = []
  commonDatahide: any = {}
  @Output() commonFunction = new EventEmitter<string>();
  @Input() maxMin: any = {};
  @Input() page: string;
  @Input() inputData: string;
  viewType: string = "MIN";
  @Input() widgetDesc: string;

  constructor(private auth: ApiService, private a_route: ActivatedRoute, private router: Router, private widget: WidgetService, private util: UtilService) {
  }

  ngOnInit() {
    if (this.maxMin.viewType != undefined) {
      this.viewType = "MAX";
      this.inputData = this.maxMin.master;
    }
    this.headerTitle = this.widgetDesc;
    this.a_route.queryParams.subscribe((res) => {
      if (res.master && res.menu != null && res.menu != undefined) {
        this.headerTitle = res.menu;
      }
    })
    this.getConnectSuggestion();
  }
  modelopen(data) {
    let dataPass: any = {};
    dataPass.data = data;
    dataPass.master = this.page;
    dataPass.menu = "Colleagues you may know";
    dataPass.masterMenu = this.inputData;
    dataPass.widgetName = "CollegueYouMayKnowComponent";
    this.router.navigate(['suggestions'], { queryParams: dataPass })
  }

  getConnectSuggestion() {
    // this.hide(true)
    this.util.startLoader()
    this.auth.query("business/collegues/connect/suggestion/" + localStorage.getItem('businessId')).subscribe((res) => {
      this.util.stopLoader()
      if (res && res.length != 0 && res != null) {
        if (res.data && res.data.length != 0 && res.data != null && res.data.ColleguesList != null && res.data.ColleguesList.length != 0) {
          this.responseData = res.data.ColleguesList == null ? [] : res.data.ColleguesList;
          // this.hide(false)
        } else {
          this.hide(true)
        }
      } else {
        this.hide(true)
      }
    }, err => {
      this.util.stopLoader()
      this.hide(true)
    });
  }

  connect(user: any) {
    this.widget.connectService(user.userId).subscribe(conData => {
      this.util.stopLoader();
      if (conData.code === '00000') {
        this.getConnectSuggestion();
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: 'Connection request sent successfully',
          showConfirmButton: false,
          timer: 3000
        })
      } else if (conData.code === '88888') {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Request failed",
          text: 'Connection request failed. Please try again later.',
          showConfirmButton: false,
          timer: 1500
        })
      }
    });
  }

  hide(flag) {
    this.commonDatahide.widgetName = "CollegueYouMayKnowComponent";
    this.commonDatahide.hide = flag;
    this.commonFunction.emit(this.commonDatahide);
  }
}

