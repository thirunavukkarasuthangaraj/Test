import { countProvider } from 'src/app/components/suggestions/suggestions.component';
import { UserCardConfig } from './../../types/UserCardConfig';
import { ActivatedRoute, Router } from '@angular/router';
import { WidgetService } from './../../services/widget.service';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { User } from 'src/app/types/User';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { CommonValues } from 'src/app/services/commonValues';
import { AppSettings } from 'src/app/services/AppSettings';

@Component({
  selector: 'app-people-you-may-know',
  templateUrl: './people-you-may-know.component.html',
  styleUrls: ['./people-you-may-know.component.scss']
})
export class PeopleYouMayKnowComponent implements OnInit, OnDestroy {
  loadAPIcall:boolean=true
  @Input('title') title: string = 'People you may know';
  @Input('open') open: boolean = true;
  @Input() userDataInput: any;
  headerTitle: string = 'People you may know';
  user: any = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }];
  peopleData: any = [];
  commonDatahide: any = {}
  @Output() commonFunction = new EventEmitter<string>();
  @Input() maxMin: any = {};
  viewType: string = "MIN";
  @Input() page: string;
  @Input() inputData: string;
  userCardConfig: UserCardConfig[] = []
  showUI = false;
  stopScroll : boolean = false;
  prevAfterkey : string = "";
  UserdataPeople: any = [];
  clickEventsubscription: Subscription;
  values: any = {};
  pathdata: any;
  @Input() widgetDesc: string;
  obj: any = {
    limit: 12,
    userId: localStorage.getItem('userId'),
    searchAfterKey: null
  }
  constructor(private auth: ApiService, private route: ActivatedRoute,
    private provider : countProvider ,private commonvalues: CommonValues, private router: Router, private util: UtilService, private widget: WidgetService) {
    // this.headerTitle = this.title;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  totalCount: any;
  configlist = {
    itemsPerPage: 5,
    currentPage: 1
  }
  ngOnInit() {
    if (this.widgetDesc != null) {
      this.headerTitle = this.widgetDesc;
    } else {
      this.headerTitle = "error";

    }
    // this.hide(true);
    if (this.maxMin.viewType != undefined) {
      this.viewType = "MAX";
      this.inputData = this.maxMin.master;
    }


    this.getUser();
    //  this.getUserData();
    this.clickEventsubscription = this.commonvalues
      .getbusinessid()
      .subscribe((res) => {
        this.values = res;
      });



    this.route.queryParams.subscribe((res) => {
      this.pathdata = res.count;
      if (res.master && res.master != "NETWORK" && res.master != "TEAM" && res.menu != null && res.menu != undefined) {

        this.headerTitle = res.menu;
      }
      this.totalCount = this.pathdata;
    })

  }


ngOnDestroy(): void {
    if(this.clickEventsubscription) {
      this.clickEventsubscription.unsubscribe();
    }
}

  modelopen(data) {
    let dataPass: any = {};
    dataPass.data = data;
    dataPass.menu = this.widgetDesc;
    dataPass.master = this.page;
    dataPass.masterMenu = this.inputData;
    dataPass.widgetName = "PeopleYouMayKnowComponent";
    dataPass.count = this.totalCount;
    this.router.navigate(['suggestions'], { queryParams: dataPass })

  }



  pagecount(event) {
    this.configlist.currentPage = event;
    this.page = event;
    this.loadData(this.page);
  }

  loadData(count) {

    this.util.startLoader();
    let num: number;
    num = count - 1;
    this.peopleData = [];
    this.auth.query('widget/user/suggestion?userId=' + localStorage.getItem('userId') + "&page=" + num + "&size=8").subscribe((res) => {
      this.UserdataPeople = [];
      if (res.data.peopleYouMayKnowList != null && res.data.peopleYouMayKnowList.length !== 0) {
        this.util.stopLoader();

        this.UserdataPeople = res.data.peopleYouMayKnowList;
        res.data.peopleYouMayKnowList.forEach(element => {

          element.name = element.firstName + " " + element.lastName;

        });
        this.showUI = true;
        this.totalCount = this.pathdata;
      } else {
        this.util.stopLoader();
      }
    }, err => {
      this.util.stopLoader();


    });
  }

  refreshPeopleMayYouKnow() {
    this.obj.searchAfterKey=null
    this.getUser();
  }



  onScrollDown(){
    if (!this.stopScroll && this.obj.searchAfterKey != this.prevAfterkey) {
      this.loadAPIcall = true;
      this.obj.searchAfterKey = this.prevAfterkey === null ? null
      : this.prevAfterkey;
      this.getUser();
    }
  }
  getUser() {

    this.auth.create("widget/user/suggestion", this.obj).subscribe((res) => {
      this.loadAPIcall = false;
      this.util.stopLoader();
      if (res.data != null) {
        const resData = res.data.peopleYouMayKnowList;
        const afterKey = res.data.searchAfterKey && res.data.searchAfterKey;
        if (resData) {
          if (this.prevAfterkey === afterKey || resData.length === 0) {
            this.stopScroll = true;
          }

          resData.forEach(element => {
            element.name = element.firstName + " " + element.lastName;
            if (element.userType) {
              element.typeofuser = element.userType.replaceAll("_", " ");
            }
          });
          this.UserdataPeople = this.UserdataPeople.concat(resData);
          this.prevAfterkey = afterKey;
          if (res.data.totalCount != undefined) {
            this.totalCount = res.data.totalCount;
            this.provider.setCount(this.totalCount);
          }
          this.showUI = true;
          this.hide(false);
        }
      }


    }, err => {
      this.loadAPIcall=false
      this.util.stopLoader();
      this.hide(true)
    });
  }




  connect(user: any) {
    this.util.startLoader();
    this.widget.connectService(user.userId).subscribe(conData => {
      this.util.stopLoader();
      if (conData.code === '00000') {
        this.widget.removeUserConnectionSuggesion(user.userId).subscribe(res => {
          if (res.code === '00000') {
            this.getUser();
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
        // Swal.fire('Connection request failed');
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
    // this.commonDatahide.widgetName = "PeopleYouMayKnowComponent";
    // this.commonDatahide.hide = flag;
    // this.commonFunction.emit(this.commonDatahide);
  }
}
