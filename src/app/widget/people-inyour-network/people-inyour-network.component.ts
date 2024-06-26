import { ActivatedRoute, Router } from '@angular/router';
import { WidgetService } from './../../services/widget.service';
import { UtilService } from './../../services/util.service';
import { ApiService } from './../../services/api.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { UserCardConfig } from 'src/app/types/UserCardConfig';

@Component({
  selector: 'app-people-inyour-network',
  templateUrl: './people-inyour-network.component.html',
  styleUrls: ['./people-inyour-network.component.scss']
})
export class PeopleInyourNetworkComponent implements OnInit {

  headerTitle;
  peopelData: Array<any> = [];
  @Input() inputData: string;
  @Input() widgetDesc: string;
  @Input() page: string;
  @Input() master: string;
  title = 'People most active in your Network';

  viewType: string = "MIN";
  @Input() maxMin: any = {};
  pathdata: any;
  commonDatahide: any = {}
  @Output() commonFunction = new EventEmitter<string>();
  userCardConfig: UserCardConfig[] = []

  constructor(private auth: ApiService, private router: Router, private route: ActivatedRoute, private util: UtilService, private widget: WidgetService) {
  }

  ngOnInit() {

    if (this.maxMin.viewType != undefined) {
      this.viewType = "MAX";
      this.inputData = this.maxMin.master;
    }
    this.headerTitle = this.widgetDesc;

    this.route.queryParams.subscribe((res) => {
      this.pathdata = res;
      if (res.master != "NETWORK" && res.master != "TEAM" && res.menu != null && res.menu != undefined) {
        this.headerTitle = res.menu;
      }
    })


    this.getNetworkSuggestion();

  }

  modelopen(data) {
    let dataPass: any = {};
    dataPass.data = data;
    dataPass.master = this.page;
    dataPass.masterMenu = this.inputData;
    dataPass.menu = this.widgetDesc;
    dataPass.widgetName = "PeopleInyourNetworkComponent";
    this.router.navigate(['suggestions'], { queryParams: dataPass })
  }

  onScrollDown() { }

  getNetworkSuggestion() {

    if (this.inputData && this.inputData != "") {
      this.util.startLoader();
      if (this.inputData == "BUSINESS") {
        this.auth.query("widget/user/network/active/" + localStorage.getItem('userId') + "?activityType=BUSINESS&activityEntityId=" + localStorage.getItem('businessId') + "&page=0&size=3")
          .subscribe((res) => {
            this.util.stopLoader();
            if (res && res != null && res.length != 0) {
              this.peopelData = res;
            } else {
              this.hide(true);
            }
          }, err => {
            this.util.stopLoader();
            this.hide(true);
          });
      } else if (this.inputData == "COMMUNITY") {
        this.auth.query("widget/user/network/active/" + localStorage.getItem('userId') + "?activityType=COMMUNITY&activityEntityId=" + localStorage.getItem('communityId') + "&page=0&size=3")

          .subscribe((res) => {
            this.util.stopLoader();
            if (res && res != null && res.length != 0) {
              this.peopelData = res;
            } else {
              this.hide(true);
            }
          }, err => {
            this.util.stopLoader();
            this.hide(true);

          });
      } else if (this.inputData == "HOME") {
        this.auth.query("widget/user/network/active/" + localStorage.getItem('userId') + "?activityType=USER&activityEntityId=" + localStorage.getItem('userId') + "&page=0&size=3")
          .subscribe((res) => {
            this.util.stopLoader();
            if (res && res != null && res.length != 0) {
              this.peopelData = res;
            } else {
              this.hide(true);
            }
          }, err => {
            this.util.stopLoader();
            this.hide(true);

          });
      } else if (this.inputData == "HOME") {
        this.auth.query("widget/user/network/active/" + localStorage.getItem('userId') + "?activityType=USER&activityEntityId=" + localStorage.getItem('userId') + "&page=0&size=5")
          .subscribe((res) => {
            this.util.stopLoader();
            if (res && res != null && res.length != 0) {
              this.peopelData = res;
            } else {
              this.hide(true);
            }

          }, err => {
            this.util.stopLoader();
            this.hide(true);

            //  console.log(err)
          });
      } else {
        this.hide(true);
      }
    }
  }

  routes(userId: string) {
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate(['personalProfile'], { queryParams: { "userId": userId }, replaceUrl: true });
    });
  }

  connect(user: any) {
    this.util.startLoader();
    this.widget.connectService(user.userId).subscribe(conData => {
      this.util.stopLoader();
      if (conData.code === '00000') {
        this.widget.removeUserConnectionSuggesion(user['id']).subscribe(res => {
          if (res.code === '00000') {
            this.getNetworkSuggestion();
          }
        })
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Connection request",
          text: 'Connection request sent successfully',
          showConfirmButton: false,
          timer: 2000
        })
      } else if (conData.code === '88888') {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "Connection request",
          text: 'Connection request failed. Please try again later.',
          showConfirmButton: false,
          timer: 3000
        })
      }
    });
  }

  hide(flag) {
    this.commonDatahide.widgetName = "PeopleInyourNetworkComponent";
    this.commonDatahide.hide = flag;
    this.commonFunction.emit(this.commonDatahide);
  }


}
