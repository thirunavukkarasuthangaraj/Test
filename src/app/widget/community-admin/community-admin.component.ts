import { AppSettings } from './../../services/AppSettings';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { JobService } from 'src/app/services/job.service';
@Component({
  selector: 'app-community-admin',
  templateUrl: './community-admin.component.html',
  styleUrls: ['./community-admin.component.scss']
})
export class CommunityAdminComponent implements OnInit {

  @Input('title') title: any = 'Community Admins ';
  @Input() inputData: string;
  headerTitle: any = 'Community Admins ';
  commonDatahide: any = {}
  @Output() commonFunction = new EventEmitter<string>();
  admin: any = []
  @Input() maxMin: any = {};
  @Input() page: string;
  loadAPIcall:boolean=false
  viewType: string = "MIN";
  imgUrl: any = AppSettings.photoUrl;
  userName: string;

  @Input() widgetDesc: string;

  constructor(private JobServicecolor: JobService,private auth: ApiService, private a_route: ActivatedRoute, private router: Router, private util: UtilService) {
  }

  route(item) {
    this.router.navigate(['personalProfile'], { queryParams: item });

  }
  modelopen(data) {
    let dataPass: any = {};
    dataPass.data = data;
    dataPass.master = this.page;
    dataPass.menu = this.widgetDesc;
    dataPass.masterMenu = this.inputData;
    dataPass.widgetName = "CommunityAdmins";
    this.router.navigate(['suggestions'], { queryParams: dataPass })
  }

  getInitials(fullname: string): string {
    return this.JobServicecolor.getInitials(fullname);
  }

  getColor(fullname: string): string {
    return this.JobServicecolor.getColor(fullname);
  }
  ngOnInit() {

    this.headerTitle = this.widgetDesc;
    this.a_route.queryParams.subscribe((res) => {
      if (res.master != "NETWORK" && res.master != "TEAM" && res.menu != null && res.menu != undefined) {
        this.headerTitle = res.menu;
      }
    })

    if (this.maxMin.viewType != undefined) {
      this.viewType = "MAX";
      this.inputData = this.maxMin.master;
    }
    if (this.inputData && this.inputData != null && this.inputData != "") {


      if (this.inputData == "BUSINESS") {
        this.viewType = "MAX";

      } else if (this.inputData == "COMMUNITY") {
this.loadAPIcall=true;
        this.auth.query("community/admins/" + localStorage.getItem('communityId')).subscribe((res) => {
          this.loadAPIcall=false;
          this.util.stopLoader()
          if (res && res.data.communityAdminsList.length != 0 && res.data.communityAdminsList != undefined && res.data.communityAdminsList != null) {
            this.viewType = "MIN";
            this.admin = res.data.communityAdminsList;

          } else {
            // this.hide(true)
            this.viewType = "MAX";
          }
        }, err => {
          this.util.stopLoader()

        });

      } else if (this.inputData == "HOME") {
        this.viewType = "MAX";
      }
    }


  }

  hide(flag) {
    this.commonDatahide.widgetName = "CommunityAdminComponent";
    this.commonDatahide.hide = flag;
    this.commonFunction.emit(this.commonDatahide);
  }

}


