import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SearchData } from 'src/app/services/searchData';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-net-navbarpage',
  templateUrl: './net-navbarpage.component.html',
  styleUrls: ['./net-navbarpage.component.scss']
})
export class NetNavbarpageComponent implements OnInit {
  pathdata: any={};
  menuSelected: any;
  membermenuflag: boolean = true;
  pendingCount: any;
  networkOwnerFlag: boolean = false;
  countrEmitter: Subscription;
  @Input()
  userDataInput: string;
  menus:any;
  commonVariables: any = {};

  constructor(
    private route: ActivatedRoute,
    private util: UtilService,
    private router: Router,
    private SearchData: SearchData,
    private api: ApiService) {
    this.countrEmitter = this.SearchData.getCommonVariables().subscribe((res) => {
        this.pendingCount = res.pendingCount;
    });
  }

  ngOnInit() {

      this.route.queryParams.subscribe((res) => {
      this.pathdata = res;
      if(this.userDataInput != undefined)   this.menus = this.userDataInput;
      else this.menus = res.menu
      if (localStorage.getItem("userId") === this.pathdata.networkOwnerId) {
        this.networkOwnerFlag = true;
        if (this.menus == "member") {
          this.membermenuflag = false;
        }
        else if (this.menus == "members") {
          this.membermenuflag = false;
        } else if (this.menus == "inviteSent") {
          this.membermenuflag = false;
        }
      }
       this.api.query("network/invite/sent/" + this.pathdata.networkId).subscribe((res) => {
        this.commonVariables.pendingCount = res.data.SentRequests.length;
        this.SearchData.setCommonVariables(this.commonVariables);
       },err => {
        this.util.stopLoader();
      });

    });



  }
  down(val) {
    if (val == 'down') {
      this.membermenuflag = false;
    } else if (val == 'up') {
      this.membermenuflag = true;
    }
    event.stopPropagation();

  }
  menuclick(name) {
    let values:any={};
    this.menus=name;
    let x = JSON.parse(JSON.stringify(this.pathdata));
    values=x
    values.menu=name;

    this.router.navigateByUrl('networkPage', {skipLocationChange: true}).then(() => {
      // this.router.navigate(['landingPage/'+ menuName]);
      this.router.navigate(["networkPage/" + name], { queryParams:values });

    });

    if (name == "inviteSent") {
      // this.membermenuflag = true;
    } else if (name == "member") {
      // this.membermenuflag = false;
    } else if (name == "members") {
      // this.membermenuflag = false;

    }
    const usId = localStorage.getItem("userId");
    this.util.startLoader();
    this.api.query("network/invite/sent/" + this.pathdata.networkId).subscribe((res) => {
      this.util.stopLoader();
      this.commonVariables.pendingCount = res.data.SentRequests.length;
      this.SearchData.setCommonVariables(this.commonVariables);
      // localStorage.setItem("pendingCount", res.data.Teams.length);
    },err => {
      this.util.stopLoader();
    });

  }
}
