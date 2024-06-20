import { UtilService } from './../../../services/util.service';
import { ApiService } from './../../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchData } from 'src/app/services/searchData';
import { UserCardConfig } from 'src/app/types/UserCardConfig';
import Swal from "sweetalert2";
import { constant } from 'lodash';
import { User } from 'src/app/types/User';

@Component({
  selector: 'app-invite-member',
  templateUrl: './invite-member.component.html',
  styleUrls: ['./invite-member.component.scss']
})
export class InviteMemberComponent   implements OnInit {
  pathdata;
  inviteLength;
  ownerFlag: boolean = false;
  membersData: any;
  teamMembersSearch:any;
  userCardConfig: UserCardConfig[] = [];
  commonVariables: any = {};
  showNoDatafound: boolean = false;
  noDatafound : Array<string> = ["You have no invitations sent lately"];
  tempmembersData:any;
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

      this.pathdata = res;
      if (res.networkId == undefined) {
        // this.pathdata.teamId = null;
      }
      if (localStorage.getItem("userId") == this.pathdata.networkOwnerId) {
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

  sendMessage(user: User) {
    var userData: any = {};
    userData.groupId = user.userId;
    userData.type = "USER";
    this.router.navigate(["message"], { queryParams: userData });
  }


  connect(user: User) {

  }

  loadAPIcall:boolean=false
  getInviteList() {
    this.loadAPIcall=true
    this.util.startLoader();
    this.api
      .query("network/invite/sent/" + this.pathdata.networkId)
      .subscribe((res) => {
        this.loadAPIcall=false
        this.membersData = "";
        this.membersData = res.data.SentRequests;
        this.membersData = this.sort_by_key( res.data.SentRequests, "firstName");
        this.tempmembersData = this.membersData;
        this.inviteLength = res.data.SentRequests.length;
        this.commonVariables.pendingCount = res.data.SentRequests.length;
        this.SearchData.setCommonVariables(this.commonVariables);
        this.membersData.forEach(element => {
          let buttonConfig: UserCardConfig[] = [];
          element.userName = element.firstName + " " + element.lastName;
            if (
              (element.connectionStatus == "CONNECTED" ||
              element.connected)
            ) {
              let sendMessage: UserCardConfig = new UserCardConfig(
                "Send Message",
                this.sendMessage,
                null,
                true
              );
              sendMessage.source = this;
              buttonConfig.push(sendMessage);
            }else if (element.connectionStatus == "NOT_CONNECTED" ||
            !element.connected){
               let connect: UserCardConfig = new UserCardConfig(
                "Connect",
                this.connect,
                null,
                true
              );
              connect.source = this;
              buttonConfig.push(connect);
            }
         });

      },err => {
        this.util.stopLoader();
      });
    this.util.stopLoader();
  }

  cancelInvite(data) {
    const obj: any = {};
    obj.networkId = this.pathdata.networkId;
    obj.memberUserId =data.userId;
    this.api.create("network/cancel/invite", obj).subscribe((res) => {
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
