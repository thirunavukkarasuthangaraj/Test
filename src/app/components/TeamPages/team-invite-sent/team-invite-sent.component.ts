import { SearchData } from 'src/app/services/searchData';
import { Component, OnInit, TemplateRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { UtilService } from "src/app/services/util.service";
import { UserCardConfig } from "src/app/types/UserCardConfig";
import Swal from "sweetalert2";

@Component({
  selector: "app-team-invite-sent",
  templateUrl: "./team-invite-sent.component.html",
  styleUrls: ["./team-invite-sent.component.scss"],
})
export class TeamInviteSentComponent implements OnInit {
  pathdata;
  inviteLength;
  ownerFlag: boolean = false;
  membersData: any;
  tempmembersData:any;
  teamMembersSearch:any;
  userCardConfig: UserCardConfig[] = [];
  commonVariables: any = {};
  showNoDatafound: boolean = false;
  loadAPIcall:boolean=false
  noDatafound : Array<string> = ["You have no invitations sent lately"];
  searchKey
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private SearchData: SearchData,
    private api: ApiService,
    private util: UtilService
  ) {}

  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.queryParams.subscribe((res) => {
     // //// console.log("this is query params sent");
     // //// console.log(res);
      this.pathdata = res;
      if (res.teamId == undefined) {
        // this.pathdata.teamId = null;
      }
      if (localStorage.getItem("userId") == this.pathdata.teamsOwnerId) {
        this.ownerFlag = true;
        let revokeBtn: UserCardConfig = new UserCardConfig(
          "Cancel Invitation",
          this.cancelInvite,
          this.canShow,
          true
        );
        revokeBtn.source = this;
        this.userCardConfig.push(revokeBtn);
      } else {
        this.ownerFlag = false;
      }
    });
    // if (this.pathdata.teamId != "") {
    this.getInviteList();
    // }
  }
  dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      if (sortOrder == -1) {
        return b[property].localeCompare(a[property]);
      } else {
        return a[property].localeCompare(b[property]);
      }
    }
  }
  getInviteList() {
    this.loadAPIcall=true
    this.api
      .query("teams/member/invites/sent/" + this.pathdata.teamId)
      .subscribe((res) => {
        this.loadAPIcall=false
        this.membersData = "";
        this.membersData = res.data.TeamsMember;
        this.membersData = this.sort_by_key( res.data.TeamsMember, "firstName");
        this.tempmembersData=this.membersData;
         this.inviteLength = res.data.TeamsMember.length;
         this.commonVariables.pendingCount = res.data.TeamsMember.length;
         this.SearchData.setCommonVariables(this.commonVariables);
         this.membersData.forEach(element => {
          element.userName = element.firstName + " " + element.lastName;
         });

      },err => {
        this.util.stopLoader();
      });
    this.util.stopLoader();
  }

  keyupdata(event){
    if(event.target.value.length==0){
      this.onsearch('');
    }
  }

  onsearch(val) {
    if(val!=undefined){
      val = val.trim().toLowerCase();
    }
    this.membersData =this.tempmembersData
    this.membersData = this.filterByString(this.membersData, val);
   if (this.membersData.length == 0) {
     this.showNoDatafound = true;
   } else {
     this.showNoDatafound = false;
   }

 }
 filterByString(data, s) {
  return data.filter(e => e.userName.toLowerCase().includes(s))
    .sort((a, b) => a.userName.toLowerCase().includes(s) && !b.userName.toLowerCase().includes(s) ? -1 : b.userName.toLowerCase().includes(s) && !a.userName.toLowerCase().includes(s) ? 1 : 0);
}
  cancelInvite(data) {
    const obj: any = {};
    obj.teamMemberId = data.teamMemberId;
    this.api.create("teams/member/invites/cancel", obj).subscribe((res) => {
      if (res.code == "00000") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Invitation cancelled",
          showConfirmButton: false,
          timer: 2000,
        });
        this.getInviteList();
      }
    },err => {
      this.util.stopLoader();

     });
  }

  canShow(data, source) {
    return true;
  }

  sort_by_key(array, key) {
    return array.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }
}
